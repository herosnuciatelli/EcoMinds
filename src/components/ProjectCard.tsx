import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button, buttonVariants } from "./ui/button"
import { IconDotsVertical, IconEye, IconPencilPlus } from "@tabler/icons-react"
import Link from "next/link"
import { ProjectType } from "@/types/Projects"
import { Popover, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { PopoverContent } from "@radix-ui/react-popover"
import { DeleteProjectButton } from "./ui/delete-project-button"

export function ProjectCard({
    post,
    variant
}: { post: ProjectType, variant: 'vertical' | 'horizontal' }) {
    return (
        <Card className={cn("w-full", {
            "md:max-w-96 mx-auto group hover:border-violet-950 transition-all hover:bg-violet-50": variant === 'vertical',
            "flex border-2 border-stone-800 rounded-sm shadow-none items-start": variant === 'horizontal'
        })}>
            <CardHeader className={cn({
                "flex flex-col justify-between h-full py-3 flex-1": variant === 'horizontal'
            })}>
                {variant === 'vertical' && (
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Sustentabilidade</h3>

                        <div className="flex gap-1.5 items-center">
                            <IconEye className="stroke-rose-600" />
                            <span className="text-sm font-semibold">{post.views}</span>
                        </div>
                    </div>
                )}

                <Link
                    className={cn({
                        "flex flex-col gap-1.5": variant === "vertical"
                    })}
                    href={`/project/${post._id}`}
                >
                    <CardTitle className="text-xl font-bold group-hover:underline line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className={cn({
                        "line-clamp-4 h-20": variant === 'vertical',
                        "line-clamp-2 h-10": variant === 'horizontal'
                    })}>{post.description}</CardDescription>
                </Link>

                {variant === 'horizontal' &&
                    <h3 className="font-semibold text-sm bg-violet-100 border-2 border-violet-800 px-2 py-1.5 rounded-sm w-max">Sustentabilidade</h3>
                }

            </CardHeader>

            {variant === 'vertical' && (
                <>
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
                </>
            )}

            {variant === 'horizontal' && (
                <div>
                    <Popover>
                        <PopoverTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "my-3 mx-6")}>
                            <IconDotsVertical />
                        </PopoverTrigger>
                        <PopoverContent className="bg-white w-40 border-2 border-stone-800 py-3 px-1.5 rounded-md">
                            <ul className="flex flex-col gap-1.5">
                                <li>
                                    <Link href={`/dashboard/update/${post._id}`} className={cn(buttonVariants({ variant: 'outline' }), "w-full justify-between")}>
                                        Editar
                                        <IconPencilPlus />
                                    </Link>
                                </li>
                                <li>
                                    <DeleteProjectButton id={post._id} image={post.image} />
                                </li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </Card>
    )
}