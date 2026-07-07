import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {fetchLoggedInUserByEmail} from "../../../store/thunks/user/fetchLoggedInUserByEmail";
import API_BASE_URL from "../../assets/config/api-config";
import {jwtDecode} from "jwt-decode";
import {useAuthContext} from "../../../context/auth-context/hooks/useAuthContext";

export default function useRefreshToken() {
    const reduxDispatch = useDispatch<AppDispatch>();

    const {
        setAuthStatus
    } = useAuthContext();

    useEffect(() => {

            const refreshToken = localStorage.getItem(
                'refreshToken'
            );

            if (!refreshToken) {

                setAuthStatus(
                    'unauthenticated'
                );

                return;
            }

            fetch(
                `${API_BASE_URL}/auth/refresh`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            refreshToken
                        }
                    ),
                }
            )
                .then(
                    res => {

                        if (!res.ok) throw new Error();

                        return res.json();
                    }
                )
                .then(
                    async data => {

                        localStorage.setItem(
                            "accessToken",
                            data.accessToken
                        );

                        localStorage.setItem(
                            "refreshToken",
                            data.refreshToken
                        );

                        const decoded: any = jwtDecode(
                            data.accessToken
                        );

                        await reduxDispatch(
                            fetchLoggedInUserByEmail(
                                decoded.email
                            )
                        ).unwrap();

                        setAuthStatus(
                            "authenticated"
                        );
                    }
                )
                .catch(
                    () => {

                        localStorage.clear();

                        setAuthStatus(
                            "unauthenticated"
                        );
                    }
                );

        },
        [
            reduxDispatch,
            setAuthStatus
        ]
    );
}