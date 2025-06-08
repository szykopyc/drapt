export function FullscreenItem({reference,children}){
    return (
        <div className="modal modal-open">
            <div className="modal-box w-[95%] max-w-full h-auto">
                {children}
                <div className="modal-action">
                    <button className="btn btn-sm" onClick={() => {reference(null)}}>Close ✕</button>
                </div>
            </div>
        </div>
    );
}