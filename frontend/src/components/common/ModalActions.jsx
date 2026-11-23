import { Button } from "./Button";

export function ModalActions({ close, submit, label }) {
  return (
    <div className="modal-actions">
      <Button variant="secondary" onClick={close}>
        Cancel
      </Button>
      <Button onClick={submit}>{label}</Button>
    </div>
  );
}