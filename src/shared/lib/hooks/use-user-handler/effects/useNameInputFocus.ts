import {RefObject, useEffect} from "react";

type Props = {
    isEditingName: boolean;
    inputRef: RefObject<HTMLInputElement | null>;
};

export default function useNameInputFocus(
    {
        isEditingName,
        inputRef,
    }: Props) {

    useEffect(
        () => {

            if (
                isEditingName &&
                inputRef.current
            ) {

                inputRef.current.focus();

                inputRef.current.select();

                inputRef.current.disabled = false;

            }

        },
        [
            isEditingName,
            inputRef,
        ]
    );

}