export function readImageSize(buffer: Buffer): { width: number; height: number } | null {
    if (buffer.length < 24) return null;

    if (buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") {
        return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }

    if (buffer.toString("ascii", 0, 3) === "GIF") {
        return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
    }

    if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
        const format = buffer.toString("ascii", 12, 16);
        if (format === "VP8X" && buffer.length >= 30) {
            return {
                width: 1 + buffer.readUIntLE(24, 3),
                height: 1 + buffer.readUIntLE(27, 3),
            };
        }
        if (format === "VP8 " && buffer.length >= 30) {
            return {
                width: buffer.readUInt16LE(26) & 0x3fff,
                height: buffer.readUInt16LE(28) & 0x3fff,
            };
        }
        if (format === "VP8L" && buffer.length >= 25) {
            const bits = buffer.readUInt32LE(21);
            return {
                width: (bits & 0x3fff) + 1,
                height: ((bits >> 14) & 0x3fff) + 1,
            };
        }
    }

    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2;
        while (offset + 9 < buffer.length) {
            if (buffer[offset] !== 0xff) break;
            const marker = buffer[offset + 1];
            if (marker === 0xd8 || marker === 0xd9) {
                offset += 2;
                continue;
            }
            const size = buffer.readUInt16BE(offset + 2);
            if (size < 2) break;
            if (marker >= 0xc0 && marker <= 0xc2) {
                return {
                    height: buffer.readUInt16BE(offset + 5),
                    width: buffer.readUInt16BE(offset + 7),
                };
            }
            offset += 2 + size;
        }
    }

    return null;
}
