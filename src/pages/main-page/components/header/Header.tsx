import React, {Dispatch, FC, useRef, useState} from 'react';
import styles from './Header.module.scss';
import {ReactComponent as LogoSvg} from './images/header-logo.svg';
import {ReactComponent as SearchSvg} from './images/header-search.svg';
import {ReactComponent as SwapSvg} from './images/header-swap.svg';
import {ReactComponent as UserSvg} from './images/header-user.svg';
import {ReactComponent as LogoutSvg} from './images/header-logout.svg';
import {ReactComponent as PremiumSvg} from './images/premium.svg';
import SearchInput from "./components/search-input/SearchInput";
import UserModal from '../../../../shared/ui/modal-windows/user-modal/UserModal';
import useUserHandler from "../../../../shared/lib/hooks/use-user-handler/useUserHandler";
import {useNavigate} from "react-router-dom";
import useFileSearchHandler from "../../../../shared/lib/hooks/use-file-search-handler/useFileSearchHandler";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useWindowWidth} from "../../../../shared/lib/hooks/useWindowWidth";
import {useElementOutsideEvent} from "../../../../shared/lib/hooks/useElementOutsideEvent";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";

interface Props {
    setIsFeedbackOpen: Dispatch<React.SetStateAction<boolean>>;
}

const Header: FC<Props> = ({
                               setIsFeedbackOpen,
                           }) => {
    const [burgerOpen, setBurgerOpen] =
        useState(false);

    const navigate = useNavigate();

    const {
        premiumHandler,
        authHandler,
    } = useAppContext();

    const {
        authStatus
    } = useAuthContext();

    const {
        loginHandler,
    } = authHandler;

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const userModalState =
        useUserHandler(
            {
                user: loggedInUser,
                openLoginModal: loginHandler.actions.openModal
            }
        );

    const searchFileHandler = useFileSearchHandler();

    const width = useWindowWidth();

    const {handleOpenUserModal} = userModalState

    const {setIsPremiumModalOpen} = premiumHandler;

    const isMobile = width < 1066;

    const menuRef =
        useRef<HTMLDivElement | null>(null);

    const burgerButtonRef =
        useRef<HTMLButtonElement | null>(null);

    useElementOutsideEvent(
        {
            ref: menuRef,
            eventType: 'click',
            handler: () => setBurgerOpen(false),
            enabled: burgerOpen,
            excludeRef: burgerButtonRef,
        }
    );

    const handleToggleBurgerMenu = () => {
        setBurgerOpen(!burgerOpen);
    };

    const handleRedirectToMainPage = () => {
        navigate('/');
    }

    return (
        <div className={styles['header']}>
            <div className={styles['header__container']}>
                <div className={styles['header__content']}>
                    <div className={styles['header__left']}>
                        <div
                            className={styles['header__logo']}
                            onClick={handleRedirectToMainPage}
                        >
                            <LogoSvg/>
                        </div>
                    </div>

                    <div className={styles['header__right']}>
                        <div
                            className={styles['header__premium-button']}
                            onClick={
                                () => setIsPremiumModalOpen(true)
                            }
                        >
                            <PremiumSvg/>
                        </div>

                        <div className={styles['header__search']}>
                            <div className={styles['header__search-input']}>
                                <SearchInput
                                    onClick={searchFileHandler.actions.openPathToSelectedFile}
                                    searchType={searchFileHandler.state.searchType}
                                />

                                <SearchSvg className={styles['header__search-icon']}/>
                            </div>

                            <SwapSvg className={styles['header__search-swap']}
                                     onClick={searchFileHandler.actions.switchSearchType}
                            />
                        </div>

                        {
                            isMobile ? (
                                <div className={styles['header__burger-container']}>
                                    <button
                                        ref={burgerButtonRef}
                                        className={styles['header__burger-button']}
                                        onClick={handleToggleBurgerMenu}
                                        aria-label="Toggle menu"
                                    >
                                        &#9776;
                                    </button>

                                    {
                                        burgerOpen && (
                                            <div
                                                className={styles['header__burger-menu']}
                                                ref={menuRef}
                                            >
                                                <div className={styles['header__burger-item']}>
                                                    <UserSvg
                                                        onClick={handleOpenUserModal}
                                                    />
                                                </div>
                                                <div className={styles['header__burger-item']}>
                                            <span
                                                style={{color: '#8D9191'}}
                                                onClick={
                                                    () => setIsFeedbackOpen(true)
                                                }
                                            >
                                                🗪
                                            </span>
                                                </div>
                                                {
                                                    authStatus === 'authenticated' ? (
                                                        <div className={styles['header__burger-item']}>
                                                            <LogoutSvg
                                                                onClick={
                                                                    () => loginHandler.actions.logout()
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => loginHandler.actions.openModal()}
                                                        >
                                                            Login
                                                        </button>
                                                    )}
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <div className={styles['header__buttons']}>
                                    <UserSvg
                                        className={styles['header__user']}
                                        onClick={handleOpenUserModal}
                                    />

                                    {
                                        authStatus === 'loading' ? (
                                            <div className={styles['header__auth-skeleton']}/>
                                        ) : (
                                            <div
                                                className={authStatus === 'authenticated'
                                                    ? styles['header__logout']
                                                    : styles['header__login']
                                                }
                                                onClick={authStatus === 'authenticated'
                                                    ? () => loginHandler.actions.logout()
                                                    : () => loginHandler.actions.openModal()
                                                }
                                            >
                                                {authStatus === 'authenticated'
                                                    ? 'Logout'
                                                    : 'Login'
                                                }
                                            </div>
                                        )}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <UserModal
                userModalState={userModalState}
            />
        </div>
    );
};

export default Header;