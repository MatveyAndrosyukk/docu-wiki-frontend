import {useCallback, useReducer, useRef} from 'react';

import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../../../../store';

import API_BASE_URL from '../../../../assets/config/api-config';

import {hideNotification, showNotification} from '../../../../../store/slices/notificationSlice';

import {reportReducer} from './report-form.reducer';

import {initialState, ReportActionsState, ReportReason} from './report-form.types';

interface Params {

    fileId: number;

    userEmail?: string;

    onSuccess?: () => void;

}

export default function useReportForm(
    {
        fileId,

        userEmail,

        onSuccess

    }: Params
): ReportActionsState {

    const reduxDispatch =
        useDispatch<AppDispatch>();

    const textareaRef =
        useRef<HTMLTextAreaElement>(
            null
        );

    const [
        state,

        dispatch
    ] = useReducer(
        reportReducer,

        {

            ...initialState,

            textareaRef

        }
    );

    const setReason = useCallback(
        (
            reason: ReportReason
        ) => {

            dispatch(
                {

                    type: 'SET_REASON',

                    payload: reason

                }
            );

        },

        []
    );

    const setDescription = useCallback(
        (
            value: string
        ) => {

            dispatch(
                {

                    type: 'SET_DESCRIPTION',

                    payload: value

                }
            );

        },

        []
    );

    const isOtherReason = useCallback(
        () => {

            return state.reason === 'Other';

        },

        [

            state.reason

        ]
    );

    const reset = useCallback(
        () => {

            dispatch(
                {

                    type: 'RESET'

                }
            );

        },

        []
    );

    const submit = useCallback(
        async () => {

            if (!state.reason) {

                return;

            }

            if (

                isOtherReason() &&

                !state.description.trim()

            ) {

                return;

            }

            const metadata = {

                browser:
                navigator.userAgent,

                page:
                window.location.href,

                viewport:
                    `${window.innerWidth}x${window.innerHeight}`,

                time:
                    new Date().toISOString(),

                userEmail

            };

            try {

                dispatch(
                    {

                        type:
                            'SET_IS_SUBMITTING',

                        payload:
                            true

                    }
                );

                const payload = {

                    fileId,

                    reason:
                    state.reason,

                    description:
                        state.description.trim(),

                    metadata:
                        JSON.stringify(
                            metadata
                        )

                };

                console.log(
                    'REPORT PAYLOAD:',
                    payload
                );

                console.log(
                    'REPORT JSON:',
                    JSON.stringify(
                        payload
                    )
                );

                const response =
                    await fetch(
                        `${API_BASE_URL}/reports`,

                        {

                            method: 'POST',

                            headers: {

                                'Content-Type':
                                    'application/json'

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        'Failed to send report'
                    );

                }

                reduxDispatch(
                    showNotification(
                        'Report submitted successfully'
                    )
                );

                setTimeout(
                    () => {

                        reduxDispatch(
                            hideNotification()
                        );

                    },

                    3000
                );

                reset();

                onSuccess?.();

            } finally {

                dispatch(
                    {

                        type:
                            'SET_IS_SUBMITTING',

                        payload:
                            false

                    }
                );

            }

        },

        [

            state.reason,

            state.description,

            fileId,

            userEmail,

            onSuccess,

            reduxDispatch,

            reset,

            isOtherReason

        ]
    );

    return {

        state,

        actions: {

            setReason,

            setDescription,

            isOtherReason,

            submit,

            reset

        }

    };

}