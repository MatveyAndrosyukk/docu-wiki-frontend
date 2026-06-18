import React from "react";
import styles from "../../../OpenedFile.module.scss";

export default function handleLineCodeTag(
    index: number,
    children: React.ReactNode[]
) {
    return (
        <span
            key={index}
            className={
                styles['opened-file__content-span-code']
            }
        >
            {children}
        </span>
    );
}