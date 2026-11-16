"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { publicApiUrl } from "@/config/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type NewsletterFormProps = {
  // Must be unique on the page, because the homepage and footer can both have a form.
  id: string;
  tone?: "light" | "green";
  className?: string;
};

const tones = {
  light: {
    input: "border-paper bg-paper text-ink focus:border-ink",
    button: "bg-ink text-paper hover:bg-clay",
    note: "text-stone",
    error: "text-clay-dark",
    done: "bg-paper text-ink",
    tick: "bg-olive text-paper",
  },
  green: {
    input: "border-line bg-white text-ink focus:border-forest",
    button: "bg-forest text-white hover:bg-forest-dark",
    note: "text-stone",
    error: "text-clay-dark",
    done: "bg-white text-ink",
    tick: "bg-forest text-white",
  },
};

export function NewsletterForm({ id, tone = "light", className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const style = tones[tone];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("sending");

    try {
      const response = await fetch(`${publicApiUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: id }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("We couldn't reach the server. Please try again in a moment.");
      setStatus("idle");
    }
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-xl px-5 py-4 ${style.done}`}
            role="status"
          >
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${style.tick}`}>
              <Check className="size-4" aria-hidden />
            </span>
            <span className="text-left text-sm">
              <strong className="block">You&apos;re on the list.</strong>
              Look out for our next email soon.
            </span>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <label htmlFor={`${id}-email`} className="sr-only">
                Email address
              </label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Your email address"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : `${id}-note`}
                className={`h-12 w-full border px-4 text-sm outline-none transition-colors placeholder:text-stone sm:flex-1 ${style.input} ${
                  error ? "border-clay" : ""
                }`}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className={`h-12 px-7 text-sm font-semibold transition-colors disabled:opacity-60 ${style.button}`}
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
            {error ? (
              <p id={`${id}-error`} className={`mt-3 text-left text-sm ${style.error}`} role="alert">
                {error}
              </p>
            ) : (
              <p id={`${id}-note`} className={`mt-3 text-xs ${style.note}`}>
                No spam. Unsubscribe any time.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
