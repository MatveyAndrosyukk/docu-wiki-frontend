import React from "react";
import styles from "../../../OpenedFile.module.scss";

export default function handleLinkTag(
    href: string,
    index: number,
    children: React.ReactNode[]
) {
    return (
        <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={
                styles['opened-file__content-link']
            }
        >
            {children}
        </a>
    );
}