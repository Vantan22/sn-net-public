import React from 'react';
import '../../Components/modal/ModalSmallNoti.css'
const ModalSmallNoti = (props) => {
    const { handleCancel, handleDiscard } = props
    return (
        <div className="wrap-modal-small-noti">
        <div className='modal-small-noti'>
            <div className="header-modal-noti">
                <span>Discard post?</span>
            </div>
            <div className="body-modal-noti">
                <span>If you leave, your edits won't be saved.</span>
            </div>
            <div className="footer-modal-noti">
                    <span className="success-modal-noti" onClick={handleDiscard}>Discard</span>
                    <span className="cancel-modal-noti" onClick={handleCancel}>Cancel</span>
            </div>
        </div>
        </div>
    );
};

export default ModalSmallNoti;
