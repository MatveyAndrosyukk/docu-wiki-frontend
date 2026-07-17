import React from 'react';
import styles from './FeedbackButton.module.scss';

interface Props {
    onClick: () => void;
}

const FeedbackButton: React.FC<Props> = (
    {
        onClick
    }
) => {

    return (

        <button
            className={
                styles.feedbackButton
            }

            onClick={
                onClick
            }
        >
            🗪
        </button>
    );
};

export default FeedbackButton;