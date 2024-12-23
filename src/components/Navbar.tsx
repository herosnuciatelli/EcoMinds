import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export function LogoNavbar() {
    return <Link href={'/'}>
                <h1 className="flex gap-2 items-center font-bold text-lg">
                    <Image src={'/logo.svg'} className="rounded-md" width={40} height={40} alt="logo" />
                    EcoMinds
                </h1>
            </Link>
}

export async function Navbar() {
    return (
        <header className="border-b">
            <MaxWidthWrapper>
                <nav className="flex justify-between items-center py-5">
                    <LogoNavbar />
                    <div>
                        <ul>
                            <li></li>
                        </ul>

                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        
                        <SignedOut>
                            <SignInButton>
                                <Button>Entrar</Button>
                            </SignInButton>
                        </SignedOut>
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