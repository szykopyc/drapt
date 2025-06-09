export function CustomTable({ maxHeight = null, data }) {
  if (!data || data.length === 0) return null;

  const labels = Object.keys(data[0]);

  const style = maxHeight ? { maxHeight, overflowY: "auto" } : {};

  return (
    <div className="overflow-x-auto w-full" style={style}>
      <table className="w-full table-sm md:table table-zebra">
        <thead>
          <tr>
            {labels.map((label) => (
              <th key={label} className="text-left">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {labels.map((label) => (
                <td key={label} className="text-left">{row[label] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}