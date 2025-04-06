// Paleta de colores predefinida para asegurar buen contraste
export const colorPalette = [
  "#FF6384", // Rosa
  "#36A2EB", // Azul
  "#FFCE56", // Amarillo
  "#4BC0C0", // Turquesa
  "#9966FF", // Púrpura
  "#FF9F40", // Naranja
  "#8AC926", // Verde lima
  "#F94144", // Rojo
  "#1982C4", // Azul oscuro
  "#6A4C93", // Púrpura oscuro
  "#43AA8B", // Verde azulado
  "#F8961E", // Naranja claro
  "#90BE6D", // Verde claro
  "#577590", // Azul gris
  "#F15BB5", // Rosa claro
];

// Función para generar colores dinámicos
export const generateDynamicColors = (tickers: string[]): Record<string, string> => {
  const colorMap: Record<string, string> = {};
  
  // Asignar colores de la paleta primero
  tickers.forEach((ticker, index) => {
    if (index < colorPalette.length) {
      colorMap[ticker] = colorPalette[index];
    } else {
      // Si se acaban los colores de la paleta, generar uno aleatorio
      // pero asegurándonos de que sea suficientemente distinto a los anteriores
      let newColor: string = "#000000"; // Valor por defecto
      let isUnique = false;
      
      while (!isUnique) {
        // Generar un color HSL con buen contraste
        const hue = Math.floor(Math.random() * 360); // 0-360 grados
        const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
        const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
        
        newColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Verificar que el color sea suficientemente diferente a los existentes
        isUnique = Object.values(colorMap).every(existingColor => {
          // Simplificación: si el color es HSL, convertimos a string para comparar
          return existingColor !== newColor;
        });
      }
      
      colorMap[ticker] = newColor;
    }
  });
  
  return colorMap;
};