import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from "../../../../../store";
import API_BASE_URL from "../../../../assets/config/api-config";
import {hideNotification, showNotification} from "../../../../../store/slices/notificationSlice";

interface Params {
    userEmail?: string;
    onSuccess?: () => void;
}

export const useFeedbackForm = ({
                                    userEmail,
                                    onSuccess
                                }: Params) => {
    const dispatch = useDispatch<AppDispatch>();

    const [type, setType] =
        useState<'bug' | 'suggestion'>('bug');

    const [message, setMessage] = useState('');

    const [image, setImage] = useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);

    const [isPreviewLoading, setIsPreviewLoading] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const selectImage = (file: File) => {
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
    };

    const reset = () => {
        setMessage('');
        removeImage();
        setType('bug');
    };

    const submit = async () => {
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

        try {
            setIsSubmitting(true);

            await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                body: formData
            });

            dispatch(
                showNotification(
                    'Feedback sent successfully'
                )
            );

            setTimeout(() => {
                dispatch(hideNotification());
            }, 3000);

            reset();

            onSuccess?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
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
    };
};