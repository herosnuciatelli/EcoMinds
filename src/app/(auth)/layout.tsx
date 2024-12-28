import { Footer } from "@/components/Footer";
import { AuthNavbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const { auth } = await createClient()
    const { data } = await auth.getUser()

    if (data.user) {
        redirect('/')
    }


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