import React, {FC, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {performVerificationAsync} from "../../shared/lib/services/performVerificationAsync";
import {useAppContext} from "../../context/app-context/hooks/useAppContext";

const VerifyPage: FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const {authState} = useAppContext();

    const {
        login,
        registration,
    } = authState;

    useEffect(() => {
            async function verifyEmail() {
                if (!token) {
                    navigate('/')

                    login.actions.openModal();

                    registration.actions.setError(
                        'Invalid confirmation link'
                    );

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
                    login.actions.openModal();

                    registration.actions.setIsModal(false);

                    login.actions.setError('');

                    login.actions.setMessage(
                        'Your email confirmed!'
                    );
                })
                .catch((error) => {
                    login.actions.openModal();

                    registration.actions.setIsModal(true);

                    registration.actions.setError(
                        error.message
                    );
                });
        }, [
            authState,
            login.actions,
            navigate,
            registration.actions,
            token
        ]
    );

    return (
        <div>Confirming email...</div>
    );
};

export default VerifyPage;