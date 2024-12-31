import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchReset } from "./SearchReset"
import Form from "next/form"
import { cn } from "@/lib/utils"

function Search({ query, className }: { query?: string, className?: string }) {
    return (
        <Form action={'/'} className={cn("max-w-lg flex gap-1 justify-center mx-auto", className)} id="searchForm">
            <Input 
                placeholder="Procurar Projeto"
                className="border-2 border-r-4 border-b-4 h-12 border-stone-950"
                defaultValue={query}
                name="query"
            />
            {
                query ?
                <SearchReset />
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