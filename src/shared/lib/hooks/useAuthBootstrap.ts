import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {fetchLoggedInUserByEmail} from "../../../store/thunks/user/fetchLoggedInUserByEmail";
import {useAuth} from "./useAuth";

export default function useAuthBootstrap() {
    const dispatch = useDispatch<AppDispatch>();
    const {setAuthStatus} = useAuth();

    useEffect(() => {

        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!token || !email) {
            setAuthStatus("unauthenticated");
            return;
        }

        dispatch(fetchLoggedInUserByEmail(email))
            .unwrap()
            .then(() => {
                setAuthStatus("authenticated");
            })
            .catch(() => {
                localStorage.clear()
                setAuthStatus("unauthenticated");
            });

    }, []);
}