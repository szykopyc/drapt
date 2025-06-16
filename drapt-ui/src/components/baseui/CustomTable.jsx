export default function CustomTable({ maxHeight = null, data }) {
  if (!data || data.length === 0) return null;

  const labels = Object.keys(data[0]);

  const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const style = maxHeight ? { maxHeight, overflowY: "auto" } : {};

  return (
    <div className="overflow-x-auto w-full" style={style}>
      <table className="w-full table-sm md:table table-zebra">
        <thead>
          <tr>
            {labels.map((label) => (
              <th key={label} className="text-left">{capitalise(label)}</th>
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