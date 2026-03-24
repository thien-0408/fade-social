export default function FireIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 7.1 10c0-2-2.33-3-3.1-6 2.5 0 3-3 4-4s1 2.5 1 4c0 1.5 2 2.5 2 2.5s-1-4.5 2-6c3 3 5 7.5 5 11s-2.001 5.001-2.001 5.001a4 4 0 01-2.342 2.156z" />
    </svg>
  );
}
