import { Footer } from "@/components/Footer";
import { AuthNavbar } from "@/components/Navbar";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <AuthNavbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}