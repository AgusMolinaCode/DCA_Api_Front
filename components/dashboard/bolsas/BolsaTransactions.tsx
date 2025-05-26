import { getBolsas } from "@/lib/actions";
import { Bolsa } from "@/lib/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  CheckCircle2Icon,
  TargetIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

export default async function BolsaTransactions() {
  const { success, data, error } = await getBolsas();
  const bolsas = (data || []) as Bolsa[];

  return (
    <div className="w-full">
      <Card className="bg-zinc-800 border-zinc-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-zinc-100 flex items-center">
            <WalletIcon className="mr-2 h-5 w-5" />
            Bolsas de Inversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-400 p-4">
              Error al cargar las bolsas de inversión: {error}
            </div>
          ) : bolsas.length === 0 ? (
            <div className="text-zinc-400 p-4 text-center">
              No tienes bolsas de inversión creadas.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bolsas.map((bolsa) => (
                <Card
                  key={bolsa.id}
                  className="bg-zinc-700/40 border-zinc-600 overflow-hidden"
                >
                  <div
                    className={`h-1 w-full ${
                      bolsa.progress?.status === "superado" ||
                      bolsa.current_value >= bolsa.goal
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-zinc-100 truncate">
                        {bolsa.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          bolsa.progress?.status === "superado" ||
                          bolsa.current_value >= bolsa.goal
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {bolsa.progress?.status === "superado" ||
                        bolsa.current_value >= bolsa.goal
                          ? "Superado"
                          : "Activa"}
                      </span>
                    </div>

                    {bolsa.description && (
                      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                        {bolsa.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-zinc-400">Meta</p>
                        <p className="text-sm font-medium text-zinc-200">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            maximumFractionDigits: 0,
                          }).format(bolsa.goal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Valor actual</p>
                        <p className="text-sm font-medium text-zinc-200">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            maximumFractionDigits: 0,
                          }).format(bolsa.current_value)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1 text-zinc-400" />
                        <span className="text-xs text-zinc-400">
                          {new Date(bolsa.created_at).toLocaleDateString(
                            "es-AR"
                          )}
                        </span>
                      </div>

                      {bolsa.progress?.status === "superado" ||
                      bolsa.current_value >= bolsa.goal ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircle2Icon className="h-3 w-3 mr-1" />
                          <span className="text-xs">100% - Meta superada</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-400">
                          <TargetIcon className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {Math.min(
                              Math.round(
                                (bolsa.current_value / bolsa.goal) * 100
                              ),
                              100
                            )}
                            % completado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-600 flex justify-between items-center">
                      <span className="text-xs text-zinc-400">
                        Última actualización:{" "}
                        {new Date(bolsa.updated_at).toLocaleDateString("es-AR")}
                      </span>
                      <a
                        href={`/dashboard/bolsas/${bolsa.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Ver detalles →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
