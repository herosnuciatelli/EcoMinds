import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { ProjectForm } from "@/components/ProjectForm"
import { handleCreateProject } from "../actions/create-project"
import { IconCloudUp } from "@tabler/icons-react"

export default async function Page() {
    return (
        <>
            <MaxWidthWrapper>
                <section className="h-96 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                    <div>
                        <div className="flex flex-col gap-1.5 items-center">
                            <h2 className="text-2xl lg:text-4xl text-white font-bold bg-stone-950 w-max p-3">
                                Envie seu novo projeto
                            </h2>
                        </div>
                    </div>    
                </section>
                <div data-color-mode="light">
                    <ProjectForm action={handleCreateProject}>
                        Enviar <IconCloudUp />
                    </ProjectForm>
                </div>
            </MaxWidthWrapper>
        </>
    )
}