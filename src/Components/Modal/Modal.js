// Modal.js
import React from "react";
import Icon from "../Icon/Icon";
import styles from "./Modal.module.scss";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <Icon type="Close" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
