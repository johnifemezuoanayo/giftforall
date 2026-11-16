"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Lightbulb, Mail } from "lucide-react";
import { publicApiUrl } from "@/config/site";

const reasons = [
  { id: "question", label: "General question" },
  { id: "problem", label: "Report a problem or broken link" },
  { id: "suggestion", label: "Suggest a gift" },
  { id: "partnership", label: "Partnerships & advertising" },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

const fieldClass =
  "w-full rounded-xl border bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-stone/70 focus:border-forest";

export function ContactSection({ email }: { email: string }) {
  const [reason, setReason] = useState("question");
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function startSuggestion() {
    setReason("suggestion");
    if (!message) setMessage("I found a gift you might like: ");
    messageRef.current?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Errors = {};
    if (!name.trim()) found.name = "Please tell us your name.";
    if (!emailPattern.test(fromEmail.trim())) found.email = "Please enter a valid email address.";
    if (message.trim().length < 10) found.message = "Please write a little more (at least 10 characters).";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch(`${publicApiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, name: name.trim(), email: fromEmail.trim(), message: message.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrors({ form: data.message ?? "Something went wrong. Please try again." });
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setErrors({ form: "We couldn't reach the server. Please try again in a moment." });
      setStatus("idle");
    }
  }

  function resetForm() {
    setName("");
    setFromEmail("");
    setMessage("");
    setReason("question");
    setStatus("idle");
  }

  const borderFor = (field: keyof Errors) => (errors[field] ? "border-clay" : "border-line");

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="rounded-3xl bg-white p-6 shadow-[0_24px_50px_-35px_rgba(29,27,24,0.35)] md:p-10 lg:col-span-8">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-mint text-forest">
            <Mail className="size-5" aria-hidden />
          </span>
          <h2 id="contact-title" className="font-display text-2xl md:text-3xl">
            contact us
          </h2>
        </div>
        <p className="mt-3 max-w-lg text-ink-soft">
          Questions, broken links, gift ideas or partnership pitches. We read everything and usually reply within a
          couple of working days.
        </p>

        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl bg-mint px-6 py-10 text-center"
              role="status"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-forest text-white">
                <Check className="size-6" aria-hidden />
              </span>
              <p className="mt-4 text-lg font-semibold">Thanks, {name.trim().split(" ")[0]}! Your message is on its way.</p>
              <p className="mt-1 text-sm text-ink-soft">We&apos;ll reply to {fromEmail.trim()} as soon as we can.</p>
              <button type="button" onClick={resetForm} className="mt-5 text-sm font-semibold text-forest underline underline-offset-4">
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label htmlFor="contact-reason" className="mb-1.5 block text-sm font-semibold">
                  What are you contacting us about?
                </label>
                <div className="relative">
                  <select
                    id="contact-reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className={`${fieldClass} h-12 appearance-none border-line pr-10`}
                  >
                    {reasons.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-stone" aria-hidden />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={`${fieldClass} h-12 ${borderFor("name")}`}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-sm text-clay-dark">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    value={fromEmail}
                    onChange={(event) => setFromEmail(event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={`${fieldClass} h-12 ${borderFor("email")}`}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-sm text-clay-dark">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold">
                  Your message
                </label>
                <textarea
                  id="contact-message"
                  ref={messageRef}
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`${fieldClass} resize-y py-3 ${borderFor("message")}`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-sm text-clay-dark">
                    {errors.message}
                  </p>
                )}
              </div>

              {errors.form && (
                <p className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay-dark" role="alert">
                  {errors.form}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <p className="text-xs text-stone">
                  Prefer email? Write to{" "}
                  <a href={`mailto:${email}`} className="font-semibold text-forest underline underline-offset-4">
                    {email}
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-12 rounded-full bg-forest px-8 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <aside className="flex flex-col justify-center rounded-3xl bg-forest p-8 text-paper md:p-10 lg:col-span-4" aria-labelledby="suggest-title">
        <span className="grid size-12 place-items-center rounded-full bg-gold text-ink">
          <Lightbulb className="size-6" aria-hidden />
        </span>
        <h2 id="suggest-title" className="mt-5 font-display text-2xl leading-tight md:text-3xl">
          found something brilliant?
        </h2>
        <p className="mt-3 leading-relaxed text-paper/85">
          Spotted a gift that belongs here, or make one yourself? Tell us about it. If our editors love it as much as
          you do, we&apos;ll add it to the collection.
        </p>
        <button
          type="button"
          onClick={startSuggestion}
          className="mt-7 h-12 w-fit rounded-full bg-gold px-7 text-sm font-semibold text-ink transition-colors hover:bg-white"
        >
          Suggest a gift
        </button>
      </aside>
    </div>
  );
}
