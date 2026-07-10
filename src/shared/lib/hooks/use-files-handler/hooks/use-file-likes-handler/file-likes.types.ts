export type FileLikesState = {
    isLiking: boolean;
};

export type FileLikesActions = {
    toggleLike(): Promise<void>;

    setIsLiking(
        value: boolean
    ): void;
};

export type FileLikesActionsState = {
    state: FileLikesState;

    actions: FileLikesActions;
};

export const initialState: FileLikesState = {
    isLiking: false,
};