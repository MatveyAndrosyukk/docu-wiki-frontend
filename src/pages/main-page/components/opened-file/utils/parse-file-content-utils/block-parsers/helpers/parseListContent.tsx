import React, {ReactNode} from "react";

import parseInline from "../../parseInline";

import parseCodeBlock from "../parseCodeBlock";
import parseTerminalBlock from "../parseTerminalBlock";
import parsePointBlock from "../parsePointBlock";
import parseDividerBlock from "../parseDividerBlock";

import styles from "../../../../OpenedFile.module.scss";

import {NumberingRef, PendingImages} from "../../types";

export default function parseListContent(
    lines: string[],
    startIndex: number,
    onImageClick: (url: string) => void,
    pendingImages: PendingImages,
    numberingRef: NumberingRef
) {
    const elements: ReactNode[] = [];

    let i = startIndex;

    while (
        i < lines.length &&
        lines[i].trim() !== '[/NL]'
        ) {
        const line = lines[i].trim();

        if (/^\[C\b/.test(line)) {
            const result = parseCodeBlock(
                lines,
                i,
            );

            elements.push(result.element);

            i = result.nextIndex;

            continue;
        }

        if (line.startsWith('[T]')) {
            const result = parseTerminalBlock(
                lines,
                i
            );

            elements.push(result.element);

            i = result.nextIndex;

            continue;
        }

        if (line.startsWith('[P]')) {
            const result = parsePointBlock(
                lines,
                i
            );

            elements.push(result.element);

            i = result.nextIndex;

            continue;
        }

        if (line === '[L]') {
            elements.push(
                parseDividerBlock(i)
            );

            i++;

            continue;
        }

        if (line.length > 0) {
            elements.push(
                <div
                    key={`list-text-${i}`}
                    className={
                        styles['opened-file__content-text']
                    }
                >
                    {parseInline(
                        line,
                        onImageClick,
                        pendingImages,
                        numberingRef
                    )}
                </div>
            );
        }

        i++;
    }

    return {
        elements,
        nextIndex: i + 1
    };
}