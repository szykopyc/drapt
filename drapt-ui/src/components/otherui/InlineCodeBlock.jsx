export default function InlineCodeBlock({children}){
    return (
        <code className="bg-base-100 text-info rounded px-1 text-sm font-mono" >
            {children}
        </code>
    );
}

