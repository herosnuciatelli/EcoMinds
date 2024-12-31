import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button, buttonVariants } from "./ui/button"
import { IconDotsVertical, IconEye } from "@tabler/icons-react"
import Link from "next/link"
import { ProjectCardType } from "@/types/Projects"
import { Popover, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { PopoverContent } from "@radix-ui/react-popover"

function ProjectCard({
    post
}: { post: ProjectCardType }) {
    return (
        <Card className="max-w-96 group w-full hover:border-violet-950 transition-all hover:bg-violet-50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Sustentabilidade</h3>

                    <div className="flex gap-1.5 items-center">
                        <IconEye className="stroke-rose-600" />
                        <span className="text-sm font-semibold">{post.views}</span>
                    </div>
                </div>
                <Link className="flex flex-col gap-1.5" href={`/project/${post._id}`}>
                    <CardTitle className="text-xl font-bold group-hover:underline line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-4 h-20">{post.description}</CardDescription>
                </Link>

            </CardHeader>

            <Link href={`/project/${post._id}`}>
                <div className="p-6 pt-0">
                    <div>
                        {post.image &&
                            <img src={post.image} alt="imagem" className="h-40 rounded-md border object-cover border-stone-950 w-full" />
                        }
                    </div>
                </div>
            </Link>

            <CardFooter className="justify-end">
                <Link href={`/project/${post._id}`}>
                    <Button>Ver Detalhes</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

function ProjectHorizontalCard({
    post
}: { post: ProjectCardType }) {
    return (
        <Card className="w-full flex border border-stone-300 rounded-sm shadow-none items-center">
            <div className="py-1.5 px-6">
                <div>
                    {post.image &&
                        <img src={post.image} alt="imagem" className="h-28 w-32 rounded-md border object-cover border-stone-300" />
                    }
                </div>
            </div>

            <div className="flex flex-1">
                <CardHeader className="flex flex-col justify-between h-full py-3">
                    <Link className="flex flex-col gap-1.5" href={`/project/${post._id}`}>
                        <CardTitle className="text-xl font-bold hover:underline line-clamp-1">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2 h-10">{post.description}</CardDescription>
                    </Link>

                    <h3 className="font-semibold text-sm bg-teal-100 border border-teal-300 px-2 py-1.5 rounded-sm w-max">Sustentabilidade</h3>

                </CardHeader>
            </div>

            <div>
                <Popover>
                    <PopoverTrigger className={cn(buttonVariants({ variant: 'ghost'}), "my-3 mx-6")}>
                        <IconDotsVertical />
                    </PopoverTrigger>
                    <PopoverContent>

                    </PopoverContent>
                </Popover>
            </div>

        </Card>
    )
}

export {
    ProjectCard,
    ProjectHorizontalCard
}