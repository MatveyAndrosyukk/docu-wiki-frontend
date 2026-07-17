import React from "react";
import styles from "../../../OpenedFile.module.scss";
import CodeBlock from "../../../../../../../shared/ui/code-block/CodeBlock";

export default function parseCodeBlock(
    lines: string[],
    startIndex: number,
) {
    const codeLines: string[] = [];

    const firstLine = lines[startIndex];

    const match =
        firstLine.match(/\[C(?:\s+name="([^"]*)")?]/);

    const fileName = match?.[1] ?? "";

    let i = startIndex + 1;

    while (
        i < lines.length &&
        !lines[i].startsWith('[/C]')
        ) {
        codeLines.push(lines[i]);
        i++;
    }

    return {
        nextIndex: i + 1,

        element: (
            <div
                key={`code-${i}`}
                className={
                    styles['opened-file__content-code']
                }
            >
                <CodeBlock
                    fileName={fileName}
                    code={codeLines.join('\n')}
                />
            </div>
        )
    };
}