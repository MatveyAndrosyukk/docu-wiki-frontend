import {RefObject, useEffect} from "react";

export const useDblClickOutside = (
    ref: RefObject<HTMLDivElement | null>,
    handler: () => void,
    enabled: boolean
) => {
    useEffect(() => {
        if (!enabled) return;

        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            handler();
        };

        document.addEventListener("dblclick", listener);

        return () => document.removeEventListener("dblclick", listener);
    }, [ref, handler, enabled]);
};