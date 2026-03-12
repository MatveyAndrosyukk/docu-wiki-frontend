import {useEffect, useState} from "react";

export const useResponsiveFileTree = () => {

    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth < 1270) {
                setIsOpened(false);
            } else {
                setIsOpened(true);
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return {
        isOpened,
        setIsOpened
    };
};