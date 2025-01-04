import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import 'easymde/dist/easymde.min.css'

import { Toaster } from "@/components/ui/toaster"

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoMinds",
  description: "Eco Minds é uma plataforma inovadora dedicada a reunir projetos, ideias e soluções voltadas para a sustentabilidade. Nosso objetivo é inspirar e capacitar indivíduos e organizações a adotar práticas sustentáveis, promovendo um futuro mais verde e consciente. Descubra iniciativas impactantes, conecte-se com uma comunidade engajada e faça parte da transformação ambiental. Junte-se ao movimento Eco Minds e ajude a construir um mundo mais sustentável hoje mesmo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="pt-br">
        <body
          className={`${jakartaSans.className} light antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
  );
}
