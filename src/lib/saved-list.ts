import type { Product } from "@/types";

const emptyList: Product[] = [];

// A small list saved in localStorage that React components can subscribe to.
export function createSavedList(storageKey: string) {
  let list: Product[] | null = null;
  const listeners = new Set<() => void>();

  function read(): Product[] {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function get() {
    if (list === null) list = read();
    return list;
  }

  function set(next: Product[]) {
    list = next;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Storage can be blocked in private windows. The list still works for this visit.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function getServerList() {
    return emptyList;
  }

  return { get, set, subscribe, getServerList };
}
