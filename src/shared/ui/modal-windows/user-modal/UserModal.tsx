import React, { FC, useCallback } from 'react';
import styles from './UserModal.module.scss';
import commonStyles from '../../../assets/styles/Common.module.scss'
import Modal from "../modal/Modal";
import { User } from "../../../../store/slices/userSlice";
import { UserModalState } from "../../../lib/hooks/useUserModalActions";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";

interface UserModalProps {
    userModalState: UserModalState
}

const UserModal: FC<UserModalProps> = ({ userModalState }) => {
    const navigate = useNavigate();

    const {premiumHandler} = useAppContext();

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const {
        isAddingEditor,
        isChangingName,
        isEditingName,
        setIsEditingName,
        editedName,
        setEditedName,
        editedNameError,
        nameInputRef,
        addEditorError,
        usersWhoCanEdit,
        isUserModalOpen,
        setIsUserModalOpen,
        userModalInputRef,
        userModalValue,
        setUserModalValue,
        handleKeyDownWhileEditing,
        handleBlurNameAfterEdition,
        handleAddUserWhoCanEdit,
        handleDeleteUserWhoCanEdit,
        handleCloseUserModal,
    } = userModalState;

    const handleGoToUsersPage = useCallback((user: User) => {
        navigate(`/${encodeURIComponent(user.email)}`);
        setUserModalValue('');
        setIsUserModalOpen(false);
    }, [navigate, setIsUserModalOpen, setUserModalValue]);

    const handlePromoteClick = () => {
        if (!loggedInUser?.isPremium) {
            premiumHandler.setIsPremiumModalOpen(true);
            return;
        }

        handleAddUserWhoCanEdit();
    };

    if (!isUserModalOpen) return null;

    return (
        <Modal isOpen={isUserModalOpen} onClose={handleCloseUserModal}>
            <div className={styles.userModal}>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Profile</div>
                    <div className={styles.profileBlock}>
                        <div className={styles.profileNameRow}>
                            {isEditingName ? (
                                <input
                                    ref={nameInputRef}
                                    className={styles.nameInput}
                                    value={editedName}
                                    disabled={isChangingName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onKeyDown={handleKeyDownWhileEditing}
                                    onBlur={handleBlurNameAfterEdition}
                                />
                            ) : (
                                <div
                                    className={styles.profileName}
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {loggedInUser?.name}
                                </div>
                            )}
                            {isChangingName && <div className={styles.loaderSmall} />}
                        </div>

                        <div className={styles.profileEmail}>{loggedInUser?.email}</div>

                        <div className={styles.errorContainer}>
                            {editedNameError && <div className={styles.errorText}>{editedNameError}</div>}
                        </div>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Promote access</div>

                    <div className={styles.addEditorBlock}>
                        <div className={styles.addEditorRow}>
                            <input
                                ref={userModalInputRef}
                                className={styles.emailInput}
                                placeholder="Enter email"
                                value={userModalValue}
                                onChange={(e) => setUserModalValue(e.target.value)}
                            />
                            <button
                                className={`${commonStyles.premium} ${styles.promote}`}
                                disabled={!userModalValue.trim() || isAddingEditor}
                                onClick={handlePromoteClick}
                            >
                                {isAddingEditor ? <div className={styles.loaderSmall} /> : 'Promote'}
                            </button>
                        </div>

                        <div className={styles.errorContainer}>
                            {addEditorError && <div className={styles.errorText}>{addEditorError}</div>}
                        </div>
                    </div>

                    <div className={styles.editorsList}>
                        {isAddingEditor && (
                            <div className={styles.editorSkeletonCard}>
                                <div className={styles.editorSkeletonLeft}>
                                    <div className={styles.skeletonName} />
                                    <div className={styles.skeletonEmail} />
                                </div>
                                <div className={styles.skeletonButton} />
                            </div>
                        )}

                        {usersWhoCanEdit.map((user: User) => (
                            <div
                                key={user.email}
                                className={styles.editorCard}
                                onClick={() => handleGoToUsersPage(user)}
                            >
                                <div>
                                    <div className={styles.editorName}>{user.name}</div>
                                    <div className={styles.editorEmail}>{user.email}</div>
                                </div>

                                <button
                                    className={styles.deleteButton}
                                    onClick={(event) =>
                                        handleDeleteUserWhoCanEdit(user.email, event)
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserModal;