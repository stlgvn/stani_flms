// Small "Uniq." sign-off used at the end of the landing page and the dashboard.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-display text-[2rem] leading-none sm:text-[2.75rem]">
        Uniq<span className="text-dot">.</span>
      </span>
      <span className="label mt-1.5 text-[9px] text-muted">by Stani Flms</span>
    </div>
  );
}
