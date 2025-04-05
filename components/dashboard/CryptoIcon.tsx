import React from "react";
import { TokenIcon } from "@web3icons/react";
import Image from "next/image";

interface CryptoIconProps {
  ticker: string;
  imageUrl?: string;
}

export const CryptoIcon = ({
  ticker,
  imageUrl,
}: CryptoIconProps) => {
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