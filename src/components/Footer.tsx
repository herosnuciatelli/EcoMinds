import { IconHeartFilled, IconLeaf } from "@tabler/icons-react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";

export function Footer() {
    return (
        <footer className="w-full border-t border-t-stone-300">
            <MaxWidthWrapper classname="py-14">
                <div className="flex flex-col gap-1.5 items-center justify-center">

                    <h1 className="text-sm font-bold flex gap-1.5">
                        <IconLeaf className="w-4 h-4" />
                        EcoMinds
                    </h1>
                    <span className="text-sm text-stone-800">Criado e desenvolvido por Heros Nuciatelli</span>

                </div>  
            </MaxWidthWrapper>
        </footer>
    )
}