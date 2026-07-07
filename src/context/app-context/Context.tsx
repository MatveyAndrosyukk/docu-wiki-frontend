import {createContext} from "react";
import {ProviderState} from "./AppProvider";

export const Context = createContext<ProviderState | null>(null);