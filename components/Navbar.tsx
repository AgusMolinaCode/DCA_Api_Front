"use client";

import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { ShimmerButton } from "./magicui/shimmer-button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Importación dinámica del componente TickerTape para evitar problemas de SSR
const TickerTapeNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.TickerTape),
  {
    ssr: false,
  }
);
export const Navbar = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between md:justify-around items-center p-4">
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-zinc-100">
              DCA-app
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <ShimmerButton>Login</ShimmerButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <ShimmerButton>Dashboard</ShimmerButton>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <TickerTapeNoSSR
        colorTheme="dark"
        symbols={[
          {
            proName: "BITSTAMP:BTCUSD",
            title: "Bitcoin",
          },
          {
            proName: "BITSTAMP:ETHUSD",
            title: "Ethereum",
          },
          {
            proName: "BINANCE:BNBUSD",
            title: "BNB",
          },
          {
            proName: "BINANCE:SOLUSD",
            title: "Solana",
          },
          {
            proName: "BINANCE:ADAUSD",
            title: "Cardano",
          },
          {
            proName: "BINANCE:DOTUSD",
            title: "Polkadot",
          },
          {
            proName: "BINANCE:DOGEUSD",
            title: "Dogecoin",
          },
          {
            proName: "BINANCE:AVAXUSD",
            title: "Avalanche",
          },
          {
            proName: "BINANCE:XRPUSD",
            title: "XRP",
          },
          {
            proName: "BINANCE:LINKUSD",
            title: "Chainlink",
          },
        ]}
      />
    </div>
  );
};
