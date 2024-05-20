import { getImages } from "@/app/services/images";
import { ImageResponse } from "@/app/types/ExtendNextApiReqeuest";

export async function GET() {
    try {
        const resp: ImageResponse = await getImages(9, 0);

        console.debug("🚀  file: route.ts:11  GET  resp:", resp);

        return Response.json({ resp })

    }
    catch (e: any) {
        console.error(e.message);
        return Response.json({ error: true, message: e.message })
        // //@ts-ignore next-line
        // Response.status(500).json({ error: true, message: e.message })
    }

}


