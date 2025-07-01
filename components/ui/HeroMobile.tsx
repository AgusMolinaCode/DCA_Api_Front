"use client";
import React from "react";
import Image from "next/image";
import InfiniteScroll from "./InfiniteScroll";

const HeroMobile = () => {
  const items = [
    {
      content: (
        <Image
          src="/images/imagen3.png"
          alt="Historial de inversiones"
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl"
          style={{ maxWidth: "100%" }}
        />
      ),
    },
    {
      content: (
        <Image
          src="/images/imagen4.png"
          alt="Búsqueda de transacciones"
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl"
          style={{ maxWidth: "100%" }}
        />
      ),
    },
  ];

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
              description: "Ver criptos y %",
            },
            {
              title: "Balance",
              description: "Inversiones y ganancias",
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
      <p className="text-center md:text-3xl text-xl font-black uppercase leading-[0.85] text-zinc-300 mx-auto px-4 py-8">
        Visualiza el ATH histórico de tus criptomonedas y descubre cuánto falta
        para alcanzarlo nuevamente.
      </p>
      <Image
        src="/images/imagen2.png"
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
              title: "Transacciones",
              description: "Ver historial y detalles",
              delay: 0.3,
            },
            {
              title: "Filtros fecha",
              description: "Filtrar por rango o período",
              delay: 0.4,
            },
            {
              title: "Búsqueda",
              description: "Por moneda, monto o exchange",
              delay: 0.5,
            },
            {
              title: "Ganancias/Pérdidas",
              description: "Rendimiento por transacción",
              delay: 0.6,
            },
            {
              title: "Exportar",
              description: "Datos en varios formatos",
              delay: 0.7,
            },
            {
              title: "Etiquetas",
              description: "Organizar transacciones",
              delay: 0.8,
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
      <Image
        src="/images/imagen3.png"
        alt="hero"
        height={800}
        width={1200}
        className="mx-auto rounded-xl h-full w-full p-2"
        draggable={false}
      />
      <Image
        src="/images/imagen4.png"
        alt="hero"
        height={800}
        width={1200}
        className="mx-auto rounded-xl h-full w-full p-2"
        draggable={false}
      />
    </div>
  );
};

export default HeroMobile;
