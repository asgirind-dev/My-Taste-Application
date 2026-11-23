import { useDemo } from "../../contexts/DemoStateContext";
import { Icon } from "../common";

export function Toast() {
  const { toast } = useDemo();
  if (!toast) return null;
  return (
    <div className="toast">
      <span>
        <Icon name="check" size={16} />
      </span>
      <div>
        <b>Update successful</b>
        <p>{toast}</p>
      </div>
    </div>
  );
}