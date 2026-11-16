"use client";

import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from "react";
import { createSavedList } from "@/lib/saved-list";
import type { Product } from "@/types";

type Toast = {
  id: number;
  product: Product;
};

type SavedContextValue = {
  saved: Product[];
  isReady: boolean;
  isSaved: (productId: string) => boolean;
  toggleSaved: (product: Product) => void;
  removeSaved: (productId: string) => void;
  drawerOpen: boolean;
  openSaved: () => void;
  closeSaved: () => void;
  toast: Toast | null;
  hideToast: () => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);

// Keep this storage key so items people saved before this change still show up.
const savedList = createSavedList("gift-site-favorites");

const noSubscribe = () => () => {};

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const saved = useSyncExternalStore(savedList.subscribe, savedList.get, savedList.getServerList);
  // False during the server render, so saved counts only show once the browser has loaded them.
  const isReady = useSyncExternalStore(noSubscribe, () => true, () => false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => setToast(null), []);

  const isSaved = useCallback((productId: string) => saved.some((item) => item.id === productId), [saved]);

  const removeSaved = useCallback((productId: string) => {
    savedList.set(savedList.get().filter((item) => item.id !== productId));
  }, []);

  const toggleSaved = useCallback((product: Product) => {
    const current = savedList.get();
    if (current.some((item) => item.id === product.id)) {
      savedList.set(current.filter((item) => item.id !== product.id));
      return;
    }
    savedList.set([...current, product]);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), product });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const openSaved = useCallback(() => {
    setDrawerOpen(true);
    setToast(null);
  }, []);

  const closeSaved = useCallback(() => setDrawerOpen(false), []);

  return (
    <SavedContext.Provider
      value={{ saved, isReady, isSaved, toggleSaved, removeSaved, drawerOpen, openSaved, closeSaved, toast, hideToast }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSaved must be used inside SavedProvider");
  return value;
}
