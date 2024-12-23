import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchReset } from "./SearchReset"
import Form from "next/form"

function Search({ query }: { query?: string }) {
    return (
        <Form action={'/'} className="max-w-lg flex gap-1 justify-center mx-auto" id="searchForm">
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
                ><IconSearch /></Button>
            }

        </Form>
    )
}

export {Search}