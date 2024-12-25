import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { IconEye } from "@tabler/icons-react"
import Link from "next/link"
import { ProjectCardType } from "@/types/Projects"

function ProjectCard({
   post
}: { post: ProjectCardType}) {
    return (
        <Card className="max-w-96 w-full hover:border-violet-950 transition-all hover:bg-violet-50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Sustentabilidade</h3>

                    <div className="flex gap-1.5 items-center">
                        <IconEye className="stroke-rose-600" />
                        <span className="text-sm font-semibold">{post.views}</span>
                    </div>
                </div>
                <Link className="group flex flex-col gap-1.5" href={`/project/${post._id}`}>
                    <CardTitle className="text-xl font-bold group-hover:underline line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-4 h-20">{post.description}</CardDescription>
                </Link>
                
            </CardHeader>

            <Link href={`/project/${post._id}`}>
                <div className="p-6 pt-0">
                    <div>
                        { post.image && 
                            <img style={{ backgroundSize: 'cover' }} src={post.image} alt="imagem" className="h-40 rounded-md border border-stone-950 w-full" />
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

export {
    ProjectCard
}