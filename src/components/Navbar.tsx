import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { IconLeaf, IconLogout } from "@tabler/icons-react";
import { SignOutButton } from "./auth/SignOutButton";
import { NavbarMenu } from "./NavbarMenu";

export function LogoNavbar() {
    return <Link href={'/'}>
        <h1 className="flex gap-1.5 items-center font-bold text-lg">
            <IconLeaf size={25} className="text-violet-600" />
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
                                <NavbarMenu />
                                <div>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Avatar className="hover:opacity-85 border border-stone-300">
                                                <AvatarImage src={'/user-profile.svg'} className={'object-contain'} />
                                                <AvatarFallback>EM</AvatarFallback>
                                            </Avatar>
                                        </PopoverTrigger>
                                        <PopoverContent className={'w-max divide-y flex flex-col gap-3 mr-3 md:mr-0'}>
                                            <span className={'text-sm font-bold'}>{user.email}</span>
                                            <div className={'pt-3'}>
                                                <SignOutButton className={'w-full'} variant={'default'} size={'sm'}>
                                                    <IconLogout /> Sair
                                                </SignOutButton>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </>
                            :
                            <Link href={'/sign-in'} className={buttonVariants({ variant: 'default' })}>
                                Entrar
                            </Link>

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