import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CSVLink } from "react-csv";

const CSVNameModal = ({ filename, setFilename, setShowModal, showModal, data, sampleDate, direction, lane, surveyId }) => {
  const [tempFilename, setTempFilename] = useState('');
  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save as</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <input type="text" value={tempFilename} onChange={(event) => setTempFilename(event.target.value)} />.csv
        </span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary">
          Save */}
          <CSVLink filename={tempFilename+'.xlsx'} data={data.map((entry) => ({
            'Txn. Id': entry.ID,
            "Survey id": surveyId,
            "Date(format: dd-mm-yyy)": sampleDate,
            "Time(Format: HH:mm:ss)": entry.TIME,
            "Lane": lane,
            "Avg. Speed": entry.SPEED,
            "Direction": direction,
            "Vehicle Class": entry.CLASS,
            "No.of Axle": entry.AXELS
            }))}><Button variant="primary" onClick={handleClose}>Save</Button></CSVLink>
          {/* Save */}
        {/* </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
export default CSVNameModal;