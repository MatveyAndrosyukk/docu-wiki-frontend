import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import {findFileById} from "../../../store/utils/fileTreeActionUtils";

interface UseFileLikesProps {
    fileId: number;
}

export const useFileLikes = ({fileId}: UseFileLikesProps) => {
    const [isLiking, setIsLiking] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const file = useSelector((state: RootState) =>
        findFileById(state.fileServer.files, fileId)
    );

    const isLiked = Boolean(file?.isLiked);
    const likes = file?.likes ?? 0;

    const loggedInUserEmail = useSelector(
        (state: RootState) => state.user.loggedInUser?.email
    );


    const toggleLike = useCallback(async () => {
        if (!file || !loggedInUserEmail || isLiking) return;

        setIsLiking(true);

        try {
            if (!loggedInUserEmail) throw new Error("No email");

            await dispatch(toggleFileLikes({id: fileId, email: loggedInUserEmail})).unwrap();
        } finally {
            setIsLiking(false);
        }
    }, [dispatch, file, fileId, isLiking, loggedInUserEmail]);

    return {
        isLiked,
        likes,
        toggleLike,
        isLiking
    };
};
