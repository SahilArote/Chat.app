export interface PaginationOptions {
    page?: number;
    limit?: number;
    cursor?: string;
    before?: string;
    after?: string;
}

export interface PaginationResult<T> {
    items: T[];
    pagination: {
        page?: number;
        limit: number;
        total?: number;
        pages?: number;
        hasMore: boolean;
        nextCursor?: string | null;
        prevCursor?: string | null;
    };
}

export class PaginationHelper {
    static sanitizeLimit(limit?: number, defaultLimit: number = 30, maxLimit: number = 100): number {
        if (!limit || limit < 1) return defaultLimit;
        return Math.min(limit, maxLimit);
    }

    static sanitizePage(page?: number): number {
        if (!page || page < 1) return 1;
        return page;
    }
}

export default PaginationHelper;
