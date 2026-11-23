export function Badge({ children, tone }) {
  const value = String(children).toLowerCase();
  const auto =
    value.includes("paid") ||
    value.includes("completed") ||
    value.includes("success") ||
    value.includes("active") ||
    value.includes("approved")
      ? "green"
      : value.includes("pending") || value.includes("partial") || value.includes("progress")
      ? "orange"
      : value.includes("void") ||
        value.includes("reject") ||
        value.includes("inactive") ||
        value.includes("low")
      ? "red"
      : "blue";
  return <span className={`badge badge-${tone || auto}`}>{children}</span>;
}