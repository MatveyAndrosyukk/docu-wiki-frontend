import {RefObject, useEffect} from "react";

export function useModalFocusEffect(
    isOpen: boolean,
    ref: RefObject<HTMLInputElement | null>
) {
    useEffect(() => {
        if (isOpen && ref.current) {
            ref.current.focus();
        }
    }, [isOpen, ref]);
}