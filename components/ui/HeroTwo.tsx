"use client";
import React, { useRef } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import BlurText from "./BlurText";
import { motion, useInView } from "framer-motion";

function HeroTwo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div className="flex flex-col overflow-hidden" ref={ref}>
      <ContainerScroll
        titleComponent={
          <>
            <div className="w-full text-center">
              <motion.p
                className="text-2xl text-zinc-300"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Gestión inteligente de inversiones en criptomonedas
              </motion.p>
            </div>
            <motion.h2
              className="text-3xl font-bold text-zinc-100 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-3xl md:text-[3rem] font-bold leading-none">
                Dashboard completo de DCA Crypt
              </span>
            </motion.h2>
          </>
        }
      >
        <img
          src={`/images/imagen1.png`}
          alt="hero"
          height={1000}
          width={1800}
          className="mx-auto rounded-2xl h-full w-full transform transition-transform duration-700 p-2"
          draggable={false}
          style={{ maxHeight: "100%", objectPosition: "center" }}
        />
      </ContainerScroll>

      <div className="max-w-7xl mx-auto py-6 px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Tenencias en crypto y porcentajes",
              description:
                "Visualiza tus tenencias en criptomonedas con gráficos detallados y porcentajes de distribución",
              delay: 0.3,
            },
            {
              title: "Balance total",
              description:
                "Monitorea tu balance total de inversiones, ganancias y pérdidas en tiempo real",
              delay: 0.4,
            },
            {
              title: "Rendimiento de criptomonedas",
              description:
                "Analiza el rendimiento de tus mejores y peores criptomonedas en diferentes períodos",
              delay: 0.5,
            },
            {
              title: "Historial de inversiones",
              description:
                "Revisa el historial completo de tus inversiones con gráficos detallados de evolución",
              delay: 0.6,
            },
            {
              title: "Bolsas de inversión",
              description:
                "Gestiona diferentes bolsas de inversión según tus estrategias y objetivos",
              delay: 0.7,
            },
            {
              title: "Estrategia DCA personalizada",
              description:
                "Implementa tu estrategia de Dollar Cost Averaging adaptada a tus necesidades",
              delay: 0.8,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <h4 className="text-xl font-semibold text-zinc-100 mb-3">
                {feature.title}
              </h4>
              <p className="text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroTwo;
