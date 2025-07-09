export default function TextWithLabelDescription({ label, children }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <p className="text-base-content/70">{label}</p>
      <div>
        {children}
      </div>
    </div>
  );
}
