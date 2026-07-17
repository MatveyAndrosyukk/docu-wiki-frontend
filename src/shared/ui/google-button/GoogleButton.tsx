import {useGoogleLogin} from '@react-oauth/google';
import styles from './GoogleButton.module.scss'
import {ReactComponent as CustomGoogleButtonSvg} from './images/custom-google-button.svg'
import {useAppContext} from "../../../context/app-context/hooks/useAppContext";

const GoogleButton = () => {

    const {
        authHandler
    } = useAppContext();

    const {
        googleHandler
    } = authHandler;

    const handleGoogleAuthResult = useGoogleLogin(
        {
            flow: 'auth-code',
            onSuccess: googleHandler.actions.success,
            onError: googleHandler.actions.error,
        }
    );

    return (

        <CustomGoogleButtonSvg
            className={
                `${styles['customGoogleButton']}`
            }

            onClick={
                () => handleGoogleAuthResult()
            }
        />
    );
};

export default GoogleButton;