import React, {FC, useCallback} from 'react';
import styles from './UserModal.module.scss';
import commonStyles from '../../../assets/styles/Common.module.scss'
import Modal from "../modal/Modal";
import {User} from "../../../../store/slices/userSlice";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {UserHandlerActionsState} from "../../../lib/hooks/use-user-handler/user-handler.types";

interface Props {
    userHandler: UserHandlerActionsState
}

const UserModal: FC<Props> = (
    {
        userHandler
    }
) => {

    const navigate = useNavigate();

    const {
        premiumHandler
    } = useAppContext();

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const goToUsersPage = useCallback(
        (
            user: User
        ) => {

            navigate(
                `/${encodeURIComponent(user.email)}`
            );

            userHandler.actions.updateModalValue(
                ''
            )

            userHandler.actions.closeModal();
        },
        [
            navigate,
            userHandler.actions
        ]
    );

    const promoteClick = () => {

        if (!loggedInUser?.isPremium) {

            premiumHandler.setIsPremiumModalOpen(
                true
            );

            return;
        }

        userHandler.actions.addEditor().catch(
            e => {
                console.error(
                    e
                );
            }
        );
    };

    if (!userHandler.state.isModalOpen)

        return null;

    return (

        <Modal
            isOpen={
                userHandler.state.isModalOpen
            }

            onClose={
                userHandler.actions.closeModal
            }
        >
            <div
                className={
                    styles.userModal
                }
            >
                <div
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionTitle
                        }
                    >
                        Profile
                    </div>
                    <div
                        className={
                            styles.profileBlock
                        }
                    >
                        <div
                            className={
                                styles.profileNameRow
                            }
                        >
                            {
                                userHandler.state.isEditingName ? (

                                    <input
                                        ref={
                                            userHandler.state.nameInputRef
                                        }

                                        className={
                                            styles.nameInput
                                        }

                                        value={
                                            userHandler.state.editedName
                                        }

                                        disabled={
                                            userHandler.state.isChangingName
                                        }

                                        onChange={
                                            (
                                                e
                                            ) => userHandler.actions.updateEditedName(
                                                e.target.value
                                            )
                                        }

                                        onKeyDown={
                                            userHandler.actions.keyDownWhileEditing
                                        }

                                        onBlur={
                                            userHandler.actions.blurNameAfterEdition
                                        }
                                    />
                                ) : (

                                    <div
                                        className={
                                            styles.profileName
                                        }

                                        onClick={
                                            () => userHandler.actions.startEditingName()
                                        }
                                    >
                                        {
                                            loggedInUser?.name
                                        }
                                    </div>
                                )
                            }
                            {
                                userHandler.state.isChangingName &&
                                <div
                                    className={
                                        styles.loaderSmall
                                    }
                                />
                            }
                        </div>
                        <div
                            className={
                                styles.profileEmail
                            }
                        >
                            {
                                loggedInUser?.email
                            }
                        </div>
                        <div
                            className={
                                styles.errorContainer
                            }
                        >
                            {
                                userHandler.state.editedNameError &&
                                <div
                                    className={
                                        styles.errorText
                                    }
                                >
                                    {
                                        userHandler.state.editedNameError
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div
                    className={
                        styles.divider
                    }
                />
                <div
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionTitle
                        }
                    >
                        Promote access
                    </div>
                    <div
                        className={
                            styles.addEditorBlock
                        }
                    >
                        <div
                            className={
                                styles.addEditorRow
                            }
                        >
                            <input
                                ref={
                                    userHandler.state.modalInputRef
                                }

                                className={
                                    styles.emailInput
                                }

                                placeholder="Enter email"

                                value={
                                    userHandler.state.modalValue
                                }

                                onChange={
                                    (
                                        e
                                    ) => userHandler.actions.updateModalValue(
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                className={`
                                ${commonStyles.premium} 
                                ${styles.promote}
                                `}

                                disabled={
                                    !userHandler.state.modalValue.trim() ||
                                    userHandler.state.isAddingEditor
                                }

                                onClick={
                                    promoteClick
                                }
                            >
                                {
                                    userHandler.state.isAddingEditor ?
                                        <div
                                            className={
                                                styles.loaderSmall
                                            }
                                        />
                                        : 'Promote'}
                            </button>
                        </div>
                        <div
                            className={
                                styles.errorContainer
                            }
                        >
                            {
                                userHandler.state.addEditorError &&
                                <div
                                    className={
                                        styles.errorText
                                    }
                                >
                                    {
                                        userHandler.state.addEditorError
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div
                        className={
                            styles.editorsList
                        }
                    >
                        {
                            userHandler.state.isAddingEditor && (

                                <div
                                    className={
                                        styles.editorSkeletonCard
                                    }
                                >
                                    <div
                                        className={
                                            styles.editorSkeletonLeft
                                        }
                                    >
                                        <div
                                            className={
                                                styles.skeletonName
                                            }
                                        />
                                        <div
                                            className={
                                                styles.skeletonEmail
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles.skeletonButton
                                        }
                                    />
                                </div>
                            )
                        }
                        {
                            userHandler.state.editors.map(
                                (
                                    user: User
                                ) => (
                                    <div
                                        key={
                                            user.email
                                        }

                                        className={
                                            styles.editorCard
                                        }

                                        onClick={
                                            () => goToUsersPage(
                                                user
                                            )
                                        }
                                    >
                                        <div>
                                            <div
                                                className={
                                                    styles.editorName
                                                }
                                            >
                                                {
                                                    user.name
                                                }
                                            </div>
                                            <div
                                                className={
                                                    styles.editorEmail
                                                }
                                            >
                                                {
                                                    user.email
                                                }
                                            </div>
                                        </div>
                                        <button
                                            className={
                                                styles.deleteButton
                                            }

                                            onClick={
                                                (
                                                    event
                                                ) =>
                                                    userHandler.actions.deleteEditor(
                                                        user.email,
                                                        event
                                                    )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserModal;