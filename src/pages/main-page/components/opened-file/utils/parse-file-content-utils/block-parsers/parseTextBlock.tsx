import React from "react";
import styles from "../../../OpenedFile.module.scss";

import parseInline from "../parseInline";
import { PendingImages } from "../types";

export default function parseTextBlock(
    line: string,
    index: number,
    onImageClick: (url: string) => void,
    pendingImages: PendingImages
) {
    return (
        <div
            key={`text-${index}`}
            className={
                styles['opened-file__content-text']
            }
        >
            {
                parseInline(
                    line,
                    onImageClick,
                    pendingImages
                )
            }
        </div>
    );
}