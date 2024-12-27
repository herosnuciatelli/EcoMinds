import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"  
import { IconUserFilled } from "@tabler/icons-react";

export function LogoNavbar() {
    return <Link href={'/'}>
        <h1 className="flex gap-2 items-center font-bold text-lg">
            <Image src={'/logo.svg'} className="rounded-md" width={30} height={30} alt="logo" />
            EcoMinds
        </h1>
    </Link>
}

export async function Navbar() {
    const supabase = await createClient()

    const { data } = await supabase.auth.getUser()
    const user = data.user

    return (
        <header className="border-b">
            <MaxWidthWrapper>
                <nav className="flex justify-between items-center py-5">
                    <LogoNavbar />
                    <div className="flex gap-5 items-center">
                        {user?.id ?
                            <>
                                <ul>
                                    <li className="text-sm">
                                        <Link href={'/project/create'} className={buttonVariants({ variant: 'ghost' })}>Criar Projeto</Link>
                                    </li>
                                </ul>
                                <div>
                                <Popover>
                                    <PopoverTrigger>
                                        <Avatar className="hover:opacity-85 border border-stone-900">
                                            <AvatarImage />
                                            <AvatarFallback><IconUserFilled /></AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover>
                                </div>
                            </>
                            :
                            <Button asChild>
                                <Link href={'/sign-in'}>
                                    Entrar
                                </Link>
                            </Button>
                        }
                    </div>
                </nav>
            </MaxWidthWrapper>
        </header>
    )
}

export function AuthNavbar() {
    return (
        <header className="border-b">
            <MaxWidthWrapper>
                <nav className="flex justify-between py-5">
                    <LogoNavbar />
                </nav>
            </MaxWidthWrapper>
        </header>
    )
}