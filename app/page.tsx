import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import TextPressure from "@/components/ui/TextPressure";
import HeroTwo from "@/components/ui/HeroTwo";
import HeroMobile from "@/components/ui/HeroMobile";
import Footer from "@/components/ui/Footer";
import TextHoverEffect from "@/components/ui/text-hover-effect";

export default function Home() {
  return (
    <div>
      <div className="xl:h-[100vh] relative flex flex-col items-start justify-start bg-zinc-900 pt-10 md:pt-14 xl:pt-20">
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
          <h2 className="md:text-2xl text-xl font-bold mb-4 text-zinc-100">
            ¿Por qué usar Dollar Cost Averaging?
          </h2>
          <p className="md:text-lg text-base text-zinc-300 mb-6">
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

        <div
          className="xl:mt-10 xl:pb-20 mt-4 pb-6 overflow-hidden py-8 w-full"
          style={{ transform: "rotate(-4deg)" }}
        >
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
      <div>
        <div className="hidden lg:block">
          <HeroTwo />
        </div>
        <div className="block lg:hidden">
          <HeroMobile />
        </div>
      </div>
      <div className="lg:h-[40rem] flex items-center justify-center">
      <TextHoverEffect text="HODL" />
    </div>
      <Footer />
    </div>
  );
}
