import {useContext} from "react";
import {AppContext} from "../../../context/AppProvider";

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) throw new Error('AppProvider is missing!');

    return context;
}