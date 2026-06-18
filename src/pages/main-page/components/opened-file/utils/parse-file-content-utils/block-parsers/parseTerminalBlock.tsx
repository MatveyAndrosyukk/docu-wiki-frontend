import React from "react";
import styles from "../../../OpenedFile.module.scss";
import TerminalBlock from "../../../../../../../shared/ui/terminal-block/TerminalBlock";

export default function parseTerminalBlock(
    lines: string[],
    startIndex: number
) {
    const terminalLines: string[] = [];

    let i = startIndex + 1;

    while (
        i < lines.length &&
        !lines[i].startsWith('[/T]')
        ) {
        terminalLines.push(lines[i]);
        i++;
    }

    return {
        nextIndex: i + 1,

        element: (
            <div
                key={`terminal-${i}`}
                className={
                    styles['opened-file__content-terminal']
                }
            >
                <TerminalBlock
                    commands={terminalLines.join('\n')}
                />
            </div>
        )
    };
}