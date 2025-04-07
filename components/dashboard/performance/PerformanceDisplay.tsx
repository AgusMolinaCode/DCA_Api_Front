"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceProps } from "@/lib/interface";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Image from "next/image";

interface PerformanceDisplayProps {
  data: PerformanceProps;
}

export default function PerformanceDisplay({ data }: PerformanceDisplayProps) {
  const { performance } = data;
  const { top_gainer, top_loser } = performance;

  return (
    <Card className="w-full sm:w-[24rem] bg-zinc-800 border-zinc-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-zinc-100">Rendimiento 24h</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Top Gainer */}
          <div className="flex items-center space-x-4 bg-zinc-700/40 p-4 rounded-lg">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              {top_gainer.image_url && (
                <Image
                  src={top_gainer.image_url}
                  alt={top_gainer.ticker}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-zinc-100">{top_gainer.ticker}</h3>
              <div className="flex items-center text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>
                  {Math.abs(top_gainer.change_percent_24h).toFixed(2)}% (
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(Math.abs(top_gainer.price_change))}
                  )
                </span>
              </div>
            </div>
          </div>

          {/* Top Loser */}
          <div className="flex items-center space-x-4 bg-zinc-700/40 p-4 rounded-lg">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              {top_loser.image_url && (
                <Image
                  src={top_loser.image_url}
                  alt={top_loser.ticker}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-zinc-100">{top_loser.ticker}</h3>
              <div className="flex items-center text-red-500">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                <span>
                  {Math.abs(top_loser.change_percent_24h).toFixed(2)}% (
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(Math.abs(top_loser.price_change))}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
