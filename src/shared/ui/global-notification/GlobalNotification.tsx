import {useSelector} from 'react-redux';
import {RootState} from '../../../store';

import commonStyles from '../../assets/styles/Common.module.scss';

const GlobalNotification = () => {

    const notification = useSelector(
        (state: RootState) => state.notification
    );

    if (!notification.visible) {

        return null;
    }

    return (

        <div
            className={
                commonStyles['common__notification']
            }
        >
            {
                notification.message
            }
        </div>
    );
};

export default GlobalNotification;