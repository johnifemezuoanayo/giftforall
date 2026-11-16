import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "outline" | "light";
  className?: string;
};

const styles = {
  dark: "bg-ink text-paper hover:bg-clay",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-white",
};

export function ButtonLink({ href, children, variant = "dark", className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center gap-2 px-7 text-sm font-semibold tracking-wide transition-colors duration-300 active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
