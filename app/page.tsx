import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import TextPressure from "@/components/ui/TextPressure";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-[100vh] relative flex flex-col items-start justify-start bg-zinc-900 pt-10 md:pt-14 xl:pt-20">
        <div className="w-full max-w-7xl mx-auto h-32 md:h-64 xl:h-96 mb-8 px-4">
          <TextPressure
            text="DCA CRYPTO"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={false}
            textColor="#ffffff"
            strokeColor="#3b82f6"
            strokeWidth={1}
            minFontSize={48}
          />
        </div>

        <div className="text-center max-w-2xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-zinc-100">
            ¿Por qué usar Dollar Cost Averaging?
          </h2>
          <p className="text-lg text-zinc-300 mb-6">
            DCA es una estrategia de inversión que consiste en comprar
            regularmente, sin importar el precio.
            <span className="font-semibold text-zinc-100">
              Evita el estrés de intentar predecir el mercado
            </span>{" "}
            y aprovecha la volatilidad a tu favor. Con pequeñas inversiones
            periódicas, reduces el impacto de las fluctuaciones y obtienes un
            precio promedio más favorable a largo plazo.
            <span className="text-color-1">
              ¡Simple, efectivo y comprobado!
            </span>
          </p>
        </div>

        <div className="mt-10 mb-20 overflow-hidden py-8" style={{ transform: 'rotate(-4deg)', width: '120%', marginLeft: '-10%' }}>
          <VelocityScroll 
            defaultVelocity={0.2} 
            numRows={2} 
            className="text-xl font-bold" 
            skewAngle={0}
          >
            DCA reduce el riesgo y maximiza tus ganancias a largo plazo - 
          </VelocityScroll>
        </div>
      </div>
    </>
  );
}
