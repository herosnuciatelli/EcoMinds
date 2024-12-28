'use client'

import { createClient } from "@/utils/supabase/client";
import { Button, ButtonProps } from "../ui/button";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton({ children,...rest}: ButtonProps) {
   const [isLoading, startTransition] = useTransition()
   const router = useRouter()

    const handleSignOutUser = async () => {
        startTransition(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.refresh()   
        })
    }
    
    return <Button
                {...rest}
                disabled={isLoading}
                onClick={handleSignOutUser}
            >
                <LoaderCircleIcon
                className={cn(
                    {
                    hidden: !isLoading,
                    },
                    'size-3 animate-spin',
                )}
                />
                {children}
            </Button>

}