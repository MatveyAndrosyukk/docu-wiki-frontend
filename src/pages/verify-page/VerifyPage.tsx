import React, {FC, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {performVerificationAsync} from "../../shared/lib/services/performVerificationAsync";
import {useAppContext} from "../../context/app-context/hooks/useAppContext";

const VerifyPage: FC = () => {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const navigate = useNavigate();

    const {authHandler} = useAppContext();

    const {
        loginHandler,
        registrationHandler,
    } = authHandler;

    useEffect(
        () => {

            async function verifyEmail() {

                if (!token) {

                    navigate('/')

                    loginHandler.actions.openModal();

                    registrationHandler.actions.setError(
                        'Invalid confirmation link'
                    );

                    return;
                }
                performVerificationAsync(
                    token
                ).then(
                    () => {
                        navigate('/');
                    }
                ).catch(
                    () => {
                        navigate('/')
                    }
                )
            }

            verifyEmail()
                .then(
                    () => {

                        loginHandler.actions.openModal();

                        registrationHandler.actions.setIsModal(false);

                        loginHandler.actions.setError('');

                        loginHandler.actions.setMessage(
                            'Your email confirmed!'
                        );
                    }
                ).catch(
                (
                    error
                ) => {

                    loginHandler.actions.openModal();

                    registrationHandler.actions.setIsModal(true);

                    registrationHandler.actions.setError(
                        error.message
                    );
                }
            );
        },
        [
            authHandler,
            loginHandler.actions,
            navigate,
            registrationHandler.actions,
            token
        ]
    );

    return (
        <div>Confirming email...</div>
    );
};

export default VerifyPage;