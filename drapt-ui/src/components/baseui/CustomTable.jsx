export default function CustomTable({
    data,
    columns = null,
    maxHeight = null,
    noScrollbar = false,
}) {
    if (!data || data.length === 0) return null;

    // Support columns as array of strings or array of {key, label}
    let labels, keys;
    if (columns && columns.length > 0 && typeof columns[0] === "object") {
        keys = columns.map((col) => col.key);
        labels = columns.map((col) => col.label);
    } else {
        keys = Object.keys(data[0]);
        labels = keys;
    }

    const capitalise = (str) =>
        typeof str === "string"
            ? str.charAt(0).toUpperCase() + str.slice(1)
            : str;

    const style = {
        maxHeight,
        overflowY: maxHeight ? "auto" : undefined,
    };

    const noScrollBar = noScrollbar ? "no-scrollbar" : "";

    return (
        <div className={`w-full ${noScrollBar}`} style={style}>
            <table className="w-full table-sm md:table table-zebra">
                <thead>
                    <tr>
                        {labels.map((label, idx) => (
                            <th key={keys[idx]} className="text-left">
                                {capitalise(label)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            {keys.map((key) => (
                                <td key={key} className="text-left">
                                    {row[key] ?? ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
