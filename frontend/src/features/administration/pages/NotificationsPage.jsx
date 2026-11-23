import { useState } from "react";
import { Button, Card, Empty, Icon, PageHeader } from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { routeToPath } from "../../../utils";

export function NotificationsPage() {
  const { state, setState, notify, navigate } = useDemo();
  const [filter, setFilter] = useState("All");

  const rows = state.notifications.filter((n) =>
    filter === "All" || (filter === "Unread" ? !n.read : n.read)
  );

  const mark = (id) =>
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        !id || n.id === id ? { ...n, read: true } : n
      ),
    }));

  return (
    <>
      <PageHeader
        eyebrow="SHARED INBOX"
        title="Notification center"
        description="Operational updates for your role and authorized locations."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              mark();
              notify("All visible notifications marked as read");
            }}
          >
            Mark all as read
          </Button>
        }
      />
      <div className="tabs">
        <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>
          All
        </button>
        <button className={filter === "Unread" ? "active" : ""} onClick={() => setFilter("Unread")}>
          Unread
        </button>
        <button className={filter === "Read" ? "active" : ""} onClick={() => setFilter("Read")}>
          Read
        </button>
      </div>
      <Card>
        {rows.length ? (
          <div className="notification-list">
            {rows.map((n) => (
              <button
                key={n.id}
                className={!n.read ? "unread" : ""}
                onClick={() => {
                  mark(n.id);
                  navigate(routeToPath[n.route] || "/");
                }}
              >
                <span className="notification-icon">
                  <Icon name={n.type === "Transfer" ? "truck" : "bell"} />
                  {!n.read && <i />}
                </span>
                <div>
                  <b>{n.title}</b>
                  <p>{n.detail}</p>
                  <small>
                    {n.record} · {n.date}
                  </small>
                </div>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
        ) : (
          <Empty title="You're all caught up" detail="No notifications match this filter." />
        )}
      </Card>
    </>
  );
}