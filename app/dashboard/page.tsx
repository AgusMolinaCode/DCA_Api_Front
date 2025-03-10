import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";

export default function DashboardPage() {
  return (
    <div>
      <DashboardContentLogin />
      <DashboardContent />
    </div>
  );
}
