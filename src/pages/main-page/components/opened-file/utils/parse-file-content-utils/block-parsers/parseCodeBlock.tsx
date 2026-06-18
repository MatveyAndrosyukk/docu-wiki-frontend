import React from "react";
import styles from "../../../OpenedFile.module.scss";
import CodeBlock from "../../../../../../../shared/ui/code-block/CodeBlock";

export default function parseCodeBlock(
    lines: string[],
    startIndex: number,
    isFileTreeOpened: boolean
) {
    const codeLines: string[] = [];

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
                    code={codeLines.join('\n')}
                    isFileTreeOpened={isFileTreeOpened}
                />
            </div>
        )
    };
}