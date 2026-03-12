import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";

export const useEditorTextarea = (
    initialContent: string,
    setIsFileContentChanged: (v: boolean) => void
) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [textareaContent, setTextareaContent] = useState(initialContent);

    useEffect(() => {
        setTextareaContent(initialContent);
        setIsFileContentChanged(false);
    }, [initialContent, setIsFileContentChanged]);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleChangeTextareaContent = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            setTextareaContent(value);
            setIsFileContentChanged(true);
        },
        [setIsFileContentChanged]
    );

    const pasteTag = useCallback((tag: string) => {

        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;

        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);

        const newText = before + tag + after;

        setTextareaContent(newText);
        setIsFileContentChanged(true);

    }, [setIsFileContentChanged]);

    const wrapSelection = useCallback((tagStart: string, tagEnd: string) => {

        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;

        const before = value.substring(0, selectionStart);
        const selected = value.substring(selectionStart, selectionEnd);
        const after = value.substring(selectionEnd);

        const newText = before + tagStart + selected + tagEnd + after;

        setTextareaContent(newText);
        setIsFileContentChanged(true);

    }, [setIsFileContentChanged]);

    return {
        textareaRef,
        textareaContent,
        setTextareaContent,
        pasteTag,
        wrapSelection,
        handleChangeTextareaContent
    };
};