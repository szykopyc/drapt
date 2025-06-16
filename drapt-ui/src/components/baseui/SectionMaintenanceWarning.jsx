export default function SectionMaintenanceWarning({children, ...props}) {
  return (
    <div className="card card-border bg-error border-black shadow-md hover:shadow-lg transition-shadow" {...props}>
      <div className="card-body">
        <h2 className="card-title text-2xl">This section is under maintenance</h2>
        <p>Szymon is currently working on this section. Come back another time.</p>
      </div>
    </div>
  );
}