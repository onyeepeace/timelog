import React from 'react';
import modalStyles from './Modal.module.css';
import { Close } from '@styled-icons/remix-fill/Close';

export default function Modal(props) {
    const { closeModal, children, footer } = props;

    const closeicon = () => (
        <Close className={modalStyles.closeIcon} onClick={closeModal} />
    );

    return (
        <>
            <div className={modalStyles.overlay}>
            <div className={modalStyles.content}>
                {closeicon()}
                {children}
                <div>{footer}</div>
            </div>
            </div>
        </>
    );
}
