import DashboardBalance from "@/components/dashboard/DashboardBalance";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";
import DashboardHoldings from "@/components/dashboard/holdings/DashboardHoldings";
import DashboardPerformance from "@/components/dashboard/performance/DashboardPerformance";
import DashboardMainBalance from "@/components/dashboard/balance/DashboardMainBalance";
import DashboardLineChart from "@/components/dashboard/line-chart/DashboardLineChart";

export default function DashboardPage() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      <DashboardContentLogin />
      <div className="sm:flex justify-start gap-2 items-center h-[32rem]">
        <DashboardHoldings />
        <div className="flex flex-col items-center gap-2 py-2">
          <DashboardMainBalance />
          <DashboardPerformance />
        </div>
        <div className="py-2 h-full w-full">
          <DashboardLineChart />
        </div>
      </div>
      <div className="space-y-4">
        <DashboardBalance />
        <DashboardContent />
      </div>
    </div>
  );
}
