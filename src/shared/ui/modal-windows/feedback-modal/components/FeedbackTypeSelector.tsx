import React from 'react';

import styles from '../FeedbackModal.module.scss';

interface Props {
    value: 'bug' | 'suggestion';

    onChange:
        (
            value: 'bug' | 'suggestion'
        ) => void;
}

const FeedbackTypeSelector: React.FC<Props> = (
    {
        value,
        onChange
    }) => {
    return (
        <div
            className={
                styles.types
            }
        >
            <label
                className={
                    styles.radio
                }
            >
                <input
                    type="radio"

                    name="feedback-type"

                    checked={
                        value === 'bug'
                    }

                    onChange={
                        () => onChange('bug')
                    }
                />
                Report a bug
            </label>

            <label
                className={
                    styles.radio
                }
            >
                <input
                    type="radio"

                    name="feedback-type"

                    checked={
                        value === 'suggestion'
                    }

                    onChange={
                        () => onChange(
                            'suggestion'
                        )
                    }
                />
                Suggest improvement
            </label>
        </div>
    );
};

export default FeedbackTypeSelector;