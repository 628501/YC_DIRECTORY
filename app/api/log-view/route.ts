import { writeClient } from "@/sanity/lib/write-client"
import { after } from "next/server"

export async function POST(req: Request) {
  const { id, views } = await req.json()

  after(async () => {
    await writeClient.patch(id).set({ views: views + 1 }).commit()
  })

  return new Response('Logged', { status: 200 });
}
