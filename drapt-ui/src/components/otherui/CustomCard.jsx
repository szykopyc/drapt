export function CardOne({ id, title, badge = null, children }) {
  return (
    <div id={id} className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className='flex justify-between'>
          <h2 className="card-title text-2xl">{title}</h2>
          {badge && <span className="badge badge-s badge-primary text-white">{badge}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function CardTwo({ id, title, badge = null, children }) {
  return (
    <div id={id} className="card bg-primary text-white shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className='flex justify-between items-center'>
          <h2 className="card-title text-2xl">{title}</h2>
          {badge && <span className="badge badge-s badge-base">{badge}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

