import React, {useRef} from 'react';

import Modal from '../modal/Modal';

import {ReactComponent as ArrowIcon} from './images/arrow.svg';
import {ReactComponent as ClipIcon} from './images/clip.svg';

import styles from './FeedbackModal.module.scss';

import {useFeedbackForm} from './hooks/useFeedbackForm';
import FeedbackTypeSelector from './components/FeedbackTypeSelector';
import ImagePreview from './components/ImagePreview';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

const FeedbackModal: React.FC<Props> = ({
                                            isOpen,
                                            onClose,
                                            userEmail
                                        }) => {
    const screenshotInputRef =
        useRef<HTMLInputElement>(null);

    const {
        type,
        setType,

        message,
        setMessage,

        image,
        preview,

        isSubmitting,
        isPreviewLoading,

        selectImage,
        removeImage,

        submit
    } = useFeedbackForm({
        userEmail,
        onSuccess: onClose
    });

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        selectImage(file);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <p className={styles.title}>
                        Send Feedback
                    </p>

                    <FeedbackTypeSelector
                        value={type}
                        onChange={setType}
                    />

                    <div className={styles.container}>
                        <textarea
                            className={`${styles.issue} ${
                                image
                                    ? styles.space
                                    : ''
                            }`}
                            placeholder="Describe your issue..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />

                        {image && (
                            <ImagePreview
                                image={image}
                                preview={preview}
                                loading={
                                    isPreviewLoading
                                }
                                onRemove={
                                    removeImage
                                }
                            />
                        )}

                        <div>
                            <ClipIcon
                                className={styles.file}
                                onClick={() =>
                                    screenshotInputRef.current?.click()
                                }
                            />
                        </div>

                        <button
                            className={`${styles.send} ${
                                isSubmitting
                                    ? styles.loading
                                    : ''
                            }`}
                            onClick={submit}
                            disabled={
                                !message.trim() ||
                                isSubmitting
                            }
                        >
                            <ArrowIcon className={styles.arrow}/>
                        </button>

                        <input
                            ref={
                                screenshotInputRef
                            }
                            type="file"
                            accept="image/*"
                            style={{
                                display: 'none'
                            }}
                            onChange={
                                handleFileChange
                            }
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FeedbackModal;