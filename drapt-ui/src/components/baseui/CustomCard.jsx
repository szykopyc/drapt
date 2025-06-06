import { useState } from "react";

export function CardOne({ id, title, badge = null, children }) {
  return (
    <div id={id} tabIndex={0} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className='flex justify-between items-center'>
          <h2 className="card-title text-2xl">{title}</h2>
          {badge && <span className="badge badge-s badge-theme">{badge}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function CardTwo({ id, title, badge = null, children }) {
  return (
    <div id={id} tabIndex={0} className="card bg-primary text-white shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className='flex justify-between items-center'>
          <h2 className="card-title text-2xl">{title}</h2>
          {badge && <span className="badge badge-s badge-theme">{badge}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function SplitCardBody({children}){
    return (
        <div className='flex flex-col md:flex-row gap-4 items-start'>
            {children}
        </div>
    );
}

export function AnalyseCard({ id, title, children }) {
  return (
    <div id={id} tabIndex={0} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full h-full">
      <div className="card-body flex-col ">
        <h2 className="card-title text-2xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function LoginCard({ id, title, children }) {
  return (
    <div id={id} tabIndex={0} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full h-full">
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <div className='mt-10 sm:mx-auto sm:w-full sm-max-w-sm'>
          {children}
        </div>
      </div>
    </div>
  )
}

export function CustomCollapseArrow({ id, title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div id={id} tabIndex={0} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-center justify-between cursor-pointer select-none w-full" onClick={() => setOpen((prev) => !prev)}>
                    <h2 className="card-title text-2xl">{title}</h2>
                    <span className="text-base-content">&#x25BC;</span>
                </div>
                <div style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function CustomCollapse({ id, title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <>
        <div id={id} tabIndex={0} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-center cursor-pointer select-none w-full" onClick={() => setOpen((prev) => !prev)}>
                    <h2 className="card-title text-2xl">{title}</h2>
                </div>
                <div style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            </div>
        </div>
    </>
    );
}