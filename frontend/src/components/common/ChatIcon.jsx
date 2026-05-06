export default function ChatIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 5.75A3.25 3.25 0 0 1 7.75 2.5h8.5a3.25 3.25 0 0 1 3.25 3.25v6.5a3.25 3.25 0 0 1-3.25 3.25H11l-4.4 3.3a.8.8 0 0 1-1.28-.64V15.4A3.25 3.25 0 0 1 2.5 12.2V5.75Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M7.75 6.8h8.5M7.75 10h6.8M7.75 13.2h4.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
