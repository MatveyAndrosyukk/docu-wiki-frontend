import {useRef, useState} from "react";

export const useNotification = (duration = 3000) => {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [id, setId] = useState(0);

    const timer = useRef<NodeJS.Timeout | null>(null);

    const close = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        setClosing(true);

        setTimeout(() => {
            setVisible(false);
            setClosing(false);
        }, 350);
    };

    const show = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        setId(prev => prev + 1);
        setVisible(true);

        timer.current = setTimeout(close, duration);
    };

    return {
        visible,
        closing,
        id,
        show,
        close
    };
}