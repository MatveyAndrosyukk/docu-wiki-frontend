import React from "react";
import styles from "../../../OpenedFile.module.scss";

export default function parsePointBlock(
    lines: string[],
    startIndex: number
) {
    const pointLines: string[] = [];

    let i = startIndex + 1;

    while (
        i < lines.length &&
        !lines[i].startsWith('[/P]')
        ) {
        pointLines.push(lines[i]);
        i++;
    }

    return {
        nextIndex: i + 1,

        element: (
            <div
                key={`point-${i}`}
                className={
                    styles['opened-file__content-point']
                }
            >
                {pointLines.join('\n')}
            </div>
        )
    };
}