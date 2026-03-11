import {RefObject, useEffect} from "react";

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: () => void,
    enabled: boolean,
    excludeRef?: RefObject<HTMLElement | null>
) => {
    useEffect(() => {
        if (!enabled) return;

        const listener = (event: MouseEvent) => {
            const target = event.target as Node;

            if (!ref.current || ref.current.contains(target)) return;

            if (excludeRef?.current && excludeRef.current.contains(target)) return;

            handler();
        };

        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("click", listener);
        };
    }, [ref, handler, enabled, excludeRef]);
};