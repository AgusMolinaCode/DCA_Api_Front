import React from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";

interface CryptoSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  clearSearchFilter: () => void;
}

export function CryptoSearch({ 
  searchTerm, 
  setSearchTerm, 
  clearSearchFilter 
}: CryptoSearchProps) {
  return (
    <div className="flex items-center gap-2 relative">
      <Input
        type="text"
        placeholder="Buscar criptomonedas"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-8 text-zinc-100"
      />
      {searchTerm ? (
        <button
          onClick={clearSearchFilter}
          className="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-muted/10 text-zinc-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground" />
      )}
    </div>
  );
}