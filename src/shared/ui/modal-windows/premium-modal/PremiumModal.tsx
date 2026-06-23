import React, {FC} from 'react';
import Modal from '../modal/Modal';
import styles from './PremiumModal.module.scss';
import {useAppContext} from "../../../lib/hooks/useAppContext";

const PremiumModal: FC = () => {
    const {premiumState} = useAppContext();

    const {
        isPremiumModalOpen,
        setIsPremiumModalOpen,
    } = premiumState;

    const handleUpgrade = () => {
        console.log('OPEN STRIPE');
    };

    const closeModal = () => {
        setIsPremiumModalOpen(false);
    }

    return (
        <Modal
            isOpen={isPremiumModalOpen}
            onClose={closeModal}
        >
            <div className={styles['premium-modal']}>

                <div className={styles['premium-modal__title']}>
                    Upgrade to Premium
                </div>

                <div className={styles['premium-modal__subtitle']}>
                    Unlock private workspaces, collaboration and unlimited files.
                </div>

                <div className={styles['premium-modal__plans']}>

                    <div className={styles['premium-modal__plan']}>

                        <div className={styles['premium-modal__plan-name']}>
                            Free
                        </div>

                        <div className={styles['premium-modal__features']}>
                            <div>✓ 20 files</div>
                            <div>✓ Public workspace</div>
                        </div>

                        <button
                            className={styles['premium-modal__current']}
                        >
                            Current Plan
                        </button>

                    </div>

                    <div
                        className={`${styles['premium-modal__plan']} ${styles['premium-modal__plan--premium']}`}
                    >

                        <div className={styles['premium-modal__badge']}>
                            MOST POPULAR
                        </div>

                        <div className={styles['premium-modal__plan-name']}>
                            Premium ✨
                        </div>

                        <div className={styles['premium-modal__features']}>

                            <div>✓ Unlimited files</div>

                            <div>
                                ✓ Block files from other users
                            </div>

                            <div>
                                ✓ Add editors to your workspace
                            </div>
                        </div>

                        <button
                            onClick={handleUpgrade}
                            className={styles['premium-modal__upgrade']}
                        >
                            Upgrade to Premium
                        </button>

                    </div>

                </div>

            </div>
        </Modal>
    );
};

export default PremiumModal;