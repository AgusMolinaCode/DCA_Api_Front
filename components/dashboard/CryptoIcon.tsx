"use client";

import React, { useState } from 'react';
import { TokenIcon } from '@web3icons/react';
import Image from 'next/image';

interface CryptoIconProps {
  ticker: string;
  size?: number;
}

const getCryptoSymbol = (ticker: string): string => {
  // Convertir el ticker a minúsculas para el símbolo de TokenIcon
  return ticker.toLowerCase();
};

export function CryptoIcon({ ticker, size = 44 }: CryptoIconProps) {
  const [iconError, setIconError] = useState(false);

  // Manejar el error cuando el TokenIcon no se encuentra
  const handleIconError = () => {
    setIconError(true);
  };

  console.log(ticker);

  return (
    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted">
      {iconError ? (
        <Image 
          src="/images/cripto.png" 
          alt={ticker} 
          width={size} 
          height={size} 
          className="object-contain"
        />
      ) : (
        <div onError={handleIconError}>
          <TokenIcon symbol={getCryptoSymbol(ticker)} size={size} variant='branded' />
        </div>
      )}
    </div>
  );
}