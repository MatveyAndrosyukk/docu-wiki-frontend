import React, {FC, useCallback, useMemo, useState} from 'react';
import styles from './TerminalBlock.module.scss'
import {ReactComponent as ExpandCodeSvg} from '../code-block/images/code-block-expand-code.svg';

interface TerminalBlockProps {
    commands: string;
}

const TerminalBlock: FC<TerminalBlockProps> = ({commands}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const lines = commands.split('\n');

    const maxHeight = useMemo(() => {

        if (isExpanded) return '500px';

        return 'none';
    }, [isExpanded]);

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
        '\\[?[a-zA-Z0-9_.-]+\\]?' +
        // (config / diagnose / etc) и возможно другие ()
        '(?:\\([^)]+\\))*' +  // <- любые скобки подряд, включая (config-if-adsl-0/5)
        // окончание: #, >, %, %%
        '[#>%]{1,2}' +        // <- обязательно #, >, % или %%
        ')' +
        ')' +
        '\\s*(.*)$'
    );

    const handleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <pre
            style={{maxHeight, overflowY: 'auto'}}
            className={`${styles['terminal-block']} ${isExpanded ? styles['terminal-block-expanded'] : ''}`}
        >
            <div className={styles['terminal-block-title']}>Terminal</div>
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
            <div className={styles['terminal-block__expand']} onClick={handleExpand}>
                <ExpandCodeSvg className={styles['terminal-block__expand-icon']}/>
            </div>
        </pre>
    );
};

export default TerminalBlock;

