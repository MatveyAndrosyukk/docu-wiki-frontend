import {AuthContext} from "../../context/AuthProvider";
import {useContext} from "react";

export function useAuth(){
    const context = useContext(AuthContext);

    if (!context) throw new Error('AuthProvider is missing!');

    return context;
}