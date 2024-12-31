'use client'

import { Button } from '@/components/ui/button'
import { IconX } from '@tabler/icons-react'
import Link from 'next/link'

export function SearchReset({action = '/'}: { action: string}) {
    const reset = () => {
        const form = document.querySelector('#searchForm') as HTMLFormElement

        if (form) form.reset()
    }

    return (
        <Button type='reset' onClick={reset} className="h-12" asChild>
            <Link href={action}>
                <IconX />
            </Link>
        </Button>
    )
}