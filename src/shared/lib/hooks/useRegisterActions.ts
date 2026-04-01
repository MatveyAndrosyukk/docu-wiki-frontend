import {ChangeEvent, Dispatch, SetStateAction, useCallback, useState} from "react";
import {performRegisterAsync} from "../services/performRegisterAsync";

export interface RegisterModalState {
    email: string;
    username: string;
    password: string;
    rePassword: string;
}

export interface RegisterState {
    registerLoading: boolean;
    setRegisterLoading: Dispatch<SetStateAction<boolean>>;
    registerError: string | null,
    setRegisterError: Dispatch<SetStateAction<string | null>>;
    registerMessage: string | null,
    setRegisterMessage: Dispatch<SetStateAction<string | null>>;
    isRegisterModal: boolean;
    setIsRegisterModal: Dispatch<SetStateAction<boolean>>;
    registerModalValue: RegisterModalState;
    setRegisterModalValue: Dispatch<SetStateAction<RegisterModalState>>;
    handleChangeRePasswordInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleChangeUsernameInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleRegister: () => Promise<void>;
}

export default function useRegisterActions(): RegisterState {
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerMessage, setRegisterMessage] = useState<string | null>(null);
    const [isRegisterModal, setIsRegisterModal] = useState<boolean>(false);
    const [registerModalValue, setRegisterModalValue] = useState<RegisterModalState>({
        username: '',
        email: '',
        password: '',
        rePassword: '',
    });

    const handleChangeUsernameInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (isRegisterModal) {
            setRegisterModalValue({
                ...registerModalValue,
                username: e.currentTarget.value
            });
        }
    }, [isRegisterModal, registerModalValue]);

    const handleChangeRePasswordInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (isRegisterModal) {
            setRegisterModalValue({
                ...registerModalValue,
                rePassword: e.currentTarget.value
            });
        }
    }, [isRegisterModal, registerModalValue, setRegisterModalValue]);

    const handleRegister = useCallback(async (): Promise<void> => {
        const email = registerModalValue.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const username = registerModalValue.username.trim();

        if (email.length === 0 || !emailRegex.test(email)) {
            setRegisterError('Enter a valid email address');
            return;
        }
        if (username.length < 4) {
            setRegisterError('Username must be at least 4 characters');
            return;
        }
        if (username.length > 25) {
            setRegisterError('Username must be no more than 25 characters');
            return;
        }
        if (registerModalValue.password.trim().length < 6 ||
            registerModalValue.rePassword.trim().length < 6) {
            setRegisterError('Password is too short');
            return;
        }
        if (registerModalValue.password !== registerModalValue.rePassword) {
            setRegisterError('Passwords do not match');
            return;
        }
        setRegisterLoading(true);
        setRegisterError(null);
        try {
            await performRegisterAsync(
                registerModalValue.email,
                registerModalValue.password,
                registerModalValue.username,
            ).then(() => {
                setRegisterLoading(false);
                setIsRegisterModal(false);
                setRegisterError(null);
                setRegisterMessage('Confirmation link has been sent')
                setRegisterModalValue({email: '', username: '', password: '', rePassword: ''});
            });
        } catch (error) {
            setRegisterLoading(false);
            if (error instanceof Error) {
                setRegisterError(error.message);
            }
        }
    }, [registerModalValue, setRegisterError, setRegisterLoading]);

    return {
        registerLoading,
        setRegisterLoading,
        registerError,
        setRegisterError,
        registerMessage,
        setRegisterMessage,
        isRegisterModal,
        setIsRegisterModal,
        registerModalValue,
        setRegisterModalValue,
        handleChangeRePasswordInput,
        handleChangeUsernameInput,
        handleRegister,
    }
}