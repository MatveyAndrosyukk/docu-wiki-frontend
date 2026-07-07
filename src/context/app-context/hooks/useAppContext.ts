import {useContext} from "react";
import {Context} from "../Context";

export function useAppContext() {
    const context = useContext(Context);

    if (!context) throw new Error('AppProvider is missing!');

    return context;
}