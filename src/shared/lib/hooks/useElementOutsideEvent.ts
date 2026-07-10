import {RefObject, useEffect} from "react";

type EventType = "click" | "dblclick" | "mousedown" | "mouseup";

interface Params {
    ref: RefObject<HTMLElement | null>;

    eventType: EventType;

    handler: () => void;

    enabled?: boolean;

    excludeRef?: RefObject<HTMLElement | null>;
}

export const useElementOutsideEvent = (
    {
        ref,
        eventType,
        handler,
        enabled = true,
        excludeRef,
    }: Params
) => {

    useEffect(
        () => {

            if (!enabled) return;

            const listener = (
                event: MouseEvent
            ) => {

                const target = event.target as Node;

                if (
                    !ref.current
                    || ref.current.contains(
                        target
                    )
                ) return;

                if (
                    excludeRef?.current
                    && excludeRef.current.contains(
                        target
                    )
                ) return;

                handler();
            };

            document.addEventListener(
                eventType,
                listener
            );

            return () => {
                document.removeEventListener(
                    eventType,
                    listener
                );
            };
        },
        [
            ref,
            eventType,
            handler,
            enabled,
            excludeRef
        ]
    );
};