import React from 'react';
import styles from "../../../pages/main-page/components/file-tree/FileTree.module.scss";

const FileTreeSkeleton = () => {
    return (
        <>
            <div className={`${styles['file-tree__buttons']} ${styles['skeleton-buttons']}`}>
                <div className={`${styles['file-tree__button-create']} ${styles['skeleton-button']}`} />
                <div className={`${styles['file-tree__button-block']} ${styles['skeleton-button-circle']}`} />
            </div>

            <div className={`${styles['file-tree__files']} ${styles['skeleton-files']}`}>
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} />
                <div className={styles['skeleton-file-row']} style={{ width: '80%' }} />
                <div className={styles['skeleton-file-row']} style={{ width: '60%' }} />
            </div>
        </>
    );
};

export default FileTreeSkeleton;