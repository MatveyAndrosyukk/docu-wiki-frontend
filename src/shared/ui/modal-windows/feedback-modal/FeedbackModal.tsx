import React, {useRef, useState} from 'react';
import Modal from '../modal/Modal';
import {ReactComponent as ArrowIcon} from './images/arrow.svg'
import {ReactComponent as ClipIcon} from './images/clip.svg'

import styles from './FeedbackModal.module.scss';
import API_BASE_URL from "../../../assets/config/api-config";
import {AppDispatch} from "../../../../store";
import {hideNotification, showNotification} from "../../../../store/slices/notificationSlice";
import {useDispatch} from "react-redux";
import {formatFileSize} from "../../../lib/utils/formatFileSize";
import {formatFileName} from "../../../lib/utils/formatFileName";

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

    const [type, setType] = useState<'bug' | 'suggestion'>('bug');

    const dispatch = useDispatch<AppDispatch>();

    const screenshotInputRef = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState('');

    const [image, setImage] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    const handleSubmit = async () => {

        const formData = new FormData();

        formData.append('type', type);
        formData.append('message', message);

        formData.append(
            'metadata',
            JSON.stringify({
                browser: navigator.userAgent,
                page: window.location.href,
                viewport:
                    `${window.innerWidth}x${window.innerHeight}`,
                time: new Date().toISOString(),
                userEmail
            })
        );

        if (image) {
            formData.append('screenshot', image);
        }

        await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            body: formData
        });

        dispatch(
            showNotification(
                'Feedback sent successfully 🚀'
            )
        );

        setTimeout(() => {
            dispatch(hideNotification());
        }, 3000);

        setMessage('');
        setImage(null);

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className={styles.overlay}>
                <div
                    className={styles.modal}>
                    <p
                        className={styles.title}
                    >
                        Send Feedback
                    </p>
                    <div
                        className={styles.types}>
                        <label
                            className={styles.radio}
                        >
                            <input
                                type="radio"
                                name="feedback-type"
                                checked={type === 'bug'}
                                onChange={() =>
                                    setType('bug')
                                }/>
                            Report a bug
                        </label>
                        <label
                            className={styles.radio}
                        >
                            <input
                                type="radio"
                                name="feedback-type"
                                checked={type === 'suggestion'}
                                onChange={() =>
                                    setType('suggestion')
                                }/>
                            Suggest improvement
                        </label>
                    </div>

                    <div className={styles.container}>
                        <textarea
                            className={`${styles.issue} ${image ? styles.space : ''}`}
                            placeholder="Describe your issue..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }/>

                        {image && (
                            <div className={styles.loaded}>

                                <div className={styles.loadedImg}>

                                    {isPreviewLoading ? (
                                        <div className={styles.loader}/>
                                    ) : (
                                        <img
                                            src={preview || ''}
                                            alt={image.name}/>
                                    )}
                                </div>
                                <div className={styles.loadedInfo}>
                                    <span title={image.name}>
                                        {formatFileName(image.name)}
                                    </span>
                                    <span>
                                        {formatFileSize(image.size)}
                                    </span>
                                </div>
                                <span
                                    className={styles.loadedClose}
                                    onClick={() => {
                                        setImage(null);
                                        setPreview(null);
                                    }}
                                >
            ✕
        </span>

                            </div>
                        )}

                        <div>
                            <ClipIcon
                                className={styles.file}
                                onClick={() => screenshotInputRef.current?.click()}/>
                        </div>
                        <button
                            className={styles.send}
                            onClick={handleSubmit}
                            disabled={!message.trim()}
                        >
                            <ArrowIcon/>
                        </button>
                        <input
                            style={{display: 'none'}}
                            ref={screenshotInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {

                                const file = e.target.files?.[0];

                                if (!file) {
                                    return;
                                }

                                setImage(file);

                                setIsPreviewLoading(true);

                                const reader = new FileReader();

                                reader.onload = () => {
                                    setPreview(reader.result as string);
                                    setIsPreviewLoading(false);
                                };

                                reader.onerror = () => {
                                    setIsPreviewLoading(false);
                                };

                                reader.readAsDataURL(file);
                            }}/>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FeedbackModal;