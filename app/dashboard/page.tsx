import DashboardBalance from "@/components/dashboard/DashboardBalance";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";
import DashboardHoldings from "@/components/dashboard/holdings/DashboardHoldings";
import DashboardPerformance from "@/components/dashboard/performance/DashboardPerformance";
import DashboardMainBalance from "@/components/dashboard/balance/DashboardMainBalance";

export default function DashboardPage() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      <DashboardContentLogin />
      <div className="sm:flex justify-start gap-2 items-center">
        <DashboardHoldings />
        <div className="flex flex-col items-center gap-2 py-2">
          <DashboardMainBalance />
          <DashboardPerformance />
        </div>
      </div>
      <div className="space-y-4">
        <DashboardBalance />
        <DashboardContent />
      </div>
    </div>
  );
}
