'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { usePathname } from "next/navigation"
import { IconDashboard } from "@tabler/icons-react"

export function NavbarMenu() {
    const pathname = usePathname()
    return (
        <ul className="flex">
            <li>
                <Link href={'/dashboard'} className={cn(buttonVariants({ variant: 'ghost' }), "flex text-sm items-center gap-1.5 justify-start", {
                    "bg-stone-200": pathname == '/dashboard'
                })}><IconDashboard size={14} />Dashboard</Link>
            </li>
        </ul>
    )
}