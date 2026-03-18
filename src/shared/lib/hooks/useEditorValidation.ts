import {useEffect} from "react";
import {isUserAdminOrOwner} from "../utils/permissions-utils/isUserAdminOrOwner";

export const useEditorValidation = (
    content: string,
    images: string[],
    loggedInUser: any,
    setContentError: (v: string) => void
) => {

    useEffect(() => {
        const length = content.length;
        const imagesLength = images.length;

        if (length > 100000 && !isUserAdminOrOwner(loggedInUser)) {
            setContentError(`Your note is too long (${length}/100000).`);
            return;
        }

        if (imagesLength > 5 && !isUserAdminOrOwner(loggedInUser)) {
            setContentError(`You have inserted too many pictures (${imagesLength}/5).`);
        } else {
            setContentError('');
        }

    }, [content, images, loggedInUser, setContentError]);

};