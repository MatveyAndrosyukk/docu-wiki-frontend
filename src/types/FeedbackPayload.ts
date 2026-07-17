export interface FeedbackPayload {
    type: 'bug' | 'suggestion';

    message: string;

    metadata: {
        appVersion: string;

        browser: string;

        os: string;

        page: string;

        viewport: string;

        time: string;

        userEmail?: string;
    };
}