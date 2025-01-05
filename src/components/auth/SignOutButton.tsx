'use client'

import { createClient } from "@/utils/supabase/client";
import { Button, ButtonProps } from "../ui/button";
import { useTransition } from "react";

export function SignOutButton({ children,...rest}: ButtonProps) {
   const [isLoading, startTransition] = useTransition()

    const handleSignOutUser = async () => {
        startTransition(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.reload()
        })
    }
    
    return <Button
                {...rest}
                disabled={isLoading}
                onClick={handleSignOutUser}
                isLoading={isLoading}
            >
                {children}
            </Button>

}