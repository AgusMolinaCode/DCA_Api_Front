"use client";
import React from "react";
import Image from "next/image";

const HeroMobile = () => {
  return (
    <div>
      <h2 className="text-lg text-center font-bold text-zinc-300 mt-4">
        Dashboard DCA Crypto
      </h2>
      <Image
        src="/images/imagen1.png"
        alt="hero"
        height={800}
        width={1200}
        className="mx-auto rounded-xl h-full w-full p-2"
        draggable={false}
      />
      <div className="max-w-7xl mx-auto py-4 px-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: "Tenencias",
              description: "Visualiza tus criptos y porcentajes",
            },
            {
              title: "Balance",
              description: "Monitorea inversiones y ganancias",
            },
            {
              title: "Rendimiento",
              description: "Analiza tus mejores criptomonedas",
            },
            {
              title: "Historial",
              description: "Revisa tus inversiones y evolución",
            },
            {
              title: "Bolsas",
              description: "Gestiona diferentes estrategias",
            },
            {
              title: "DCA",
              description: "Implementa tu estrategia personalizada",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <h4 className="text-base font-semibold text-zinc-100 mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroMobile;
