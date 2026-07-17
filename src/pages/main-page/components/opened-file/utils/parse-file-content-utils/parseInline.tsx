import React from "react";

import findNextTag from "./findNextTag";

import handleImageTag from "./handlers/handleImageTag";
import handleLinkTag from "./handlers/handleLinkTag";
import handleSimpleTag from "./handlers/handleSimpleTag";
import handleLineCodeTag from "./handlers/handleLineCodeTag";
import handleNumberTag from "./handlers/handleNumberTag";

import { NumberingRef, PendingImages } from "./types";

export default function parseInline(
    text: string,
    onImageClick: (imageUrl: string) => void | null,
    pendingImages: PendingImages,
    numberingRef?: NumberingRef
): React.ReactNode[] {

    const parts: React.ReactNode[] = [];

    let lastIndex = 0;

    let nextTag = findNextTag(text, 0);

    while (nextTag) {
        const { type, match } = nextTag;

        const index = match.index;

        if (index > lastIndex) {
            parts.push(
                text.slice(lastIndex, index)
            );
        }

        const children = parseInline(
            match[1] ?? match[2] ?? '',
            onImageClick,
            pendingImages,
            numberingRef
        );

        switch (type) {
            case 'link':
                parts.push(
                    handleLinkTag(
                        match[1],
                        index,
                        parseInline(
                            match[2],
                            onImageClick,
                            pendingImages,
                            numberingRef
                        )
                    )
                );
                break;

            case 'simple': {
                const children = parseInline(
                    match[2],
                    onImageClick,
                    pendingImages,
                    numberingRef
                );

                parts.push(
                    handleSimpleTag(
                        match,
                        index,
                        children
                    )
                );

                break;
            }

            case 'lineCode':
                parts.push(
                    handleLineCodeTag(
                        index,
                        children
                    )
                );
                break;

            case 'number':
                parts.push(
                    handleNumberTag(
                        index,
                        children,
                        numberingRef
                    )
                );
                break;

            case 'image':
                parts.push(
                    handleImageTag(
                        match,
                        index,
                        onImageClick,
                        pendingImages
                    )
                );
                break;
        }

        lastIndex =
            index + match[0].length;

        nextTag = findNextTag(
            text,
            lastIndex
        );
    }

    if (lastIndex < text.length) {
        parts.push(
            text.slice(lastIndex)
        );
    }

    return parts;
}