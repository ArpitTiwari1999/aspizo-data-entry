import './App.css';
import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import Table from './table';
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForward, faBackward, faAngleDoubleRight, faAngleDoubleLeft, faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from "react-csv";
// import ConvertToMP4Modal from './ConvertToMP4Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoRef, setVideoRef] = useState();
  const [timer, setTimer] = useState('');
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [status, setStatus] = useState('pause');
  const [videoIntervalTimer, setVideoIntervalTimer] = useState(1);
  const [loggedIn, setLoggedIn] = useState(true);
  const handleVideoUpload = (event) => {
    const [file] = event.target.files;
    setVideoFilePath(URL.createObjectURL(file));
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    let prevTimer = false;
    let newTimer = timer;
    let runInterval = setInterval(() => {
      if(status === 'play') {
        const [hh, mm, ss, ms] = (prevTimer) ? newTimer.split(':') : timer.split(':');
        if(ms < 99) newTimer = hh+':'+mm+':'+ss+':'+(parseFloat(ms)+playBackSpeed)
        else{
          if(parseInt(ss) != 59) newTimer = (parseInt(ss) < 9) ? hh+':'+mm+':0'+(parseInt(ss)+1)+':00.0' : hh+':'+mm+':'+(parseInt(ss)+1)+':00.0';
          else {
            if(parseInt(mm) != 59) newTimer = (parseInt(mm) < 9) ? hh+':0'+(parseInt(mm)+1)+':00'+':00.0' : hh+':'+(parseInt(mm)+1)+':00'+':00.0';
            else {
              if(parseInt(hh) != 59) newTimer = (parseInt(hh) < 9) ? '0'+(parseInt(hh)+1)+':00'+':00'+':00.0' : (parseInt(hh)+1)+':00'+':00'+':00.0';
              else newTimer = '00:00:00:00.0';
            }
          }
        }
        prevTimer = true;
        setTimer(newTimer);
      }
      else {
        prevTimer = false;
      }
    }, 10);
    return () => clearInterval(runInterval);
  }, [status]);
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
    const [hh, mm, ss, ms] = timer.split(':');
    let newTimer = timer;
    if(value > 0){
      if((parseInt(ss)+value) < 60) newTimer = hh+':'+mm+':'+(parseInt(ss)+value)+':'+ms;
      else if(parseInt(mm)+1 < 60) newTimer = hh+':'+(parseInt(mm)+1)+':'+(parseInt(ss)+value-60)+':'+ms;
      else if(parseInt(hh) < 60) newTimer = (parseInt(hh)+1)+':00'+':'+(parseInt(ss)+value-60)+':'+ms;
    }
    else {
      if((parseInt(ss)+value) >= 0) newTimer = hh+':'+mm+':'+(parseInt(ss)+value)+':'+ms;
      else if(parseInt(mm) > 0) newTimer = hh+':'+(parseInt(mm)-1)+':'+(60+parseInt(ss)+value)+':'+ms;
      else if(parseInt(hh) > 0) newTimer = (parseInt(hh)-1)+':59'+':'+(60+parseInt(ss)+value)+':'+ms;
    }
    setTimer(newTimer);
  }
  const updateSeekPosition = async (direction) => {
    const currentSeek = videoRef.getCurrentTime();
    if(direction === 'left' && currentSeek > 2) {
      updateTimer(-2);
      videoRef.seekTo(currentSeek-2, 'seconds');
    }
    else if(direction === 'right' && currentSeek+3 < videoRef.getDuration()) {
      updateTimer(2);
      videoRef.seekTo(currentSeek+2, 'seconds');
    }
  }
  return (
    <div className="App">
      {/* {loggedIn ?  (<> */}
      <div><h1>Aspizo Data Entry Software</h1></div>
        <div className="App-body">
          <div>
            <h3>Entry Area</h3>
            <Table timer={timer} setTimer={setTimer} data={data} setData={setData} setStatus={setStatus} status={status} updateSeekPosition={updateSeekPosition} />
          </div>
          <div>
            <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updatePlayBackSpeed(false)} icon={faAngleDoubleLeft} />
            <input type="text" style={{marginRight: '1vh'}} name="timer" value={timer} onChange={(event) => (status === 'pause') && setTimer(event.target.value)} placeholder='hh:mm:ss' />
            <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updatePlayBackSpeed(true)} icon={faAngleDoubleRight} />
            <span style={{marginRight: '5vh'}} >&nbsp;{playBackSpeed}x&nbsp;</span>
            <FontAwesomeIcon style={{marginRight: '29vh'}} onClick={() => timer && setStatus( status === 'pause' ? 'play' : 'pause' )} icon={(status === 'pause') ? faPlay : faPause} />
            {/* <div>
            </div> */}
            {/* <ConvertToMP4Modal /> */}
            <input type="file" onChange={handleVideoUpload} />
            <br />
            {/* <video src={videoFilePath} /> */}
            {/* <ReactPlayer playing={status === 'play'} playbackRate={playBackSpeed} style={{maxHeight: '60vh', height: 'fit-content !important'}} url={[{
              src: videoFilePath,
              type: 'video/asf'}]} width="100%" height="100%" /> */}
            <ReactPlayer ref={(playerRef) => setVideoRef(playerRef)} controls playing={status === 'play'} playbackRate={playBackSpeed*videoIntervalTimer} style={{maxHeight: '60vh', height: 'fit-content !important'}} url={videoFilePath} width="100%" height="100%" />
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updateOnlyVideoTimerSpeed(false)} icon={faBackward} />
              <p style={{margin: 0}} >&nbsp;{videoIntervalTimer}x&nbsp;</p>
              <FontAwesomeIcon style={{marginLeft: '1vh', marginRight: '65vh'}} onClick={() => updateOnlyVideoTimerSpeed(true)} icon={faForward} />
              <CSVLink filename='data.csv' data={data}><img src='./csv.png' style={{width: '50px'}} alt='Download CSV' /></CSVLink>
            </div>
          </div>
        </div>
      {/* </>) : <Login setLoggedIn={setLoggedIn} />} */}
    </div>
  );
}

export default App;
