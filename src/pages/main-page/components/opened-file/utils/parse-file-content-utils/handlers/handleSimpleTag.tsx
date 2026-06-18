import React from "react";
import styles from "../../../OpenedFile.module.scss";

export default function handleSimpleTag(
    match: RegExpExecArray,
    index: number,
    children: React.ReactNode[]
) {
    const tag = match[1];

    const classMap = {
        B: styles['opened-file__content-bold'],
        I: styles['opened-file__content-italic'],
        U: styles['opened-file__content-underline']
    };

    return (
        <span
            key={index}
            className={
                classMap[tag as keyof typeof classMap]
            }
        >
            {children}
        </span>
    );
}