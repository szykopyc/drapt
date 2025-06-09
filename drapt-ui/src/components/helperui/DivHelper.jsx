export function ChartHelper({children}){
    return (
        <div className="flex flex-col md:flex-row gap-3">
            {children}
        </div>
    );
}

export function MetricHelper({children}){
    return (
        <div className="flex flex-wrap gap-3 items-stretch h-full">
            {children}
        </div>
    );
}

export function CardHelper({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
      {children}
    </div>
  );
}