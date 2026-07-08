import {useEffect} from "react";
import {ValidationActionsState, ValidationParams,} from "./validation.types";
import {isUserAdminOrOwner} from "../../../../utils/permissions-utils/isUserAdminOrOwner";

export default function useValidationHandler(
    {
        content,
        images,
        loggedInUser,
        setContentError,
    }: ValidationParams
): ValidationActionsState {

    useEffect(
        () => {

            const contentLength = content.length;

            const imagesLength = images.length;

            if (
                contentLength > 100000 &&
                !isUserAdminOrOwner(
                    loggedInUser
                )
            ) {

                setContentError(
                    `Your note is too long (${contentLength}/100000).`
                );

                return;

            }

            if (
                imagesLength > 5 &&
                !isUserAdminOrOwner(
                    loggedInUser
                )
            ) {

                setContentError(
                    `You have inserted too many pictures (${imagesLength}/5).`
                );

                return;

            }

            setContentError("");

        },
        [
            content,
            images,
            loggedInUser,
            setContentError,
        ]
    );

    return {};

}