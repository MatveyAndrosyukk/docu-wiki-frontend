export interface ValidationParams {

    content: string;

    images: string[];

    setContentError(
        value: string
    ): void;

}

export type ValidationActionsState = {};