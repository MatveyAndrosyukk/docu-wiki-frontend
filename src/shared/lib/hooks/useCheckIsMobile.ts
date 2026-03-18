import {useMemo} from "react";

export default function useCheckIsMobile() {
    return useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 768px)').matches;
    }, []);
}