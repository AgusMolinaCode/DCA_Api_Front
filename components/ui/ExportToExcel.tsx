"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';

interface ExportToExcelProps {
  data: any[];
  filename: string;
  sheetName?: string;
  buttonText?: string;
  className?: string;
}

const ExportToExcel = ({ 
  data, 
  filename, 
  sheetName = "Datos", 
  buttonText = "Exportar a Excel",
  className = ""
}: ExportToExcelProps) => {
  
  const exportToExcel = () => {
    try {
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Convertir los datos a una hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Generar el archivo y descargarlo
      const fileName = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar los datos a Excel.');
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      size="sm"
      className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white border-emerald-600 hover:border-emerald-700 ${className}`}
    >
      <Download className="h-4 w-4" />
      <span className="hidden md:inline">{buttonText}</span>
    </Button>
  );
};

export default ExportToExcel;
