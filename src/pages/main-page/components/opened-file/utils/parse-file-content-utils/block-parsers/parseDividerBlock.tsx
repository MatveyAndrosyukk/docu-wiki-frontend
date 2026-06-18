import React from "react";
import styles from "../../../OpenedFile.module.scss";

export default function parseDividerBlock(
    index: number
) {
    return (
        <div
            key={`line-${index}`}
            className={
                styles['opened-file__content-line']
            }
        />
    );
}