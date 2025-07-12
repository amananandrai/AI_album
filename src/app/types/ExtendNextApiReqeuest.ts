import { NextApiRequest } from "next";
import { IFile } from "../models/Files";

export interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        limit?: string;
        offset?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

export type ImageResponse = {
    rows: IFile[],
    total: number
}