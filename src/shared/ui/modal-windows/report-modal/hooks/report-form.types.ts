import {RefObject} from 'react';

export type ReportReason =
    'Spam or advertising' |

    'Fraud or scam' |

    'Malicious code or virus' |

    'Personal data leak' |

    'Copyright infringement' |

    'Illegal content' |

    'Harassment, threats, or bullying' |

    'Other';

export type ReportState = {

    reason: ReportReason | null;

    description: string;

    isSubmitting: boolean;

    textareaRef?: RefObject<
        HTMLTextAreaElement | null
    >;

};

export type ReportActions = {

    setReason(
        reason: ReportReason
    ): void;

    setDescription(
        value: string
    ): void;

    isOtherReason(): boolean;

    submit(): Promise<void>;

    reset(): void;

};

export type ReportActionsState = {

    state: ReportState;

    actions: ReportActions;

};

export const initialState: ReportState = {

    reason: null,

    description: '',

    isSubmitting: false

};