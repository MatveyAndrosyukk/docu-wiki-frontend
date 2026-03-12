import React, {Dispatch, SetStateAction, useCallback} from "react";
import {UiFile} from "../../../store/types/UiFile";

export interface OpenedContextMenuState {
    visible: boolean,
    clickX: number,
    clickY: number,
    file: UiFile | null;
}

export interface ContextMenuState {
    state: OpenedContextMenuState;
    setState: Dispatch<SetStateAction<OpenedContextMenuState>>;
    handleOpenContextMenu: (event: React.MouseEvent, file: UiFile) => void;
    handleCloseContextMenu: () => void;
}

export default function useContextMenuActions(): ContextMenuState {
    const [state, setState] = React.useState<OpenedContextMenuState>({
        visible: false,
        clickX: 0,
        clickY: 0,
        file: null
    });

    const handleOpenContextMenu = useCallback((event: React.MouseEvent, file: UiFile) => {
        event.preventDefault();
        setState({
            visible: true,
            clickX: getAdjustedX(event.clientX),
            clickY: event.clientY,
            file,
        });
    }, [setState]);

    const handleCloseContextMenu = useCallback(() => {
        setState(prev => ({...prev, visible: false}));
    }, [setState]);

    const getAdjustedX = (clientX: number) => {
        const width = window.innerWidth;
        if (width < 420) {
            return clientX - width * 0.15;
        } else if (width < 700) {
            return clientX - width * 0.25;
        } else if (width < 1270) {
            return clientX - width * 0.35;
        }
        return clientX;
    };

    return {
        state,
        setState,
        handleOpenContextMenu,
        handleCloseContextMenu,
    }
}