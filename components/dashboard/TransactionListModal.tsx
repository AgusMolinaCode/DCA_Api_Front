import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TokenIcon } from "@web3icons/react";
import Image from "next/image";
import { deleteTransaction } from "@/lib/actions";
import { Trash2, Edit, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componente CryptoIcon para mostrar el icono de la criptomoneda
const CryptoIcon = ({
  ticker,
  imageUrl,
}: {
  ticker: string;
  imageUrl?: string;
}) => {
  return (
    <div className="relative w-8 h-8">
      <TokenIcon
        name={ticker.toUpperCase()}
        fallback={
          <Image
            src={imageUrl || "/images/cripto.png"}
            alt={ticker}
            width={32}
            height={32}
            className="object-contain"
          />
        }
      />
    </div>
  );
};

interface TransactionListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransaction: any;
  onTransactionDeleted?: () => void;
  onEditTransaction?: (transaction: any) => void;
}

const TransactionListModal = ({
  open,
  onOpenChange,
  selectedTransaction,
  onTransactionDeleted,
  onEditTransaction,
}: TransactionListModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const result = await deleteTransaction(
        selectedTransaction.transaction.id
      );

      if (!result.success) {
        throw new Error(result.error || "Error al eliminar la transacción");
      }

      // Cerrar el diálogo de confirmación y el modal
      setShowDeleteConfirm(false);
      onOpenChange(false);

      // Notificar que la transacción fue eliminada
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Error al eliminar la transacción"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    if (!selectedTransaction) return;

    // Cerrar este modal
    onOpenChange(false);

    // Llamar al callback para editar la transacción
    if (onEditTransaction) {
      onEditTransaction(selectedTransaction);
    }
  };

  if (!selectedTransaction) return null;

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-800 border-zinc-600 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CryptoIcon
                ticker={selectedTransaction.transaction.ticker}
                imageUrl={selectedTransaction.transaction.image_url}
              />
              <div>
                {selectedTransaction.transaction.crypto_name} (
                {selectedTransaction.transaction.ticker})
              </div>
            </DialogTitle>
            <DialogDescription className="text-zinc-300">
              Detalles de la transacción
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Tipo</p>
                <p
                  className={`font-medium ${
                    selectedTransaction.transaction.type === "compra"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedTransaction.transaction.type === "compra"
                    ? "Compra"
                    : "Venta"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Fecha</p>
                <p className="font-medium">
                  {format(
                    new Date(selectedTransaction.transaction.date),
                    "dd/MM/yyyy",
                    { locale: es }
                  )}
                </p>
              </div>
            </div>

            <Separator className="bg-zinc-700" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Cantidad</p>
                <p className="font-medium">
                  {selectedTransaction.transaction.amount}{" "}
                  {selectedTransaction.transaction.ticker}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Precio de compra</p>
                <p className="font-medium">
                  {formatCurrency(
                    selectedTransaction.transaction.purchase_price
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Precio actual</p>
                <p className="font-medium">
                  {formatCurrency(selectedTransaction.current_price)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Total invertido</p>
                <p className="font-medium">
                  {formatCurrency(selectedTransaction.transaction.total)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Valor actual</p>
                <p className="font-medium">
                  {formatCurrency(selectedTransaction.current_value)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Ganancia/Pérdida</p>
                <div>
                  <p
                    className={`font-medium ${
                      selectedTransaction.gain_loss >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formatCurrency(selectedTransaction.gain_loss)}
                  </p>
                  <p
                    className={`text-sm ${
                      selectedTransaction.gain_loss >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedTransaction.gain_loss >= 0 ? "+" : ""}
                    {selectedTransaction.gain_loss_percent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {selectedTransaction.transaction.note && (
              <div className="space-y-1 mt-2">
                <p className="text-sm text-zinc-400">Nota</p>
                <p className="font-medium bg-zinc-700/50 p-2 rounded-md">
                  {selectedTransaction.transaction.note}
                </p>
              </div>
            )}

            {deleteError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              {selectedTransaction.transaction.type === "compra" || selectedTransaction.transaction.image_url === "/images/cripto.png" && (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-zinc-100 hover:text-zinc-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}

              <Dialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 text-zinc-100 hover:text-zinc-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-800 border-zinc-600 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription className="text-zinc-300">
                      ¿Estás seguro de que deseas eliminar esta transacción?
                      Esta acción no se puede deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      onClick={handleDeleteTransaction}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionListModal;
