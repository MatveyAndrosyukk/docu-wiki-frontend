import {
    initialState,
    ReportReason,
    ReportState
} from './report-form.types';

export type ReportAction =
    |
    {
        type: 'SET_REASON';

        payload: ReportReason;
    }
    |
    {
        type: 'SET_DESCRIPTION';

        payload: string;
    }
    |
    {
        type: 'SET_IS_SUBMITTING';

        payload: boolean;
    }
    |
    {
        type: 'RESET';
    };

export function reportReducer(
    state: ReportState,

    action: ReportAction
): ReportState {

    switch (action.type) {

        case 'SET_REASON':

            return {

                ...state,

                reason: action.payload

            };

        case 'SET_DESCRIPTION':

            return {

                ...state,

                description: action.payload

            };

        case 'SET_IS_SUBMITTING':

            return {

                ...state,

                isSubmitting: action.payload

            };

        case 'RESET':

            return {

                ...initialState

            };

        default:

            return state;

    }

}