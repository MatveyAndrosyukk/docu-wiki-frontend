import {Dispatch, SetStateAction, useEffect, useState} from "react";

interface fileTreeVisionState {
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export const useFileTreeVisionState = (): fileTreeVisionState => {

    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth < 1270) {

                setIsOpened(false);
            } else {

                setIsOpened(true);
            }
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        handleResize();

        return () => window.removeEventListener(
            "resize",
            handleResize
        );

    }, []);

    return {
        isOpened,
        setIsOpened
    };
};