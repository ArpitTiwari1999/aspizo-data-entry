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
        <Button variant="primary" onClick={handleClose}>
          Ohh Yeah !!!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AlertModal;