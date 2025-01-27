'use client'

import { IconLeaf } from "@tabler/icons-react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname()
    return (
        <footer className={cn("w-full border-t border-dashed border-t-stone-300", {
            'bg-violet-600 text-white border-none': pathname === '/'
        })}>
            <MaxWidthWrapper classname={cn("py-14", {
                'border-none': pathname === '/'
            })}>
                <div className="flex flex-col gap-1.5 items-center justify-center">
                    <h1 className="text-sm font-bold flex gap-1.5">
                        <IconLeaf className="w-4 h-4" />
                        EcoMinds
                    </h1>
                    <span className={cn("text-sm text-stone-800", {
                        'text-white opacity-90': pathname === '/'
                    })}>Criado e desenvolvido por Heros Nuciatelli</span>
                </div>  
            </MaxWidthWrapper>
        </footer>
    )
}