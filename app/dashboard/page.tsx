import DashboardBalance from "@/components/dashboard/DashboardBalance";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";
import DashboardHoldings from "@/components/dashboard/holdings/DashboardHoldings";
import DashboardPerformance from "@/components/dashboard/DashboardPerformance";

export default function DashboardPage() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      <DashboardContentLogin />
      <div className="flex justify-between items-center">
        <DashboardHoldings />
        <DashboardPerformance />
      </div>
      <div className="space-y-4">
        <DashboardBalance />
        <DashboardContent />
      </div>
    </div>
  );
}
