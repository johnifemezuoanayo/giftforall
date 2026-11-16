type IconProps = { className?: string };

const heart =
  "M32 50C32 50 24 45 24 40.5C24 38 26 36.5 28 36.5C29.6 36.5 31.2 37.4 32 39C32.8 37.4 34.4 36.5 36 36.5C38 36.5 40 38 40 40.5C40 45 32 50 32 50Z";

function Sparks() {
  return (
    <g strokeWidth="3.5" strokeLinecap="round">
      <path d="M32 2V8" />
      <path d="M20.5 5.5L24 10" />
      <path d="M43.5 5.5L40 10" />
    </g>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className} aria-hidden>
      <Sparks />
      <ellipse cx="26" cy="20" rx="6" ry="3.6" strokeWidth="3.5" transform="rotate(-25 26 20)" />
      <ellipse cx="38" cy="20" rx="6" ry="3.6" strokeWidth="3.5" transform="rotate(25 38 20)" />
      <rect x="15" y="34" width="34" height="22" rx="2.5" strokeWidth="4" fill="white" />
      <rect x="11" y="24" width="42" height="11" rx="2.5" fill="currentColor" stroke="none" />
      <rect x="29" y="24" width="6" height="11" fill="white" stroke="none" />
      <rect x="29" y="35" width="6" height="21" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className} aria-hidden>
      <Sparks />
      <path d="M24 26V21.5C24 17 27.6 13.5 32 13.5C36.4 13.5 40 17 40 21.5V26" strokeWidth="4" strokeLinecap="round" />
      <path d="M13 25H51L47.5 57H16.5L13 25Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d={heart} fill="white" stroke="none" />
    </svg>
  );
}

export function UnlockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className} aria-hidden>
      <path d="M21 30V19C21 13 26 8.5 32 8.5C38 8.5 43 13 43 19V22" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="12" y="29" width="40" height="28" rx="5" fill="currentColor" stroke="none" />
      <path d={heart} fill="white" stroke="none" transform="translate(0 -0.5)" />
      <path d="M50 11L54 8M51.5 17H56" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
