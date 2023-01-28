import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AlertModal = ({ modalContent, setModalContent }) => {
  const [tempFilename, setTempFilename] = useState('');
  const handleClose = () => setModalContent({...modalContent, enable: false});

  return (
    <Modal show={modalContent.enable} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalContent.body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={modalContent.onFooterClick}>
          {modalContent.footer}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AlertModal;