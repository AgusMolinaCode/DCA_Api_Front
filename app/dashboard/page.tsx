import DashboardBalance from "@/components/dashboard/DashboardBalance";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";
import DashboardHoldings from "@/components/dashboard/holdings/DashboardHoldings";
import DashboardPerformance from "@/components/dashboard/performance/DashboardPerformance";
import DashboardMainBalance from "@/components/dashboard/balance/DashboardMainBalance";
import DashboardLineChart from "@/components/dashboard/line-chart/DashboardLineChart";
import BolsaTransactions from "@/components/dashboard/bolsas/BolsaTransactions";

export default function DashboardPage() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      <DashboardContentLogin />
      
      {/* Layout principal - se apila en móvil, flex en pantallas medianas y grandes */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Gráfico de holdings - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-1/3 h-auto">
          <DashboardHoldings />
        </div>
        
        {/* Balance y rendimiento - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-4 h-auto">
          <DashboardMainBalance />
          <DashboardPerformance />
        </div>
        
        {/* Gráfico de línea - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-3/4 h-auto">
          <DashboardLineChart />
        </div>
      </div>
      
      {/* Sección de Bolsas de Inversión */}
      <div className="mb-4">
        <BolsaTransactions />
      </div>

      {/* Sección inferior - siempre apilada */}
      <div className="space-y-4">
        <DashboardBalance />
        <DashboardContent />
      </div>
    </div>
  );
}
