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
import { IconLeaf, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { SignOutButton } from "./auth/SignOutButton";
import { NavbarMenu } from "./NavbarMenu";
import { cn } from "@/lib/utils";

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
    const auth_id = data.user?.id

    const { data: user_author } = await supabase.from('authors').select('*').eq('user_id', auth_id)
    const timestamp = new Date().getTime()

    return (
        <header className="border-b">
            <MaxWidthWrapper>
                <nav className="flex justify-between items-center py-5">
                    <LogoNavbar />
                    <div className="flex gap-5 items-center">
                        {auth_id ?
                            <>
                                <NavbarMenu />
                                {user_author && user_author[0] && (
                                    <div>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Avatar className="hover:opacity-85 border border-stone-300 h-12 w-12">
                                                    <AvatarImage src={user_author[0] ? `${user_author[0].image}?nocache=${timestamp}` : '/user-profile.svg'} className={'object-cover'} />
                                                    <AvatarFallback>EM</AvatarFallback>
                                                </Avatar>
                                            </PopoverTrigger>
                                            <PopoverContent className={'w-52 divide-y flex flex-col gap-3 mr-3 md:mr-0'}>
                                                <div className="text-center">
                                                    <span className={'text-sm font-bold'}>{user_author[0].name}</span>
                                                </div>

                                                <div className={'pt-3 flex flex-col gap-1.5'}>
                                                    <Link href={`/author/${user_author[0].id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}><IconUserCircle />Meu Perfil</Link>
                                                    <SignOutButton className={'w-full'} variant={'default'} size={'sm'}>
                                                        <IconLogout /> Sair
                                                    </SignOutButton>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
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