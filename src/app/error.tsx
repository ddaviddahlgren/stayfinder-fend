"use client";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>An unexpected error occured.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
