"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bolsa, BolsaAsset } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2Icon,
  PlusIcon,
  Trash2Icon,
  TrendingUpIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AddCryptoModal } from "@/components/dashboard/AddCryptoModal";
import { deleteAssetFromBolsa } from "@/lib/actions";

interface BolsaDetailsModalProps {
  bolsa: Bolsa | null;
  isOpen: boolean;
  onClose: () => void;
  onCryptoAdded?: () => void; // Callback opcional para notificar cuando se ha agregado una criptomoneda
}

export default function BolsaDetailsModal({
  bolsa,
  isOpen,
  onClose,
  onCryptoAdded,
}: BolsaDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"detalles" | "activos">(
    "detalles"
  );
  const [isAddCryptoModalOpen, setIsAddCryptoModalOpen] = useState(false);
  
  // Estado para el modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!bolsa) return null;

  // Función para manejar la eliminación de un activo
  const handleDeleteAsset = async () => {
    if (!assetToDelete || !bolsa) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await deleteAssetFromBolsa(bolsa.id.toString(), assetToDelete.id);
      
      if (result.success) {
        // Cerrar el modal de confirmación
        setIsDeleteModalOpen(false);
        setAssetToDelete(null);
        
        // Cerrar el modal de detalles si se solicita
        if (onCryptoAdded) {
          onCryptoAdded();
        }
      } else {
        setDeleteError(result.error || 'Error al eliminar el activo');
      }
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Error desconocido al eliminar el activo');
    } finally {
      setIsDeleting(false);
    }
  };

  const isBolsaCompleted =
    bolsa.progress?.status === "superado" || bolsa.current_value >= bolsa.goal;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-zinc-800 border-zinc-600 text-zinc-100 lg:min-h-[20vh] md:min-w-[56vw] md:max-w-[56vw] overflow-y-hidden">
          <DialogHeader className="border-b border-zinc-700 pb-4">
            <div className="flex justify-between items-start">
              <DialogTitle className="text-xl font-semibold">
                {bolsa.name}
              </DialogTitle>
            </div>
            {bolsa.description && (
              <p className="text-zinc-400 text-sm mt-2">{bolsa.description}</p>
            )}
          </DialogHeader>

          <div className="flex border-b border-zinc-700 mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "detalles"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
              onClick={() => setActiveTab("detalles")}
            >
              Detalles
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "activos"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
              onClick={() => setActiveTab("activos")}
            >
              Activos ({bolsa.assets?.length || 0})
            </button>
          </div>

          {activeTab === "detalles" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-700/40 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">
                    Meta
                  </h3>
                  <p className="text-xl font-semibold">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(bolsa.goal)}
                  </p>
                </div>
                <div className="bg-zinc-700/40 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">
                    Valor actual
                  </h3>
                  <p className="text-xl font-semibold">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(bolsa.current_value)}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-700/40 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">
                  Progreso
                </h3>
                <div className="w-full bg-zinc-600 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      isBolsaCompleted ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.round((bolsa.current_value / bolsa.goal) * 100),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">
                    {isBolsaCompleted ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircle2Icon className="h-4 w-4 mr-1" />
                        Meta superada
                      </span>
                    ) : (
                      `${Math.round(
                        (bolsa.current_value / bolsa.goal) * 100
                      )}% completado`
                    )}
                  </span>
                  <span className="text-sm text-zinc-400">
                    Meta:{" "}
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(bolsa.goal)}
                  </span>
                </div>
              </div>

              {isBolsaCompleted && (
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <div className="flex items-center text-green-400 mb-1">
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    <h3 className="text-sm font-medium">Meta superada</h3>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">
                    Has superado tu meta de inversión en{" "}
                    <span className="font-semibold">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(
                        bolsa.progress?.excess_amount ??
                          bolsa.current_value - bolsa.goal
                      )}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    Esto representa un{" "}
                    <span className="font-medium">
                      {Math.round(
                        bolsa.progress?.excess_percent ??
                          ((bolsa.current_value - bolsa.goal) / bolsa.goal) *
                            100
                      )}
                      %
                    </span>{" "}
                    más de lo planeado
                  </p>
                </div>
              )}

              <div className="flex justify-between text-sm text-zinc-400 mt-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    Creada:{" "}
                    {new Date(bolsa.created_at).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <div>
                  Última actualización:{" "}
                  {new Date(bolsa.updated_at).toLocaleDateString("es-AR")}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <AddCryptoModal 
                  bolsaId={bolsa.id.toString()} 
                  onSuccess={() => {
                    // Llamar al callback onCryptoAdded si existe
                    if (onCryptoAdded) {
                      onCryptoAdded();
                    } else {
                      onClose();
                    }
                  }}
                />
              </div>

              {bolsa.assets && bolsa.assets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-zinc-700">
                      <tr>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Activo
                        </th>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Cantidad
                        </th>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Precio compra
                        </th>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Precio actual
                        </th>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Valor actual
                        </th>
                        <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                          Ganancia/Pérdida
                        </th>
                        <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bolsa.assets.map((asset: BolsaAsset) => (
                        <tr
                          key={asset.id}
                          className="border-b border-zinc-700/50 hover:bg-zinc-700/20"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="relative h-8 w-8 mr-3 rounded-full bg-zinc-700 overflow-hidden">
                                <Image
                                  src={
                                    asset.image_url ||
                                    `/images/${asset.ticker.toLowerCase()}.png`
                                  }
                                  alt={asset.crypto_name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/cripto.png";
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {asset.ticker}
                                </div>
                                <div className="text-xs text-zinc-400">
                                  {asset.crypto_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{asset.amount}</td>
                          <td className="py-3 px-4">
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              maximumFractionDigits: 2,
                            }).format(asset.purchase_price)}
                          </td>
                          <td className="py-3 px-4">
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              maximumFractionDigits: 2,
                            }).format(asset.current_price)}
                          </td>
                          <td className="py-3 px-4">
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              maximumFractionDigits: 2,
                            }).format(asset.current_value)}
                          </td>
                          <td className="py-3 px-4">
                            <div
                              className={`flex items-center ${
                                asset.gain_loss >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {asset.gain_loss >= 0 ? (
                                <TrendingUpIcon className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingUpIcon className="h-3 w-3 mr-1 transform rotate-180" />
                              )}
                              <span>
                                {new Intl.NumberFormat("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                  maximumFractionDigits: 2,
                                }).format(asset.gain_loss)}{" "}
                                ({asset.gain_loss_percent.toFixed(2)}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => {
                                setAssetToDelete({
                                  id: asset.id.toString(),
                                  name: asset.crypto_name || asset.ticker
                                });
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  No hay activos en esta bolsa de inversión
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Se usa el componente AddCryptoModal en lugar de AddCryptoBolsaModal */}
      {isAddCryptoModalOpen && bolsa && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsAddCryptoModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
            <AddCryptoModal
              bolsaId={bolsa.id.toString()}
              onSuccess={() => {
                // Primero cerrar el modal de agregar criptomoneda
                setIsAddCryptoModalOpen(false);
                // Luego cerrar el modal de detalles de la bolsa
                setTimeout(() => {
                  // Llamar al callback onCryptoAdded si existe
                  if (onCryptoAdded) {
                    onCryptoAdded();
                  } else {
                    onClose();
                  }
                }, 100);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar activo */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-red-500 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              ¿Estás seguro de que deseas eliminar <strong>{assetToDelete?.name}</strong> de esta bolsa?
              <br />
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {deleteError}
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setAssetToDelete(null);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAsset}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
