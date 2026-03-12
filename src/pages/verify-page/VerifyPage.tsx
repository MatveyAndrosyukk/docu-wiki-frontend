import React, {FC, useContext, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {AppContext} from "../../context/AppContext";
import {performVerificationAsync} from "../../services/performVerificationAsync";
import {useAppContext} from "../../shared/lib/hooks/useAppContext";

const VerifyPage: FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const {authState} = useAppContext();

    const {
        setIsRegisterModal,
        setIsLoginModalOpen,
        setRegisterError,
        setLoginError,
        setLoginMessage,
    } = authState;

    useEffect(() => {
        async function verifyEmail() {
            if (!token) {
                navigate('/')
                setIsRegisterModal(true)
                setIsLoginModalOpen(true)
                setRegisterError('Invalid confirmation link')
                return;
            }
            performVerificationAsync(token)
                .then(() => {
                    navigate('/');
                })
                .catch(() => {
                    navigate('/')
                })
        }

        verifyEmail()
            .then(() => {
                setIsLoginModalOpen(true);
                setIsRegisterModal(false);
                setLoginError(null);
                setLoginMessage('Your email confirmed!');
            })
            .catch((error) => {
                setIsLoginModalOpen(true);
                setIsRegisterModal(true);
                setRegisterError(error.message);
            });
    }, [authState, navigate, setIsLoginModalOpen, setIsRegisterModal, setLoginError, setLoginMessage, setRegisterError, token]);

    return (
        <div>Confirming email...</div>
    );
};

export default VerifyPage;