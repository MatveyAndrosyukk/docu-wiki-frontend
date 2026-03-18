import React, {FC} from 'react';
import styles from './TerminalBlock.module.scss'

interface TerminalBlockProps {
    commands: string;
}

const TerminalBlock: FC<TerminalBlockProps> = ({commands}) => {
    const lines = commands.split('\n');
    const promptRegex = new RegExp(
        '^(' +
        // 🔹 Windows: PS C:\Users\matve>
        '(?:PS\\s+[A-Z]:\\\\[^>]+>)' +

        '|' +

        // 🔹 Linux / Mac: user@host:~$
        '(?:[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+:[~\\/\\w.-]+\\$)' +

        '|' +

        // 🔹 Cisco / network:
        // A4BRST-A002UL01(config)
        // A4BRST-A002UL01#
        // A4BRST-A002UL01(config-if)
        '(?:[a-zA-Z0-9_.-]+(?:\\([a-zA-Z0-9\\-]+\\))?[#>])' +

        ')' +
        '\\s?(.*)$'
    );

    return (
        <pre className={styles['terminal-block']}>
            <div className={styles['terminal-block-title']}>
                Terminal
            </div>
            {lines.map((line, i) => {
                const match = line.match(promptRegex);
                if (match) {
                    return (
                        <div key={i}>
                            <span style={{color: '#577B0F'}}>{match[1]} </span>
                            <span>{match[2]}</span>
                        </div>
                    );
                } else {
                    return <div key={i}>{line}</div>;
                }
            })}
    </pre>
    );
};

export default TerminalBlock;

