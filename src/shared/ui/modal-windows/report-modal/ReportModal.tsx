import React, {FC} from 'react';

import Modal from '../modal/Modal';

import {ReactComponent as ArrowIcon} from './images/arrow.svg';

import styles from './ReportModal.module.scss';
import {ReportReason} from "./hooks/report-form.types";
import useReportForm from "./hooks/useReportForm";

interface Props {

    isOpen: boolean;

    onClose: () => void;

    fileId: number;

    userEmail?: string;

}

const reportReasons: ReportReason[] = [

    'Spam or advertising',

    'Fraud or scam',

    'Malicious code or virus',

    'Personal data leak',

    'Copyright infringement',

    'Illegal content',

    'Harassment, threats, or bullying',

    'Other'

];

const ReportModal: FC<Props> = (
    {
        isOpen,

        onClose,

        fileId,

        userEmail

    }
) => {

    const {
        state,

        actions

    } = useReportForm(
        {

            fileId,

            userEmail,

            onSuccess: onClose

        }
    );

    return (

        <Modal

            isOpen={
                isOpen
            }

            onClose={
                onClose
            }

        >

            <div
                className={
                    styles.overlay
                }

                onClick={
                    onClose
                }
            >

                <div
                    className={
                        styles.modal
                    }

                    onClick={
                        e => e.stopPropagation()
                    }
                >
                    <button
                        type="button"

                        className={
                            styles.close
                        }

                        onClick={
                            onClose
                        }

                        aria-label="Close modal"
                    >
                        ×
                    </button>

                    <p
                        className={
                            styles.title
                        }
                    >
                        Report File
                    </p>

                    <p
                        className={
                            styles.subtitle
                        }
                    >
                        Why are you reporting this file?
                    </p>

                    <div
                        className={
                            styles.reasons
                        }
                    >

                        {
                            reportReasons.map(
                                reason => (

                                    <button

                                        key={
                                            reason
                                        }

                                        type="button"

                                        className={`
                                            ${styles.reason}

                                            ${
                                            state.reason === reason
                                                ? styles.selected
                                                : ''
                                        }
                                        `}

                                        onClick={

                                            () =>
                                                actions.setReason(
                                                    reason
                                                )

                                        }

                                    >

                                        <span
                                            className={
                                                styles.radio
                                            }
                                        >

                                            {
                                                state.reason === reason &&

                                                <span
                                                    className={
                                                        styles.radioDot
                                                    }
                                                />
                                            }

                                        </span>

                                        <span>
                                            {
                                                reason
                                            }
                                        </span>

                                    </button>

                                )
                            )

                        }

                    </div>

                    <div
                        className={`
                            ${styles.descriptionWrapper}

                            ${
                            actions.isOtherReason()
                                ? styles.descriptionWrapperVisible
                                : ''
                        }
                        `}
                    >

                        <textarea

                            ref={
                                state.textareaRef
                            }

                            value={
                                state.description
                            }

                            onChange={

                                e => actions.setDescription(
                                    e.currentTarget.value
                                )

                            }

                            placeholder={
                                'Tell us more...'
                            }

                            maxLength={
                                1000
                            }

                            className={
                                styles.description
                            }

                        />

                    </div>

                    <button

                        type="button"

                        className={`
                            ${styles.submit}

                            ${
                            state.isSubmitting
                                ? styles.loading
                                : ''
                        }
                        `}

                        disabled={

                            !state.reason ||

                            (
                                actions.isOtherReason() &&

                                !state.description.trim()
                            ) ||

                            state.isSubmitting

                        }

                        onClick={
                            actions.submit
                        }

                    >

                        {
                            state.isSubmitting
                                ? 'Submitting...'
                                : 'Submit Report'
                        }

                        <ArrowIcon
                            className={
                                styles.arrow
                            }
                        />

                    </button>

                </div>

            </div>

        </Modal>

    );

};

export default ReportModal;