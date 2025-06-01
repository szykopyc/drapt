export default function LargeCodeBlock({ children }) {
  return (
    <pre className="bg-neutral text-neutral-content rounded-md p-4 overflow-x-auto text-sm font-mono">
      <code>{children}</code>
    </pre>
  );
}