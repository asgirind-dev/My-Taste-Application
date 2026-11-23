import { PageHeader } from "./PageHeader";

export function DashboardIntro({ role, title, text }) {
  return (
    <PageHeader
      eyebrow={`${role.toUpperCase()} WORKSPACE`}
      title={title}
      description={text}
      actions={
        <div className="date-chip">
          <span>FRI</span>
          <b>06</b>
          <small>MAR 2026</small>
        </div>
      }
    />
  );
}