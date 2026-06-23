import { Dispatch, SetStateAction, useState } from "react";

export interface PremiumState {
    isPremiumModalOpen: boolean;
    setIsPremiumModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function usePremiumModal(): PremiumState {
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    return {
        isPremiumModalOpen,
        setIsPremiumModalOpen,
    };
}