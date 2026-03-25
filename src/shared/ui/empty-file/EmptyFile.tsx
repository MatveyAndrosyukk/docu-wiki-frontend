import React, {Dispatch, SetStateAction} from 'react';
import styles from "../../../pages/main-page/components/opened-file/OpenedFile.module.scss";
import emptyStyles from "./EmplyFile.module.scss";
import {ReactComponent as BurgerSvg} from '../../../pages/main-page/components/opened-file/images/empty-file-burger.svg'

interface EmptyFileProps {
    isFileTreeOpened: boolean;
    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>;
}

const EmptyFile: React.FC<EmptyFileProps> = ({
                                                 isFileTreeOpened,
                                                 setIsFileTreeOpened,
                                             }) => {

    return (
        <div className={styles['opened-file']}>

            <div className={emptyStyles['empty']}>
                <div className={emptyStyles['empty__card']}>

                    <div className={emptyStyles['empty__icon']}>
                        ⭐
                        {/*⚡*/}
                    </div>

                    <div className={emptyStyles['empty__title']}>
                        No file opened
                    </div>

                    <div className={emptyStyles['empty__subtitle']}>
                        Select a file from the tree
                    </div>

                    <div className={emptyStyles['empty__hint']}>
                        Press
                        <span className={emptyStyles['empty__kbd']}>Ctrl</span>
                        +
                        <span className={emptyStyles['empty__kbd']}>P</span>
                        to create folder
                    </div>

                </div>
            </div>

            <div
                style={{display: isFileTreeOpened ? 'none' : 'flex'}}
                className={emptyStyles['file-tree']}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsFileTreeOpened(!isFileTreeOpened)
                }}
            >
                <BurgerSvg className={emptyStyles['file-tree-image']}/>
            </div>

        </div>
    );
}

export default EmptyFile;