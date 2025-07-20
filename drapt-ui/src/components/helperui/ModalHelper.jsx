export function ModalHelper({
  id,
  reference,
  modalTitle,
  children,
  width = 50,
  closeModalActions = null,
  ...props
}) {
  return (
    <dialog
      id={id}
      ref={reference}
      className="modal"
      style={{ borderRadius: "var(--border-radius)" }}
    >
      <div
        className="modal-box"
        style={{
          width: "100%", // mobile default
          // On md and up, override with the custom width
          ...(typeof window !== "undefined" &&
            window.innerWidth >= 768
            ? { minWidth: `${width}%` }
            : {}),

          borderRadius: "var(--border-radius)",
        }}
        {...props}
      >
        <h3 className="font-bold text-2xl">{modalTitle}</h3>
        <div className="py-2">{children}</div>
        <div className="modal-action mt-0">
          <form method="dialog" onSubmit={closeModalActions}>
            <button
              className="btn"
              style={{ borderRadius: "0" }} // Explicitly set border-radius to 0
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
