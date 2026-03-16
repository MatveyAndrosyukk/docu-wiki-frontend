import {useGoogleLogin} from '@react-oauth/google';
import styles from './GoogleButton.module.scss'
import {ReactComponent as CustomGoogleButtonSvg} from './images/custom-google-button.svg'
import {useAppContext} from "../../lib/hooks/useAppContext";

const GoogleButton = () => {
    const {authState} = useAppContext();

    const {handleGoogleSuccess, handleGoogleError} = authState;

    const handleGoogleAuthResult = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    return (
        <CustomGoogleButtonSvg
            className={`${styles['customGoogleButton']}`}
            onClick={() => handleGoogleAuthResult()}/>
    );
};

export default GoogleButton;