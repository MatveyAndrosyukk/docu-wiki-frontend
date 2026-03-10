import {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthProvider";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {fetchLoggedInUserByEmail} from "../../store/thunks/user/fetchLoggedInUserByEmail";

export default function useAuthBootstrap() {

    const context = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();

    if(!context) throw new Error("AuthContext missing");

    const {setAuthStatus} = context;

    useEffect(()=>{

        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if(!token || !email){
            setAuthStatus("unauthenticated");
            return;
        }

        dispatch(fetchLoggedInUserByEmail(email))
            .unwrap()
            .then(()=>{
                setAuthStatus("authenticated");
            })
            .catch(()=>{
                localStorage.clear();
                setAuthStatus("unauthenticated");
            });

    },[]);
}