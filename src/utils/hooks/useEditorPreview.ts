import {ReactNode, useEffect, useState} from "react";

export const useEditorPreview = (
    content: string,
    parseFileTextToHTML: any,
    onImageClick: any,
    isFileTreeOpened: boolean
) => {

    const [previewContent, setPreviewContent] = useState<ReactNode>([]);

    useEffect(() => {

        setPreviewContent(
            parseFileTextToHTML(
                content,
                onImageClick,
                isFileTreeOpened
            )
        );

    }, [content, onImageClick, parseFileTextToHTML, isFileTreeOpened]);

    return previewContent;
};