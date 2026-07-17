import React, {FC, useCallback, useMemo, useState} from 'react';
import styles from './TerminalBlock.module.scss'
import {ReactComponent as HideCodeSvg} from '../code-block/images/hide-code.svg';

interface Props {
    commands: string;
}

const TerminalBlock: FC<Props> = (
    {
        commands
    }
) => {

    const [isHidden, setIsHidden] = useState(
        false
    );

    const lines = commands.split(
        '\n'
    );

    const maxHeight = useMemo(
        () => {

            if (isHidden) return '500px';

            return 'none';
        },
        [
            isHidden
        ]
    );

    const promptRegex = new RegExp(
        '^(' +
        // 🔹 Windows: PS C:\Users\matve>
        '(?:PS\\s+[A-Z]:\\\\[^>]+>)' +

        '|' +

        // 🔹 Linux / Mac: user@host:~$
        '(?:[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+:[~\\/\\w.-]+\\$)' +

        '|' +

        // 🔹 Cisco / network
        '(?:' +
        // hostname или [hostname]
        '\\[?[a-zA-Z0-9_.\\/-]+\\]?' +
        // (config / diagnose / etc) и возможно другие ()
        '(?:\\([^)]+\\))*' +
        // окончание: #, >, %, %%
        '[#>%]{1,2}' +
        ')' +

        '|' +

        // 🔹 Квадратные скобки вида: [1645-260-s5300-2-GigabitEthernet0/0/20] [1645-260-s5300-2]
        '(?:' +
        '(?:\\[[^\\]]+\\]\\s*)+' +   // один или несколько блоков [....] с пробелами между ними
        ')' +
        ')' +
        '\\s*(.*)$'
    );

    const handleExpand = useCallback(
        () => {

            setIsHidden(
                prev => !prev
            );
        },
        []
    );

    return (
        <pre
            style={
                {
                    maxHeight,
                    overflowY: 'auto'
                }
            }

            className={`
            ${styles['terminal-block']} 
            ${isHidden
                ? styles['terminal-block-expanded']
                : ''
            }`}
        >
            <div
                className={
                    styles['terminal-block-title']
                }
            >
                Terminal
            </div>
            {
                lines.map(
                    (
                        line,
                        i
                    ) => {

                        const match = line.match(
                            promptRegex
                        );

                        if (match) {

                            return (
                                <div
                                    key={
                                        i
                                    }
                                >
                            <span
                                style={
                                    {
                                        color: '#577B0F',
                                        userSelect: 'none'
                                    }
                                }
                            >
                                {
                                    match[1]
                                }
                            </span>
                                    <span>
                                        {
                                            match[2]
                                        }
                                    </span>
                                </div>
                            );
                        } else {

                            return <div
                                key={
                                    i
                                }
                            >
                                {
                                    line
                                }
                            </div>;
                        }
                    }
                )
            }
            <div
                className={
                    styles['terminal-block__expand']
                }

                onClick={
                    handleExpand
                }
            >
                <HideCodeSvg
                    className={
                        styles['terminal-block__expand-icon']
                    }
                />
            </div>
        </pre>
    );
};

export default TerminalBlock;

