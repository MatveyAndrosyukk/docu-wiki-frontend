import {useEffect} from "react";

export const useSetDocumentTitle = (title: string) => {

    useEffect(
        () => {

            document.title = title;
        },
        [
            title
        ]
    );

};