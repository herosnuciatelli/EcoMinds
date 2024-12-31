import { writeClient } from "@/sanity/lib/write-client"
import { after } from "next/server"

export async function View({ views, id }: {
  views: number
  id: string
}) {
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: views + 1 })
        .commit()
  )
  
  return (
    <div className="py-1.5 px-5 w-max rounded-sm bg-rose-100 fixed z-10 bottom-5 md:bottom-28 right-5 md:right-28">
      <div className="absolute -top-1 -right-1">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
      </div>

      <span className="flex gap-1.5 font-bold">{views} Views</span>
    </div>
  )
}