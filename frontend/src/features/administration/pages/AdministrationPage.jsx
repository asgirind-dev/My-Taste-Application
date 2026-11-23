import { useState } from "react";
import { Badge, Card, Icon, Modal, ModalActions, PageHeader } from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { locations } from "../../../utils";

const features = [
  "Procurement / Inventory",
  "Bakery Production",
  "Stock Distribution",
  "POS / Sales",
  "Employee Credit",
];

export function AdministrationPage() {
  const { state, setState, notify } = useDemo();
  const [pending, setPending] = useState(null);

  const toggle = () => {
    if (!pending) return;
    if (pending.f === "Employee Credit" && pending.l !== "Araliya Factory Canteen") {
      notify("Employee Credit requires an eligible, configured canteen location");
      setPending(null);
      return;
    }
    setState((s) => ({
      ...s,
      features: {
        ...s.features,
        [pending.l]: {
          ...s.features[pending.l],
          [pending.f]: !s.features[pending.l][pending.f],
        },
      },
    }));
    notify("Location feature configuration updated");
    setPending(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="SYSTEM ADMINISTRATION"
        title="Locations & feature matrix"
        description="Configure which operational capabilities are available at each location."
      />
      <div className="location-cards">
        {locations.map((l, i) => (
          <div key={l}>
            <span>
              <Icon name={i === 0 ? "box" : i === 1 ? "store" : "dashboard"} />
            </span>
            <div>
              <b>{l}</b>
              <small>
                {i === 0
                  ? "Warehouse"
                  : i === 1
                  ? "Production facility"
                  : i === 4
                  ? "Eligible canteen"
                  : "Restaurant outlet"}
              </small>
            </div>
            <Badge>Active</Badge>
          </div>
        ))}
      </div>
      <Card
        title="Location feature matrix"
        subtitle="Important setting changes require confirmation"
      >
        <div className="matrix">
          <div className="matrix-row head">
            <b>Location</b>
            {features.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          {locations.map((l) => (
            <div className="matrix-row" key={l}>
              <b>{l}</b>
              {features.map((f) => (
                <button
                  key={f}
                  className={state.features[l][f] ? "on" : ""}
                  onClick={() => setPending({ l, f })}
                >
                  <i />
                </button>
              ))}
            </div>
          ))}
        </div>
      </Card>
      {pending && (
        <Modal
          title="Confirm feature change"
          description="This changes available navigation and workflows for the selected location."
          onClose={() => setPending(null)}
        >
          <div className="confirm-summary">
            <span>
              <Icon name="settings" />
            </span>
            <div>
              <b>{pending.f}</b>
              <p>{pending.l}</p>
            </div>
            <Badge>{state.features[pending.l][pending.f] ? "Disable" : "Enable"}</Badge>
          </div>
          <ModalActions close={() => setPending(null)} submit={toggle} label="Confirm change" />
        </Modal>
      )}
    </>
  );
}