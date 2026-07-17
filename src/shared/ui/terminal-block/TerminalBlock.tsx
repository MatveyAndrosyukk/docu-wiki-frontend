import React, {FC, useCallback, useState} from 'react';
import styles from './TerminalBlock.module.scss'
import {ReactComponent as HideCodeSvg} from '../code-block/images/hide-code.svg';
import {ReactComponent as ShowCodeSvg} from '../code-block/images/show-code.svg';

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

    const HideIcon = isHidden
        ? ShowCodeSvg
        : HideCodeSvg;

    const hide = useCallback(
        () => {

            setIsHidden(
                prev => !prev
            );
        },
        []
    );


    return (
        <div
            className={
                styles['terminal-block']
            }
        >
            <div
                className={
                    styles['terminal-block__header']
                }
            >
                <div
                    className={
                        styles['terminal-block__title']
                    }
                >
                    Terminal
                </div>

                <button
                    className={
                        styles['terminal-block__action']
                    }

                    onClick={
                        hide
                    }
                >
                    <HideIcon
                        className={
                            styles['terminal-block__action-icon']
                        }
                    />
                </button>
            </div>


            <div
                className={`
                ${styles['terminal-block__content']}
                ${isHidden
                    ? styles['terminal-block__content-hidden']
                    : ''
                }
            `}
            >
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
                                        key={i}
                                    >
                                    <span
                                        style={{
                                            color: '#577B0F',
                                            userSelect: 'none'
                                        }}
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
                            }

                            return (
                                <div
                                    key={i}
                                >
                                    {
                                        line
                                    }
                                </div>
                            );
                        }
                    )
                }
            </div>
        </div>
    );
};

export default TerminalBlock;

