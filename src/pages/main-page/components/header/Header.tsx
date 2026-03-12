import React, {FC, useRef, useState} from 'react';
import styles from './Header.module.scss';
import {ReactComponent as LogoSvg} from './images/header-logo.svg';
import {ReactComponent as SearchSvg} from './images/header-search.svg';
import {ReactComponent as SwapSvg} from './images/header-swap.svg';
import {ReactComponent as UserSvg} from './images/header-user.svg';
import {ReactComponent as LogoutSvg} from './images/header-logout.svg';
import SearchInput from "./components/search-input/SearchInput";
import UserModal from '../../../../ui-components/user-modal/UserModal';
import useUserModalActions from "../../../../utils/hooks/useUserModalActions";
import {useNavigate} from "react-router-dom";
import useFileSearchActions from "../../../../utils/hooks/useFileSearchActions";
import {useAuth} from "../../../../utils/hooks/useAuth";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {useAppContext} from "../../../../utils/hooks/useAppContext";
import {useWindowWidth} from "../../../../utils/hooks/useWindowWidth";
import {useElementOutsideEvent} from "../../../../utils/hooks/useElementOutsideEvent";

const Header: FC = () => {
    const [burgerOpen, setBurgerOpen] = useState(false);

    const navigate = useNavigate();

    const {authState} = useAppContext();
    const {authStatus} = useAuth();

    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser)

    const userModalState = useUserModalActions(loggedInUser, authState);
    const fileSearch = useFileSearchActions();
    const width = useWindowWidth();
    const {handleOpenUserModal} = userModalState
    const {handleLogout, handleOpenLoginModal} = authState;
    const {searchType, handleSwitchSearchType, handleOpenPathToSelectedFile} = fileSearch;

    const isMobile = width < 740;

    const menuRef = useRef<HTMLDivElement | null>(null);
    const burgerButtonRef = useRef<HTMLButtonElement | null>(null);

    useElementOutsideEvent(
        menuRef,
        'click',
        () => setBurgerOpen(false),
        burgerOpen,
        burgerButtonRef
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
                        <div className={styles['header__search']}>
                            <div className={styles['header__search-input']}>
                                <SearchInput
                                    onClick={handleOpenPathToSelectedFile}
                                    searchType={searchType}
                                />
                                <SearchSvg className={styles['header__search-icon']}/>
                            </div>
                            <SwapSvg
                                className={styles['header__search-swap']}
                                onClick={handleSwitchSearchType}/>
                        </div>

                        {isMobile ? (
                            <div className={styles['header__burger-container']}>
                                <button
                                    className={styles['header__burger-button']}
                                    onClick={handleToggleBurgerMenu}
                                    aria-label="Toggle menu"
                                    ref={burgerButtonRef}
                                >
                                    &#9776;
                                </button>
                                {burgerOpen && (
                                    <div
                                        ref={menuRef}
                                        className={styles['header__burger-menu']}>
                                        <div className={styles['header__burger-item']}>
                                            <UserSvg onClick={handleOpenUserModal}/>
                                        </div>
                                        {authStatus === 'authenticated' ? (
                                            <div className={styles['header__burger-item']}>
                                                <LogoutSvg onClick={handleLogout}/>
                                            </div>
                                        ) : (
                                            <button onClick={handleOpenLoginModal}>Login</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`${styles['header__buttons']}`}>
                                <div className={styles['header__user']}>
                                    <UserSvg
                                        onClick={handleOpenUserModal}/>
                                </div>
                                {authStatus === 'loading' ? (
                                    <div className={styles['header__auth-skeleton']}/>
                                ) : authStatus === 'authenticated' ? (
                                    <div
                                        className={styles['header__logout']}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </div>
                                ) : (
                                    <div
                                        className={styles['header__login']}
                                        onClick={handleOpenLoginModal}
                                    >
                                        Login
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <UserModal userModalState={userModalState}/>
        </div>
    );
};

export default Header;