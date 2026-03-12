import {RefObject, useEffect} from "react";

type EventType = "click" | "dblclick" | "mousedown" | "mouseup";

export const useElementOutsideEvent = (
    ref: RefObject<HTMLElement | null>,
    eventType: EventType,
    handler: () => void,
    enabled: boolean = true,
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

        document.addEventListener(eventType, listener);

        return () => {
            document.removeEventListener(eventType, listener);
        };
    }, [ref, eventType, handler, enabled, excludeRef]);
};