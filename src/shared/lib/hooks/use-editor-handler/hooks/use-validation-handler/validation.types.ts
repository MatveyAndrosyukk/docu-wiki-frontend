export interface ValidationParams {

    content: string;

    images: string[];

    loggedInUser: any;

    setContentError(
        value: string
    ): void;

}

export type ValidationActionsState = {};