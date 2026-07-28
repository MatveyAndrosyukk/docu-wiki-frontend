import React, {FC, useState} from 'react';
import Modal from '../modal/Modal';
import styles from './PremiumModal.module.scss';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {AppDispatch} from '../../../../store';
import {useDispatch} from 'react-redux';
import {createPayment} from "../../../../store/thunks/payments/createPayment";

const PremiumModal: FC = () => {

    const {
        premiumHandler
    } = useAppContext();

    const reduxDispatch = useDispatch<AppDispatch>();

    const [
        isPaymentLoading,
        setIsPaymentLoading
    ] = useState(false);

    const [
        paymentError,
        setPaymentError
    ] = useState<string | null>(null);

    const handleUpgrade = async () => {

        if (isPaymentLoading) {
            return;
        }

        setIsPaymentLoading(true);

        setPaymentError(null);

        try {

            const result = await reduxDispatch(
                createPayment()
            ).unwrap();

            window.location.href =
                result.invoiceUrl;

        } catch (error) {

            console.error(
                'Payment creation failed:',
                error
            );

            setPaymentError(
                'Failed to create payment. Please try again.'
            );

            setIsPaymentLoading(false);
        }
    };

    const closeModal = () => {

        if (isPaymentLoading) {
            return;
        }

        premiumHandler.setIsPremiumModalOpen(false);

        setPaymentError(null);
    };

    return (
        <Modal
            isOpen={
                premiumHandler.isPremiumModalOpen
            }

            onClose={
                closeModal
            }
        >
            <div
                className={
                    styles['premium-modal']
                }
            >
                <div
                    className={
                        styles['premium-modal__title']
                    }
                >
                    Upgrade to Premium
                </div>

                <div
                    className={
                        styles['premium-modal__subtitle']
                    }
                >
                    Unlock private workspaces, collaboration and unlimited files.
                </div>

                <div
                    className={
                        styles['premium-modal__plans']
                    }
                >
                    <div
                        className={
                            styles['premium-modal__plan']
                        }
                    >
                        <div
                            className={
                                styles['premium-modal__plan-name']
                            }
                        >
                            Free
                        </div>

                        <div
                            className={
                                styles['premium-modal__features']
                            }
                        >
                            <div>✓ 20 files</div>
                            <div>✓ Public workspace</div>
                        </div>

                        <button
                            className={
                                styles['premium-modal__current']
                            }
                        >
                            Current Plan
                        </button>
                    </div>

                    <div
                        className={`
                            ${styles['premium-modal__plan']} 
                            ${styles['premium-modal__plan--premium']}
                        `}
                    >
                        <div
                            className={
                                styles['premium-modal__badge']
                            }
                        >
                            MOST POPULAR
                        </div>

                        <div
                            className={
                                styles['premium-modal__plan-name']
                            }
                        >
                            Premium ✨
                        </div>

                        <div
                            className={
                                styles['premium-modal__features']
                            }
                        >
                            <div>✓ Unlimited files</div>

                            <div>
                                ✓ Block files from other users
                            </div>

                            <div>
                                ✓ Add editors to your workspace
                            </div>
                        </div>

                        {
                            paymentError && (
                                <div
                                    className={
                                        styles['premium-modal__error']
                                    }
                                >
                                    {paymentError}
                                </div>
                            )
                        }

                        <button
                            onClick={
                                handleUpgrade
                            }

                            disabled={
                                isPaymentLoading
                            }

                            className={`
                                ${styles['premium-modal__upgrade']}
                                ${
                                isPaymentLoading
                                    ? styles['premium-modal__upgrade--loading']
                                    : ''
                            }
                            `}
                        >
                            {
                                isPaymentLoading
                                    ? 'Creating payment...'
                                    : 'Upgrade to Premium'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PremiumModal;