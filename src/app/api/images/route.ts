import { getImages } from "@/app/services/images";
import { ImageResponse } from "@/app/types/ExtendNextApiReqeuest";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const limit = parseInt(params.get("limit") || "9");
        const offset = parseInt(params.get("offset") || "0");
        const resp: ImageResponse = await getImages(limit, offset);
        return Response.json(resp, {
            status: 200, headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=10'
            },
        });

    }
    catch (e: any) {
        console.error(e.message);
        return Response.json({ error: true, message: e.message }, { status: 500 })
    }

}


