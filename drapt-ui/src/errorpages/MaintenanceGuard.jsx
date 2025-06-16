import MaintenanceError from "./MaintenanceError";

export default function MaintenanceGuard({ children }) {
  const maintenance = true;
  if (maintenance) return <MaintenanceError />;
  return children;
}