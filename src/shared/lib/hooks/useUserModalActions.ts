import React, {Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef} from "react";
import {User} from "../../../store/slices/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {addUserWhoCanEdit} from "../../../store/thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../../../store/thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../../../store/thunks/user/changeUserName";
import {LoginState} from "./useLoginActions";
import {useAuth} from "./useAuth";

export interface UserModalState {
    isAddingEditor: boolean;
    setIsAddingEditor: Dispatch<SetStateAction<boolean>>;
    isChangingName: boolean;
    setIsChangingName: Dispatch<SetStateAction<boolean>>;
    isEditingName: boolean;
    setIsEditingName: Dispatch<SetStateAction<boolean>>;
    editedName: string;
    setEditedName: Dispatch<SetStateAction<string>>;
    isUserModalOpen: boolean;
    setIsUserModalOpen: Dispatch<SetStateAction<boolean>>;
    userModalValue: string;
    setUserModalValue: Dispatch<SetStateAction<string>>;
    usersWhoCanEdit: User[];
    setUsersWhoCanEdit: Dispatch<SetStateAction<User[]>>;
    nameInputRef: RefObject<HTMLInputElement | null> | null;
    userModalInputRef: RefObject<HTMLInputElement | null> | null;
    editedNameError: string;
    setEditedNameError: Dispatch<SetStateAction<string>>;
    addEditorError: string;
    setAddEditorError: Dispatch<SetStateAction<string>>;
    changeNameError: string;
    setChangeNameError: Dispatch<SetStateAction<string>>;
    handleKeyDownWhileEditing: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleBlurNameAfterEdition: () => void;
    handleAddUserWhoCanEdit: () => void;
    handleDeleteUserWhoCanEdit: (targetEmail: string, event: any) => void;
    handleCloseUserModal: () => void;
    handleOpenUserModal: () => void;
}

export default function useUserModalActions(user: User | null, loginState: LoginState): UserModalState {
    const dispatch = useDispatch<AppDispatch>();
    const [isAddingEditor, setIsAddingEditor] = React.useState(false);
    const [isChangingName, setIsChangingName] = React.useState<boolean>(false);
    const [isEditingName, setIsEditingName] = React.useState<boolean>(false);
    const [editedName, setEditedName] = React.useState<string>(user?.name || '');
    const [isUserModalOpen, setIsUserModalOpen] = React.useState<boolean>(false);
    const [userModalValue, setUserModalValue] = React.useState<string>('');
    const [usersWhoCanEdit, setUsersWhoCanEdit] = React.useState<User[]>(user?.whoCanEdit || []);
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    const userModalInputRef = useRef<HTMLInputElement>(null);
    const [editedNameError, setEditedNameError] = React.useState<string>('');
    const [addEditorError, setAddEditorError] = React.useState<string>('');
    const [changeNameError, setChangeNameError] = React.useState<string>('');
    const {authStatus} = useAuth();
    useEffect(() => {
        setEditedName(user?.name || '');
    }, [user?.name]);
    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
            nameInputRef.current.disabled = false;
        }
    }, [isEditingName]);
    useEffect(() => {
        if (editedName.length > 25) {
            setEditedNameError('Username is too long');
        } else if (editedName.length < 4) {
            setEditedNameError('Username is too short');
        } else {
            setEditedNameError('');
        }
    }, [editedName]);
    useEffect(() => {
        if (userModalValue.trim() === '' && user?.whoCanEdit) {
            setUsersWhoCanEdit([...user?.whoCanEdit].reverse());
        }
    }, [userModalValue, user?.whoCanEdit]);
    const handleCloseUserModal = useCallback(() => {
        setIsUserModalOpen(false);
        setUserModalValue('');
        setAddEditorError('');
        setChangeNameError('');
    }, [setIsUserModalOpen, setUserModalValue, setAddEditorError, setChangeNameError]);
    const handleOpenUserModal = useCallback(() => {
        if (authStatus !== 'authenticated') {
            loginState.handleOpenLoginModal();
            return;
        }
        setIsUserModalOpen(true);
    }, [loginState, setIsUserModalOpen]);
    const handleAddUserWhoCanEdit = useCallback(() => {
        if (!userModalValue.trim()) return;
        const currentUserEmail = localStorage.getItem('email');
        setIsAddingEditor(true);
        dispatch(addUserWhoCanEdit({
            userEmail: currentUserEmail as string,
            whoCanEditEmail: userModalValue,
        })).unwrap().then(() => {
            setAddEditorError('');
            setUserModalValue('');
        }).catch((e) => setAddEditorError(e.message)).finally(() => setIsAddingEditor(false));
    }, [dispatch, userModalValue]);
    const handleDeleteUserWhoCanEdit = useCallback((targetEmail: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        const currentUserEmail = localStorage.getItem('email');
        dispatch(deleteUserWhoCanEdit({userEmail: currentUserEmail as string, whoCanEditEmail: targetEmail,}));
    }, [dispatch]);
    const handleConfirmNameEdition = useCallback(() => {
        if (editedName === user?.name) {
            setIsEditingName(false);
            return;
        }
        setIsChangingName(true);
        dispatch(changeUserName({name: editedName, email: user?.email as string,})).unwrap().then(() => {
            setIsEditingName(false);
        }).catch(() => setEditedNameError('Username already exists')).finally(() => setIsChangingName(false));
    }, [dispatch, editedName, user?.email, user?.name]);
    const handleKeyDownWhileEditing = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (editedNameError) {
                return
            }
            handleConfirmNameEdition();
        }
        if (e.key === 'Escape') {
            setIsEditingName(false);
            setEditedName(user?.name || '');
        }
    }, [editedNameError, handleConfirmNameEdition, user?.name]);
    const handleBlurNameAfterEdition = useCallback(() => {
        if (isChangingName) return;
        setIsEditingName(false);
        setChangeNameError('');
        setEditedName(user?.name || user?.email || '');
    }, [isChangingName, user?.name, user?.email]);
    return {
        isAddingEditor,
        setIsAddingEditor,
        isChangingName,
        setIsChangingName,
        isEditingName,
        setIsEditingName,
        editedName,
        setEditedName,
        isUserModalOpen,
        setIsUserModalOpen,
        userModalValue,
        setUserModalValue,
        usersWhoCanEdit,
        setUsersWhoCanEdit,
        nameInputRef,
        userModalInputRef,
        editedNameError,
        setEditedNameError,
        addEditorError,
        setAddEditorError,
        changeNameError,
        setChangeNameError,
        handleKeyDownWhileEditing,
        handleBlurNameAfterEdition,
        handleAddUserWhoCanEdit,
        handleDeleteUserWhoCanEdit,
        handleCloseUserModal,
        handleOpenUserModal,
    };
}