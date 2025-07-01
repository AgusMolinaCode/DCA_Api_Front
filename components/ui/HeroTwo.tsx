"use client";
import React, { useRef } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import {
  motion,
  useInView,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import ScrollFloat from "./ScrollFloat";
import ScrollReveal from "./ScrollReveal";
import GlitchText from "./GlitchText";

function HeroTwo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  const skewXRaw = useTransform(
    scrollVelocity,
    [-0.5, 0.5],
    ["45deg", "-45deg"]
  );
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -4000]);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

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
                Dashboard completo de DCA Crypto
              </span>
            </motion.h2>
          </>
        }
      >
        <Image
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

      {/* <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        containerClassName="text-center max-w-5xl mx-auto"
        textClassName="text-center text-zinc-300 text-xl mt-4 mb-8 mx-auto"
      ></ScrollReveal> */}

      <section ref={targetRef} className="bg-zinc-900 text-zinc-100">
        <div className="sticky top-0 flex items-center overflow-hidden">
          <motion.p
            style={{ skewX, x }}
            className="origin-bottom-left whitespace-nowrap text-5xl font-black uppercase leading-[0.85] md:text-7xl md:leading-[0.85]"
          >
            Visualiza el ATH histórico de tus criptomonedas y descubre cuánto
            falta para alcanzarlo nuevamente.
          </motion.p>
        </div>
      </section>
      <Image
        src={`/images/imagen2.png`}
        alt="hero"
        height={1000}
        width={1800}
        className="mx-auto rounded-2xl h-full max-w-7xl transform transition-transform duration-700 p-2 mt-8"
        draggable={false}
        style={{ maxHeight: "100%", objectPosition: "center" }}
      />

      <GlitchText
        speed={20}
        enableShadows={true}
        enableOnHover={false}
        className="custom-class"
      >
        ATH histórico
      </GlitchText>

      <Image
        src={`/images/imagen3.png`}
        alt="hero"
        height={1000}
        width={1800}
        className="mx-auto rounded-2xl h-full max-w-7xl transform transition-transform duration-700 p-2 mt-8"
        draggable={false}
        style={{ maxHeight: "100%", objectPosition: "center" }}
      />
    </div>
  );
}

export default HeroTwo;
