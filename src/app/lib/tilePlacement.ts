const ROW_HEIGHT = 8;
const MAX_ROW_SPAN = 80;

export function columnSpanForRatio(ratio: number, columns: number): number {
    if (!Number.isFinite(ratio) || ratio <= 0 || columns < 1) return 1;
    if (columns <= 2) return ratio >= 1.3 ? Math.min(2, columns) : 1;
    if (ratio >= 2.15) return Math.min(3, columns);
    if (ratio >= 1.25) return 2;
    return 1;
}

export function countColumnTracks(gridTemplateColumns: string): number {
    const value = gridTemplateColumns.trim();
    if (!value || value === "none") return 1;
    const repeat = value.match(/repeat\(\s*(\d+)/i);
    if (repeat) return Math.max(1, Number(repeat[1]));
    if (value.includes("minmax(")) {
        return Math.max(1, value.match(/minmax\(/gi)?.length ?? 1);
    }
    return Math.max(1, value.split(/\s+/).filter(Boolean).length);
}

export function tilePlacement(
    ratio: number,
    columns: number,
    columnWidth: number,
    gap: number,
    rowGap = gap
): { colSpan: number; rowSpan: number } {
    const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    const safeGap = Number.isFinite(gap) ? gap : 0;
    const safeRowGap = Number.isFinite(rowGap) ? rowGap : safeGap;
    const colSpan = columnSpanForRatio(safeRatio, columns);
    const width = colSpan * columnWidth + (colSpan - 1) * safeGap;
    const height = width / safeRatio;
    const rowSpan = Math.round((height + safeRowGap) / (ROW_HEIGHT + safeRowGap));
    return {
        colSpan,
        rowSpan: Math.min(MAX_ROW_SPAN, Math.max(1, rowSpan)),
    };
}

export const BENTO_ROW_HEIGHT = ROW_HEIGHT;
