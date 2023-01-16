import React, { useState } from 'react';
// import Modal from 'react-modal';
import { Modal, Button, Dropdown } from 'react-bootstrap';
// import VideoConverter from "convert-video";
// const ffmpeg = require("ffmpeg.js/ffmpeg-worker-mp4.js");


const ConvertToMP4Modal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [oldFormat, setOldFormat] = useState('AVI');
  let convertedVideoDataObj = undefined;
  const convertVideo = async(input) => {
      let sourceVideoFile = input.files[0];
      let targetVideoFormat = 'mp4'
      // convertedVideoDataObj = await VideoConverter.convert(sourceVideoFile, targetVideoFormat);
      if(oldFormat === "ASF") {
        // let convertedVideoDataObj = ffmpeg({
        //   MEMFS: [{name: "test.webm", data: testData}],
        //   arguments: ["-i", sourceVideoFile, "-c:v", "libx264", "-strict", "-2" , sourceVideoFile+targetVideoFormat],
        // });
      }
  }
  const downloadConvertedVideo = () => {
    let a = document.createElement("a");
    a.href = convertedVideoDataObj.data;
    a.download = convertedVideoDataObj.name + "." + convertedVideoDataObj.format;
    a.click();
    handleClose();
  }
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Convert To MP4
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Convert To MP4</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Convert {oldFormat} to MP4
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setOldFormat('AVI/MOV')}>Convert AVI/MOV to MP4</Dropdown.Item>
              <Dropdown.Item onClick={() => setOldFormat('ASF')}>Convert ASF to MP4</Dropdown.Item>
              <Dropdown.Item onClick={() => setOldFormat('DAV')}>Convert DAV to MP4</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <input type='file' accept=".avi, .mov" onchange={(event) => convertVideo(event)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={downloadConvertedVideo}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ConvertToMP4Modal;