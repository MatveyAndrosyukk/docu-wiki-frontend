import React from "react";
import styles from "../../../OpenedFile.module.scss";

import {PendingImages} from "../types";
import parseListContent from "./helpers/parseListContent";

export default function parseNumberListBlock(
    lines: string[],
    startIndex: number,
    onImageClick: (url: string) => void,
    isFileTreeOpened: boolean,
    pendingImages: PendingImages
) {
    const numberingRef = {
        current: 0
    };

    const result = parseListContent(
        lines,
        startIndex + 1,
        onImageClick,
        pendingImages,
        numberingRef
    );

    return {
        nextIndex: result.nextIndex,

        element: (
            <div
                key={`list-${startIndex}`}
                className={
                    styles['opened-file__content-number-list']
                }
            >
                {result.elements}
            </div>
        )
    };
}