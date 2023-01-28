import './App.css';
import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import Table from './table';
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faAngleDoubleRight, faAngleDoubleLeft, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from "react-csv";
import CSVNameModal from './CSVNameModal';
import Button from 'react-bootstrap/Button';
// import ConvertToMP4Modal from './ConvertToMP4Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertModal from './Modal';

function App() {
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoRef, setVideoRef] = useState();
  const [timer, setTimer] = useState('');
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [status, setStatus] = useState('pause');
  const [videoIntervalTimer, setVideoIntervalTimer] = useState(1);
  const [loggedIn, setLoggedIn] = useState(true);
  const [sampleDate, setSampleDate] = useState('');
  const [lane, setLane] = useState('');
  const [surveyId, setSurveyId] = useState('');
  const [direction, setDirection] = useState('');
  const [filename, setFilename] = useState('');
  const [videoTimer, setVideoTimer] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    enable: false,
    title: '',
    body: ''
  });
  const [data, setData] = useState([]);

  const handleVideoUpload = (event) => {
    const [file] = event.target.files;
    setVideoFilePath(URL.createObjectURL(file));
  };
  useEffect(() => {
    let prevTimer = false;
    let newTimer = timer;
    const expectedPlayBack = 1;
    let runInterval = setInterval(() => {
      if(status === 'play') {
        const [hh, mm, ss] = (prevTimer) ? newTimer.split(':') : timer.split(':');
        // if(ms < 99) newTimer = hh+':'+mm+':'+ss+':'+(parseFloat(ms)+playBackSpeed)
        // else{
          if(parseInt(ss) < 59) newTimer = (parseInt(ss) < 9) ? hh+':'+mm+':0'+(parseFloat(ss)+expectedPlayBack) : hh+':'+mm+':'+(parseFloat(ss)+expectedPlayBack);
          else {
            const newSec = (parseFloat(ss)+expectedPlayBack-60) < 9 ? '0'+(parseFloat(ss)+expectedPlayBack-60) : (parseFloat(ss)+expectedPlayBack-60);
            if(parseInt(mm) <59 ) newTimer = (parseInt(mm) < 9) ? hh+':0'+(parseInt(mm)+1)+':'+newSec : hh+':'+(parseInt(mm)+1)+':'+newSec;
            else {
              if(parseInt(hh) <59) newTimer = (parseInt(hh) < 9) ? '0'+(parseInt(hh)+1)+':00:'+newSec : (parseInt(hh)+1)+':00:'+newSec;
              else newTimer = '00:00:00';
            }
          }
        // }
        prevTimer = true;
        setTimer(newTimer);
      }
      else {
        prevTimer = false;
      }
    }, parseInt(1000/playBackSpeed));
    return () => clearInterval(runInterval);
  }, [status]);
  useEffect(()=>{
    const storageData = JSON.parse(localStorage.getItem('aspizo-data'));
    if(storageData) setData(storageData);
  },[]);
  const updatePlayBackSpeed = (up) => {
    if(up){
      if(playBackSpeed > 1.95) setPlayBackSpeed(playBackSpeed*2);
      else setPlayBackSpeed(parseFloat((playBackSpeed + 0.05).toFixed(2)));
    }
    else {
      if(playBackSpeed > 2) setPlayBackSpeed(playBackSpeed/2);
      else setPlayBackSpeed(parseFloat((playBackSpeed - 0.05).toFixed(2)));
    }
  }
  const updateOnlyVideoTimerSpeed = (up) => {
    if(up){
      if(videoIntervalTimer > 1.95) {
        setVideoIntervalTimer(videoIntervalTimer*2);
      }
      else setVideoIntervalTimer(parseFloat((videoIntervalTimer + 0.05).toFixed(2)));
    }
    else {
      if(videoIntervalTimer > 2) setVideoIntervalTimer(videoIntervalTimer/2);
      else setVideoIntervalTimer(parseFloat((videoIntervalTimer - 0.05).toFixed(2)));
    }
  }
  const updateTimer = (value) => {
    const [hh, mm, ss] = timer.split(':');
    let newTimer = timer;
    if(value > 0){
      if((parseInt(ss)+value) < 60) newTimer = hh+':'+mm+':'+(parseInt(ss)+value);
      else if(parseInt(mm)+1 < 60) newTimer = hh+':'+(parseInt(mm)+1)+':'+(parseInt(ss)+value-60);
      else if(parseInt(hh) < 60) newTimer = (parseInt(hh)+1)+':00'+':'+(parseInt(ss)+value-60);
    }
    else {
      if((parseInt(ss)+value) >= 0) newTimer = hh+':'+mm+':'+(parseInt(ss)+value);
      else if(parseInt(mm) > 0) newTimer = hh+':'+(parseInt(mm)-1)+':'+(60+parseInt(ss)+value);
      else if(parseInt(hh) > 0) newTimer = (parseInt(hh)-1)+':59'+':'+(60+parseInt(ss)+value);
    }
    setTimer(newTimer);
  }
  const updateSeekPosition = async (direction) => {
    const currentSeek = videoRef.getCurrentTime();
    if(direction === 'left' && currentSeek > 1) {
      updateTimer(-1);
      videoRef.seekTo(currentSeek-1, 'seconds');
    }
    else if(direction === 'right' && currentSeek+3 < videoRef.getDuration()) {
      updateTimer(1);
      videoRef.seekTo(currentSeek+1, 'seconds');
    }
  }
  const updateBuffer = (shouldIncrease) => {
    (shouldIncrease) ? updateTimer(1) : updateTimer(-1);
  }
  const handleSave = () => {
    localStorage.setItem('aspizo-data', JSON.stringify(data));
    setModalContent({
      enable: true,
      title: "Data Save Confirmation",
      body: "Are you sure you want to Save All the Records",
      footer: "Ohh yeah !!!",
      onFooterClick: () => setModalContent({...modalContent, enable: false})
    });
  }
  const handleDeleteAll = () => {
    setModalContent({
      enable: true,
      title: "Data Delete Confirmation",
      body: "Are you sure you want to delete all the records",
      footer: "Delete All",
      onFooterClick: () => {
        localStorage.removeItem('aspizo-data');
        setModalContent({...modalContent, enable: false});
        setData([]);
      }
    });
  }
  const handleRowDelete = (index) => {
    setModalContent({
      enable: true,
      title: "Data Delete Confirmation",
      body: `Are you sure you want to delete Record No. : ${index}`,
      footer: "Delete",
      onFooterClick: () => {
        setData(data.filter((item) => item.ID !== index));
        setModalContent({...modalContent, enable: false});
      }
    });
  }
  return (
    <div className="App">
      <AlertModal modalContent={modalContent} setModalContent={setModalContent} />
      <CSVNameModal sampleDate={sampleDate} direction={direction} lane={lane} surveyId={surveyId} data={data} filename={filename} setFilename={setFilename} showModal={showModal} setShowModal={setShowModal} />
      {/* {loggedIn ?  (<> */}
      <div><h1>Aspizo Data Entry Software</h1></div>
        <div className="App-body">
          <div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Date : <input type="text" style={{ width: '19.5vh', height: '4vh', marginRight: '15vh', marginLeft: '1vh' }} value={sampleDate} onChange={(event) => setSampleDate(event.target.value)} />
              <h3>Entry Area</h3>
              <span style={{ display: 'flex', marginLeft: '13vh' }}>
                Lane : <input type="text" style={{ width: '5.5vh', height: '4vh', marginLeft: '1vh' }} value={lane} onChange={(event) => setLane(event.target.value)} />
              </span>
            </span>
            <Table handleRowDelete={handleRowDelete} updatePlayBackSpeed={updatePlayBackSpeed} updateBuffer={updateBuffer} timer={videoTimer} videoRef={videoRef} setTimer={setTimer} data={data} setData={setData} setStatus={setStatus} status={status} updateSeekPosition={updateSeekPosition} />
            <Button variant="secondary" style={{ display: 'flex', marginTop: '1rem' }} onClick={handleDeleteAll}>Delete All</Button>
            {/* <FontAwesomeIcon style={{}} onClick={() => console.log(false)} icon={faFloppyDisk} /> */}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}>
              <span style={{ display: 'flex' }}>
                Survey ID : <input type="text" style={{ width: '5.5vh', height: '4vh', marginRight: '7vh', marginLeft: '1vh' }} value={surveyId} onChange={(event) => setSurveyId(event.target.value)} />
              </span>
              <p style={{width: 'max-content', margin: '0 1rem 0 0'}}>Buffer : </p>
              <FontAwesomeIcon style={{ fontWeight: 'bold', fontSize: '1.5rem', marginRight: '1rem' }} onClick={() => updateBuffer(false)} icon={faMinus} />
              <FontAwesomeIcon style={{ fontWeight: 'bold', fontSize: '1.5rem' }} onClick={() => updateBuffer(true)} icon={faPlus} />
              <span style={{ display: 'flex', marginLeft: '6vh' }}>
                Direction : <input type="text" style={{ width: '19.5vh', height: '4vh', marginRight: '7vh', marginLeft: '1vh' }} value={direction} onChange={(event) => setDirection(event.target.value)} />
              </span>
            </div>
            <div style={{ width: 'max-content' }}>
              <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updatePlayBackSpeed(false)} icon={faAngleDoubleLeft} />
              {/* <input type="text" style={{marginRight: '1vh'}} name="timer" value={timer} onChange={(event) => (status === 'pause') && setTimer(event.target.value)} placeholder='hh:mm:ss' /> */}
              <input type="text" style={{marginRight: '1vh'}} name="timer" value={videoTimer} onChange={(event) => (status === 'pause') && setVideoTimer(event.target.value)} placeholder='hh:mm:ss' />
              <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updatePlayBackSpeed(true)} icon={faAngleDoubleRight} />
              <span style={{ width: '3rem', display: 'inline-flex' }} >&nbsp;{playBackSpeed}x&nbsp;</span>
              <FontAwesomeIcon style={{}} onClick={() => timer && setStatus( status === 'pause' ? 'play' : 'pause' )} icon={(status === 'pause') ? faPlay : faPause} />
              {/* <FontAwesomeIcon style={{marginLeft: '1vh', marginRight: '65vh'}} onClick={() => updateBuffer(true)} icon={faChevronUp} />
              <FontAwesomeIcon style={{marginLeft: '1vh', marginRight: '65vh'}} onClick={() => updateBuffer(false)} icon={faMinus} /> */}
              {/* <div>
              </div> */}
              {/* <ConvertToMP4Modal /> */}
              
              <input type="file" onChange={handleVideoUpload} />
              <br />
              {/* <video src={videoFilePath} /> */}
              {/* <ReactPlayer playing={status === 'play'} playbackRate={playBackSpeed} style={{maxHeight: '60vh', height: 'fit-content !important'}} url={[{
                src: videoFilePath,
                type: 'video/asf'}]} width="100%" height="100%" /> */}
            </div>
            <ReactPlayer ref={(playerRef) => setVideoRef(playerRef)} controls playing={status === 'play'} playbackRate={playBackSpeed*videoIntervalTimer} style={{maxHeight: '60vh', height: 'fit-content !important', marginBottom: '1rem'}} url={videoFilePath} width="100%" height="100%" />
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updateOnlyVideoTimerSpeed(false)} icon={faBackward} />
              <p style={{margin: 0}} >&nbsp;{videoIntervalTimer}x&nbsp;</p>
              <FontAwesomeIcon style={{marginLeft: '1vh', marginRight: '65vh'}} onClick={() => updateOnlyVideoTimerSpeed(true)} icon={faForward} />
              {/* <CSVLink filename={filename} data={data}><img src='./csv.png' style={{width: '50px'}} alt='Download as CSV' /></CSVLink> */}
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <img src='./csv.png' style={{width: '50px'}} alt='Download as CSV' onClick={()=> setShowModal(true)}/>
            </div>
          </div>
        </div>
      {/* </>) : <Login setLoggedIn={setLoggedIn} />} */}
    </div>
  );
}

export default App;
