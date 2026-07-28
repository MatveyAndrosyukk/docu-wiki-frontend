import React, {FC, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './PaymentPage.module.scss';

const PaymentSuccessPage: FC = () => {

    const navigate = useNavigate();

    useEffect(
        () => {

            const timer = setTimeout(
                () => {
                    navigate('/');
                },
                5000
            );

            return () => {
                clearTimeout(timer);
            };
        },
        [
            navigate
        ]
    );

    return (
        <main
            className={
                styles['payment-page']
            }
        >
            <section
                className={`
                    ${styles['payment-card']}
                    ${styles['payment-card--success']}
                `}
            >
                <div
                    className={
                        styles['payment-icon']
                    }
                >
                    ✓
                </div>

                <h1
                    className={
                        styles['payment-title']
                    }
                >
                    Payment successful!
                </h1>

                <p
                    className={
                        styles['payment-description']
                    }
                >
                    Thank you for upgrading to Premium.
                    Your subscription is being activated.
                </p>

                <div
                    className={
                        styles['payment-status']
                    }
                >
                    <span
                        className={
                            styles['payment-status-dot']
                        }
                    />

                    Waiting for payment confirmation...
                </div>

                <p
                    className={
                        styles['payment-redirect']
                    }
                >
                    You will be redirected to the main page shortly.
                </p>

                <button
                    className={
                        styles['payment-button']
                    }

                    onClick={
                        () => navigate('/')
                    }
                >
                    Go to main page
                </button>
            </section>
        </main>
    );
};

export default PaymentSuccessPage;