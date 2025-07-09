import DashboardBalance from "@/components/dashboard/DashboardBalance";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardContentLogin } from "@/components/dashboard/DashboardContentLogin";
import DashboardHoldings from "@/components/dashboard/holdings/DashboardHoldings";
import DashboardPerformance from "@/components/dashboard/performance/DashboardPerformance";
import DashboardMainBalance from "@/components/dashboard/balance/DashboardMainBalance";
import DashboardLineChart from "@/components/dashboard/line-chart/DashboardLineChart";
import BolsaTransactions from "@/components/dashboard/bolsas/BolsaTransactions";
import { Suspense } from "react";
import AthComponent from "@/components/dashboard/ath/AthComponent";
import Footer from "@/components/ui/Footer";

export const dynamic = 'force-dynamic';


// Componentes de carga para cada sección
const HoldingsLoader = () => (
  <div className="w-full h-136 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const BalanceLoader = () => (
  <div className="w-full h-64 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const PerformanceLoader = () => (
  <div className="w-full h-68 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const ChartLoader = () => (
  <div className="w-full h-64 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const BolsaLoader = () => (
  <div className="w-full h-48 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const ContentLoader = () => (
  <div className="w-full h-64 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);

const AthLoader = () => (
  <div className="w-full h-64 bg-zinc-800 border-zinc-600 rounded-lg animate-pulse"></div>
);


export default function DashboardPage() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      <DashboardContentLogin />
      
      {/* Layout principal - se apila en móvil, flex en pantallas medianas y grandes */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Gráfico de holdings - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-1/3 h-auto">
          <Suspense fallback={<HoldingsLoader />}>
            <DashboardHoldings />
          </Suspense>
        </div>
        
        {/* Balance y rendimiento - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-4 h-auto">
          <Suspense fallback={<BalanceLoader />}>
            <DashboardMainBalance />
          </Suspense>
          <Suspense fallback={<PerformanceLoader />}>
            <DashboardPerformance />
          </Suspense>
        </div>
        
        {/* Gráfico de línea - ancho completo en móvil, 1/3 en pantallas grandes */}
        <div className="w-full lg:w-3/4 h-auto">
          <Suspense fallback={<ChartLoader />}>
            <DashboardLineChart />
          </Suspense>
        </div>
      </div>
      
      {/* Sección de Bolsas de Inversión */}
      <div className="mb-4">
        <Suspense fallback={<BolsaLoader />}>
          <BolsaTransactions />
        </Suspense>
      </div>


      {/* Sección de ATH */}
      <div className="mb-4">
        <Suspense fallback={<AthLoader />}>
          <AthComponent />
        </Suspense>
      </div>

      {/* Sección inferior - siempre apilada */}
      <div className="space-y-4">
        <Suspense fallback={<ContentLoader />}>
          <DashboardBalance />
        </Suspense>
        <Suspense fallback={<ContentLoader />}>
          <DashboardContent />
        </Suspense>
      </div>

      <Footer />
    </div> 
  );
}
