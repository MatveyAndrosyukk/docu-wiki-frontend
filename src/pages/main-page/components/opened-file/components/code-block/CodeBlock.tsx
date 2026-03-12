import React, {FC, useCallback, useMemo, useState} from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.scss';
import {ReactComponent as ExpandCodeSvg} from './images/code-block-expand-code.svg';
import {getLanguage} from "../../../../../../utils/functions/getLanguage";
import {useDebounce} from "../../../../../../utils/hooks/useDebounce";

interface CodeBlockProps {
    code: string;
    isFileTreeOpened: boolean;
}

const CodeBlock: FC<CodeBlockProps> = (
    {
        code,
        isFileTreeOpened
    }) => {
    const [isCodeExpanded, setIsCodeExpanded] = useState(false);

    const debouncedCode = useDebounce(code, 300);

    const detectedLanguage = useMemo(() => getLanguage(debouncedCode), [debouncedCode]);

    const maxHeight = isCodeExpanded
        ? 'none'
        : (isFileTreeOpened ? '21em' : '22em');

    const handleExpandCode = useCallback(() => {
        setIsCodeExpanded(prev => !prev);
    }, []);

    return (
        <div
            style={{maxHeight}}
            className={`${styles['code-block']}`}>
            <div className={`${styles['code-block-wrapper']} ${isCodeExpanded ? styles['code-block-expanded'] : ''}`}>
                <SyntaxHighlighter
                    language={detectedLanguage}
                    style={darcula}
                    showLineNumbers={false}
                    wrapLines={true}
                    PreTag="pre"
                    CodeTag="code"
                >
                    {code}
                </SyntaxHighlighter>
            </div>
            <div className={styles['code-block__expand']}>
                <ExpandCodeSvg className={styles['code-block__expand-icon']} onClick={handleExpandCode}/>
            </div>
        </div>
    );
};

export default CodeBlock;