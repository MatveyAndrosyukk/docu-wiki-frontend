import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './PaymentPage.module.scss';

const PaymentCancelPage: FC = () => {

    const navigate = useNavigate();

    return (
        <main
            className={
                styles['payment-page']
            }
        >
            <section
                className={`
                    ${styles['payment-card']}
                    ${styles['payment-card--cancel']}
                `}
            >
                <div
                    className={
                        styles['payment-icon']
                    }
                >
                    ×
                </div>

                <h1
                    className={
                        styles['payment-title']
                    }
                >
                    Payment cancelled
                </h1>

                <p
                    className={
                        styles['payment-description']
                    }
                >
                    Your payment was cancelled or
                    was not completed.
                </p>

                <p
                    className={
                        styles['payment-redirect']
                    }
                >
                    No money has been charged.
                </p>

                <div
                    className={
                        styles['payment-actions']
                    }
                >
                    <button
                        className={
                            styles['payment-button']
                        }

                        onClick={
                            () => navigate('/')
                        }
                    >
                        Back to main page
                    </button>

                    <button
                        className={
                            styles['payment-button-secondary']
                        }

                        onClick={
                            () => navigate('/')
                        }
                    >
                        Try again later
                    </button>
                </div>
            </section>
        </main>
    );
};

export default PaymentCancelPage;