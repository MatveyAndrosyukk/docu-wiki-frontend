import React from "react";
import { NumberingRef } from "../types";

export default function handleNumberTag(
    index: number,
    children: React.ReactNode[],
    numberingRef?: NumberingRef
) {
    if (!numberingRef) {
        return (
            <React.Fragment key={index}>
                {children}
            </React.Fragment>
        );
    }

    numberingRef.current++;

    return (
        <React.Fragment key={index}>
            {numberingRef.current}. {children}
        </React.Fragment>
    );
}