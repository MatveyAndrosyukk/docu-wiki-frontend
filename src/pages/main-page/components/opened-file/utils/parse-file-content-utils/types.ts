export type PendingImages = Record<
    string,
    {
        status: 'pending' | 'ready' | 'error';
    }
>;

export type NumberingRef = {
    current: number;
};