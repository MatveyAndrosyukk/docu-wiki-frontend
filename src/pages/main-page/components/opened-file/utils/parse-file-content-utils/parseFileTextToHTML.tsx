import React, { ReactNode } from "react";

import parseCodeBlock from "./block-parsers/parseCodeBlock";
import parseTerminalBlock from "./block-parsers/parseTerminalBlock";
import parseDividerBlock from "./block-parsers/parseDividerBlock";
import parsePointBlock from "./block-parsers/parsePointBlock";
import parseNumberListBlock from "./block-parsers/parseNumberListBlock";
import parseTextBlock from "./block-parsers/parseTextBlock";

import { PendingImages } from "./types";

export default function parseFileTextToHTML(
    file: string,
    onImageClick: (imageUrl: string) => void | null,
    isFileTreeOpened: boolean,
    pendingImages: PendingImages,
): ReactNode[] {

    const lines = file.split('\n');

    const elements: ReactNode[] = [];

    let i = 0;

    while (i < lines.length) {

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

        if (line === '[NL]') {
            const result = parseNumberListBlock(
                lines,
                i,
                onImageClick,
                isFileTreeOpened,
                pendingImages,
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

        if (line.startsWith('[P]')) {
            const result = parsePointBlock(
                lines,
                i
            );

            elements.push(result.element);
            i = result.nextIndex;
            continue;
        }

        if (line.length) {
            elements.push(
                parseTextBlock(
                    line,
                    i,
                    onImageClick,
                    pendingImages
                )
            );

            i++;
            continue;
        }

        elements.push(
            <div
                key={`empty-${i}`}
                style={{ height: 8 }}
            />
        );

        i++;
    }

    return elements;
}