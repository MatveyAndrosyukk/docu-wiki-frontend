import React, {FC} from 'react';
import styles from './TerminalBlock.module.scss'
import useCheckIsMobile from "../../lib/hooks/useCheckIsMobile";

interface TerminalBlockProps {
    commands: string;
}

const TerminalBlock: FC<TerminalBlockProps> = ({commands}) => {
    const lines = commands.split('\n');
    const isMobile = useCheckIsMobile();

    const maxHeight = () =>{
        return isMobile ? 'none' : '500px';
    }

    const promptRegex = new RegExp(
        '^(' +

        // 🔹 Windows: PS C:\Users\matve>
        '(?:PS\\s+[A-Z]:\\\\[^>]+>)' +

        '|' +

        // 🔹 Linux / Mac: user@host:~$
        '(?:[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+:[~\\/\\w.-]+\\$)' +

        '|' +

        // 🔹 Cisco / network (расширенный)
        '(?:' +
        // hostname или [hostname]
        '\\[?[a-zA-Z0-9_.-]+\\]?' +

        // (config / diagnose / etc)
        '(?:\\([a-zA-Z0-9\\-]+\\))?' +

        // окончание: #, >, %, %%
        '(?:[#>%]{1,2})?' +
        ')' +

        ')' +
        '\\s?(.*)$'
    );

    return (
        <pre style={{maxHeight: maxHeight()}} className={styles['terminal-block']}>
            <div className={styles['terminal-block-title']}>
                Terminal
            </div>
            {lines.map((line, i) => {
                const match = line.match(promptRegex);
                if (match) {
                    return (
                        <div key={i}>
                            <span style={{color: '#577B0F', userSelect: 'none'}}>{match[1]} </span>
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

