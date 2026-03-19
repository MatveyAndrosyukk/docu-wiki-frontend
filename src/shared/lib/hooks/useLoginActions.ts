import {Dispatch, Ref, SetStateAction, useCallback, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {performLoginAsync} from "../services/performLoginAsync";
import {jwtDecode} from "jwt-decode";
import {clearUiState} from "../../../store/slices/fileUiSlice";
import {useAuth} from "./useAuth";
import {fetchLoggedInUserByEmail} from "../../../store/thunks/user/fetchLoggedInUserByEmail";
import {clearServerFiles} from "../../../store/slices/fileServerSlice";
import {clearLoggedInUser} from "../../../store/slices/userSlice";

export interface LoginModalValue {
    login: string;
    password: string;
}

export interface LoginState {
    loginLoading: boolean;
    setLoginLoading: Dispatch<SetStateAction<boolean>>;
    loginError: string | null;
    setLoginError: Dispatch<SetStateAction<string | null>>;
    isLoginModalOpen: boolean;
    setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
    loginModalValue: LoginModalValue;
    setLoginModalValue: Dispatch<SetStateAction<LoginModalValue>>;
    loginMessage: string | null;
    setLoginMessage: Dispatch<SetStateAction<string | null>>;
    loginModalInputRef: Ref<HTMLInputElement | null> | null;
    handleOpenLoginModal: () => void;
    handleLogout: () => void;
    handleLogin: () => Promise<void>;
}

export default function useLoginActions(): LoginState {
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginModalValue, setLoginModalValue] = useState<LoginModalValue>({
        login: "",
        password: "",
    });
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);

    const loginModalInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();


    const {setAuthStatus} = useAuth();

    const handleOpenLoginModal = useCallback(() => {
        setIsLoginModalOpen(true);
    }, [setIsLoginModalOpen]);

    const handleLogout = useCallback(() => {
        const isViewBlocked = viewedUser?.isViewBlocked

        localStorage.clear();

        if (isViewBlocked) {
            dispatch(clearUiState());
            dispatch(clearServerFiles());
        }

        dispatch(clearLoggedInUser());

        setAuthStatus("unauthenticated");
    }, [dispatch, setAuthStatus, viewedUser]);

    const handleLogin = useCallback(async () => {
        const login = async () => {
            try {
                const data = await performLoginAsync(loginModalValue.login, loginModalValue.password);

                type JwtPayload = {
                    email: string;
                    roles: { id: number; value: string; description: string }[];
                    iat: number;
                    exp: number;
                };

                const decoded: JwtPayload = jwtDecode(data.accessToken);
                const roleValues = decoded.roles.map(role => role.value);

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                localStorage.setItem('email', decoded.email);
                localStorage.setItem('roles', JSON.stringify(roleValues));

                await dispatch(fetchLoggedInUserByEmail(decoded.email)).unwrap();

                setAuthStatus("authenticated");
            } catch (error) {
                throw error;
            }
        }

        setLoginLoading(true);
        setLoginError(null);
        try {
            await login();
        } catch (error) {
            throw error;
        } finally {
            setLoginLoading(false);
        }
    }, [dispatch, loginModalValue.login, loginModalValue.password, setAuthStatus]);

    return {
        loginLoading,
        setLoginLoading,
        loginError,
        setLoginError,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalValue,
        setLoginModalValue,
        loginMessage,
        setLoginMessage,
        loginModalInputRef,
        handleOpenLoginModal,
        handleLogout,
        handleLogin,
    }
}