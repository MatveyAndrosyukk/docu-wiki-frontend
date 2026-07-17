import React, {FC, useCallback, useMemo, useState} from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.scss';
import {ReactComponent as HideCodeSvg} from './images/hide-code.svg';
import {ReactComponent as ShowCodeSvg} from './images/show-code.svg';
import {ReactComponent as CopyCodeSvg} from './images/copy-code.svg';
import {ReactComponent as CheckSvg} from './images/check.svg'; // или любая галочка
import {getLanguage} from "../../lib/utils/getLanguage";
import {useDebouncedValue} from "../../lib/hooks/useDebouncedValue";

interface Props {
    code: string;

    fileName?: string;
}

const CodeBlock: FC<Props> = (
    {
        code,
        fileName,
    }) => {
    const [isCodeHidden, setIsCodeHidden] = useState(
        false
    );

    const [isCopied, setIsCopied] = useState(
        false
    );

    const debouncedCode = useDebouncedValue(
        code,
        300
    );

    const detectedLanguage = useMemo(
        () => getLanguage(
            debouncedCode
        ),
        [
            debouncedCode
        ]
    );

    const maxHeight = isCodeHidden ? '35px' : 'none';

    const HideIcon = isCodeHidden
        ? ShowCodeSvg
        : HideCodeSvg;

    const CopyIcon = isCopied
        ? CheckSvg
        : CopyCodeSvg;

    const hideCode = useCallback(
        () => {

            setIsCodeHidden(
                prev => !prev
            );
        },
        []
    );

    const copyCode = useCallback(async () => {
        await navigator.clipboard.writeText(code);

        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    }, [code]);

    return (
        <div
            style={
                {
                    maxHeight
                }
            }
            className={
                `${styles['code-block']}`
            }
        >
            <div
                className={
                    styles['code-block__header']
                }
            >
                <div
                    className={
                        styles['code-block__file-name']
                    }
                >
                    {fileName?.trim() || 'file'}
                </div>

                <div
                    className={
                        styles['code-block__actions']
                    }
                >
                    <button
                        className={
                            styles['code-block__action']
                        }
                        onClick={
                            copyCode
                        }
                    >
                        <CopyIcon
                            className={
                                styles['code-block__action-icon']
                            }
                        />
                    </button>
                    <button
                        className={
                            styles['code-block__action']
                        }
                        onClick={
                            hideCode
                        }
                    >
                        <HideIcon
                            className={
                                styles['code-block__action-icon']
                            }
                        />
                    </button>
                </div>
            </div>
            <div
                className={`
                ${styles['code-block-wrapper']} 
                ${isCodeHidden
                    ? styles['code-block-expanded']
                    : ''}
                    `}
            >
                <SyntaxHighlighter
                    language={
                        detectedLanguage
                    }

                    style={
                        darcula
                    }

                    showLineNumbers={
                        false
                    }

                    wrapLines={
                        true
                    }

                    PreTag="pre"

                    CodeTag="code"
                >
                    {
                        code
                    }
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;