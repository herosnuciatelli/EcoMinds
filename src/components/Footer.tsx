import { IconHeartFilled, IconLeaf } from "@tabler/icons-react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";

export function Footer() {
    return (
        <footer className="w-full border-t border-t-stone-300 py-5">
            <MaxWidthWrapper>
                <div className="flex flex-col md:flex-row items-start justify-between">
                    <div>
                        <h1 className="text-sm font-bold flex gap-1.5 items-center">
                            EcoMinds
                            <IconLeaf className="w-4 h-4" />
                        </h1>
                        <span className="text-sm font-medium">herosnuciatelli@gmail.com</span>
                    </div>

                    <h3 className="flex items-center gap-1 text-sm font-semibold">Desenvolvido com <IconHeartFilled className="stroke-violet-500 fill-violet-500 w-4 h-4" /> por Heros Nuciatelli</h3>

                </div>
                <div className="text-center py-3 text-sm">
                    <h3>© 2024 EcoMinds. Todos os direitos reservados.</h3>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}