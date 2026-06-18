import React from "react";
import styles from "../../../OpenedFile.module.scss";
import { PendingImages } from "../types";

export default function handleImageTag(
    match: RegExpExecArray,
    index: number,
    onImageClick: (url: string) => void,
    pendingImages: PendingImages
) {
    const fileName = match[1].split(':')[0];

    const imageUrl = `https://i.ibb.co/${fileName}`;

    const imageState = pendingImages[fileName];

    if (imageState?.status === 'pending') {
        return (
            <div key={index} className={styles.imagePlaceholder}>
                <div className={styles.loader}/>
                <span>Image is loading…</span>
            </div>
        );
    }

    if (imageState?.status === 'error') {
        return (
            <div key={index} className={styles.imageError}>
                ❌ Failed to load image
            </div>
        );
    }

    return (
        <img
            key={index}
            src={imageUrl}
            alt={fileName}
            loading="lazy"
            onClick={() => onImageClick(imageUrl)}
        />
    );
}