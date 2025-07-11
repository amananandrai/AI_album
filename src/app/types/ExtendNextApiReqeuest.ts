import { NextApiRequest } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        limit?: string;
        offset?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

export type ImageResponse = {
    rows: string[],
    total: number
}