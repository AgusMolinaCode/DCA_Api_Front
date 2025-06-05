"use client";

import { getBolsaDetails } from "@/lib/actions";
import { Bolsa } from "@/lib/interface";
import { useState } from "react";
import BolsaDetailsModal from "./BolsaDetailsModal";

interface BolsaDetailsButtonProps {
  bolsaId: string;
  onBolsaChange?: () => void;
  markAsProcessing?: (bolsaId: string) => void;
  unmarkAsProcessing?: (bolsaId: string) => void;
}

export default function BolsaDetailsButton({ 
  bolsaId,
  onBolsaChange,
  markAsProcessing,
  unmarkAsProcessing
}: BolsaDetailsButtonProps) {
  const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para abrir el modal con los detalles de la bolsa
  const handleOpenDetails = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await getBolsaDetails(bolsaId);
      if (success && data) {
        setSelectedBolsa(data as Bolsa);
        setIsModalOpen(true);
      } else {
        console.error('Error al cargar los detalles de la bolsa:', error);
      }
    } catch (err) {
      console.error('Error al cargar los detalles de la bolsa:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenDetails}
        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="mr-1 h-3 w-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></span>
            Cargando...
          </>
        ) : (
          <>Ver detalles →</>
        )}
      </button>

      {/* Modal de detalles de la bolsa */}
      <BolsaDetailsModal
        bolsa={selectedBolsa}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBolsa(null);
        }}
        onCryptoAdded={() => {
          // Cerrar el modal y actualizar los datos
          setIsModalOpen(false);
          setSelectedBolsa(null);
          // Opcionalmente, podríamos recargar los datos de la bolsa aquí
          // pero no es necesario porque la página principal se encargará de actualizarlos
        }}
      />
    </>
  );
}
