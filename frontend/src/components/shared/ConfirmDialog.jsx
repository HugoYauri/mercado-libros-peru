import { useEffect, useRef } from "react";
export function ConfirmDialog({ open, title, children, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog ref={ref} onCancel={onCancel} className="confirm-dialog">
      <h2>{title}</h2>
      <p>{children}</p>
      <div className="actions">
        <button className="button secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="button danger" onClick={onConfirm}>
          Confirmar
        </button>
      </div>
    </dialog>
  );
}
