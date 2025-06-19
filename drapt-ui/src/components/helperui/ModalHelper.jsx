export function ModalHelper({id, reference, modalTitle, children, ...props}){
    return (
        <dialog id={id} ref={reference} className="modal">
        <div className="modal-box" {...props}>
          <h3 className="font-bold text-2xl">{modalTitle}</h3>
            {children}
          <div className="modal-action mt-0">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    );
}