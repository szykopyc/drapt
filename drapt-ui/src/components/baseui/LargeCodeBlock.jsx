export default function LargeCodeBlock({ children, mock = false, invert = false }) {
  if (mock) {
    const lines = children.split('\n');

    return (
      <div className="mockup-code w-full text-sm font-mono rounded-md overflow-x-auto bg-primary large-code-block-mock">
        {lines.map((line, i) => {
          let prefix = '$';
          let colorClass = 'text-info';

          if (line.trim().startsWith('>')) {
            prefix = '>';
            if (line.includes('initialising')) colorClass = 'text-warning codeblock-button';
            if (line.includes('Done')) colorClass = 'text-success codeblock-button';
          }

          return (
            <pre key={i} data-prefix={prefix} className={colorClass}>
              <code className={colorClass}>{line.replace(/^>/, '').trim()}</code>
            </pre>
          );
        })}
      </div>
    );
  }
  // Swap backgrounds if invert is true
  const bgClass = invert
    ? 'bg-base-100 large-code-block-2'
    : 'bg-primary large-code-block';

  return (
    <div className={`rounded-box ${bgClass} font-mono text-sm overflow-x-auto py-5`}>
      <div className="flex space-x-2 px-4 mb-4">
        <span className={`w-3 h-3 rounded-full bg-white opacity-30 ${invert ? 'codeblock-button-2' : 'codeblock-button'}`}></span>
        <span className={`w-3 h-3 rounded-full bg-white opacity-30 ${invert ? 'codeblock-button-2' : 'codeblock-button'}`}></span>
        <span className={`w-3 h-3 rounded-full bg-white opacity-30 ${invert ? 'codeblock-button-2' : 'codeblock-button'}`}></span>
      </div>
      <pre className="px-4">
        <code>{children}</code>
      </pre>
    </div>
  );
}