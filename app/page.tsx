import TextPressure from "@/components/ui/TextPressure";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-[100vh] relative flex flex-col items-start justify-start bg-zinc-900 pt-6 md:pt-10 xl:pt-20">
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
        
        <div className="text-center max-w-xl mx-auto px-4">
          <p className="text-lg text-zinc-300 mb-6">
            Dollar Cost Averaging para tus inversiones en criptomonedas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-center font-medium transition-colors"
            >
              Ir al Dashboard
            </Link>
            <Link 
              href="/reset-password" 
              className="border border-zinc-600 hover:border-zinc-400 px-6 py-3 rounded-md text-center font-medium transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
