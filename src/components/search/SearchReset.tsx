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
        <Link href={action}>
            <Button type='reset' onClick={reset} className="h-12" asChild>
                <IconX />
            </Button>
        </Link>
    )
}