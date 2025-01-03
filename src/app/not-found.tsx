import { Footer } from "@/components/Footer";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Navbar } from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper classname="grid place-items-center py-32">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-5xl font-bold text-primary lg:text-6xl">
            Ah, que pena!
          </h2>
          <p>Não foi possível encontrar a página que você procura.</p>
          <Link href={'/'} className={buttonVariants({ variant: 'default'})}>Voltar</Link>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  )
}