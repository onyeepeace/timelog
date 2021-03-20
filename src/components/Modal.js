import React from 'react';
import modalStyles from './Modal.module.css';
import { Close } from '@styled-icons/remix-fill/Close';

export default function Example(props) {
    const { closeModal } = props;
    const closeicon = () => (
        <Close className={modalStyles.closeIcon} onClick={closeModal} />
    );

    return (
        <>
            <div className={modalStyles.overlay}>
                <div className={modalStyles.content}>
                    {closeicon()}
                    {props.children}
                    <div>{props.footer}</div>
                </div>
            </div>
        </>
    );
}
