import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchReset } from "./SearchReset"
import Form from "next/form"
import { cn } from "@/lib/utils"

function Search({ query, className, action = '/'}: { query?: string, className?: string, action?: string }) {
    return (
        <Form action={action} className={cn("max-w-lg flex gap-1 justify-center mx-auto", className)} id="searchForm">
            <Input 
                placeholder="Procurar Projeto..."
                className="border border-stone-900 h-12"
                defaultValue={query}
                name="query"
            />
            {
                query ?
                <SearchReset action={action} />
                :
                <Button
                    className="h-12"
                    type="submit"
                    variant={'default'}
                ><IconSearch /></Button>
            }

        </Form>
    )
}

export {Search}