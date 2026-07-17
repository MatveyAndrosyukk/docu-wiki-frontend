import React from 'react';

import styles from '../FeedbackModal.module.scss';
import {formatFileName} from "../../../../lib/utils/formatFileName";
import {formatFileSize} from "../../../../lib/utils/formatFileSize";

interface Props {
    image: File;

    preview: string | null;

    loading: boolean;

    onRemove: () => void;
}

const ImagePreview: React.FC<Props> = (
    {
        image,
        preview,
        loading,
        onRemove
    }) => {
    return (

        <div
            className={
                styles.loaded
            }
        >
            <div
                className={
                    styles.loadedImg
                }
            >
                {
                    loading ? (

                        <div
                            className={
                                styles.loader
                            }
                        />
                    ) : (

                        <img
                            src={
                                preview || ''
                            }
                            alt={
                                image.name
                            }
                        />
                    )
                }
            </div>
            <div
                className={
                    styles.loadedInfo
                }
            >
                <span
                    title={
                        image.name
                    }
                >
                    {
                        formatFileName(
                            image.name
                        )
                    }
                </span>
                <span>
                    {
                        formatFileSize(
                            image.size
                        )
                    }
                </span>
            </div>
            <span
                className={
                    styles.loadedClose
                }

                onClick={
                    onRemove
                }
            >
                ✕
            </span>
        </div>
    );
};

export default ImagePreview;