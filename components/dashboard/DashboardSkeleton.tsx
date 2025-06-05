import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-[100rem] mx-auto p-2 md:p-8">
      {/* Layout principal - se apila en móvil, flex en pantallas medianas y grandes */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Skeleton para holdings */}
        <div className="w-full lg:w-1/3 h-auto">
          <Card className="bg-zinc-800 border-zinc-600">
            <CardHeader className="pb-2">
              <div className="h-6 w-40 bg-zinc-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-zinc-700 rounded-md animate-pulse"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Skeleton para balance y rendimiento */}
        <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-4 h-auto">
          {/* Balance */}
          <Card className="bg-zinc-800 border-zinc-600 flex-1">
            <CardHeader className="pb-2">
              <div className="h-6 w-32 bg-zinc-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-zinc-700 rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
          
          {/* Rendimiento */}
          <Card className="bg-zinc-800 border-zinc-600 flex-1">
            <CardHeader className="pb-2">
              <div className="h-6 w-36 bg-zinc-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-zinc-700 rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Skeleton para gráfico de línea */}
        <div className="w-full lg:w-3/4 h-auto">
          <Card className="bg-zinc-800 border-zinc-600">
            <CardHeader className="pb-2">
              <div className="h-6 w-48 bg-zinc-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-zinc-700 rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Skeleton para Bolsas de Inversión */}
      <div className="mb-4">
        <Card className="bg-zinc-800 border-zinc-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-6 w-40 bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-zinc-700 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-zinc-700/40 border-zinc-600 overflow-hidden">
                  <div className="h-1 w-full bg-zinc-600"></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-5 w-32 bg-zinc-600 rounded animate-pulse"></div>
                      <div className="h-5 w-16 bg-zinc-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-4 w-full bg-zinc-600 rounded animate-pulse mt-2"></div>
                    <div className="grid grid-cols-2 gap-2 my-3">
                      <div>
                        <div className="h-3 w-12 bg-zinc-600 rounded animate-pulse mb-1"></div>
                        <div className="h-4 w-20 bg-zinc-600 rounded animate-pulse"></div>
                      </div>
                      <div>
                        <div className="h-3 w-16 bg-zinc-600 rounded animate-pulse mb-1"></div>
                        <div className="h-4 w-20 bg-zinc-600 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-24 bg-zinc-600 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-zinc-600 rounded animate-pulse"></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-600 flex justify-between items-center">
                      <div className="h-3 w-32 bg-zinc-600 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-zinc-600 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skeleton para secciones inferiores */}
      <div className="space-y-4">
        <Card className="bg-zinc-800 border-zinc-600">
          <CardHeader className="pb-2">
            <div className="h-6 w-36 bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-zinc-700 rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800 border-zinc-600">
          <CardHeader className="pb-2">
            <div className="h-6 w-36 bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-zinc-700 rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
