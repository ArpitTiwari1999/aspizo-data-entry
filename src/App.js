import './App.css';
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Table from './table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from "react-csv";

function App() {
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [timer, setTimer] = useState('');
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [status, setStatus] = useState('pause');
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
  }, [status, playBackSpeed]);
  const updatePlayBackSpeed = (up) => {
    if(up){
      if(playBackSpeed > 0.75) setPlayBackSpeed(playBackSpeed*2);
      else setPlayBackSpeed(playBackSpeed + 0.25);
    }
    else {
      if(playBackSpeed > 1) setPlayBackSpeed(playBackSpeed/2);
      else setPlayBackSpeed(playBackSpeed - 0.25);
    }
  }
  return (
    <div className="App">
      <div><h1>Aspizo Data Entry Software</h1></div>
      <div className="App-body">
        <div>
          <h3>Entry Area</h3>
          <Table timer={timer} setTimer={setTimer} data={data} setData={setData} setStatus={setStatus} status={status} />
        </div>
        <div>
          <input type="text" style={{marginRight: '1vh'}} name="timer" value={timer.slice(0,8)} onChange={(event) => (status === 'pause') && setTimer(event.target.value + ':00')} placeholder='hh:mm:ss' /><FontAwesomeIcon style={{marginRight: '29vh'}} onClick={() => timer && setStatus( status === 'pause' ? 'play' : 'pause' )} icon={(status === 'pause') ? faPlay : faPause} />
          <input type="file" onChange={handleVideoUpload} />
          <br />
          <ReactPlayer playing={status === 'play'} playbackRate={playBackSpeed} style={{maxHeight: '60vh', height: 'fit-content !important'}} url={videoFilePath} width="100%" height="100%" />
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <FontAwesomeIcon style={{marginRight: '1vh'}} onClick={() => updatePlayBackSpeed(false)} icon={faBackward} />
            <p style={{margin: 0}} >&nbsp;{playBackSpeed}x&nbsp;</p>
            <FontAwesomeIcon style={{marginLeft: '1vh', marginRight: '65vh'}} onClick={() => updatePlayBackSpeed(true)} icon={faForward} />
            <CSVLink filename='data.csv' data={data}><img src='./csv.png' style={{width: '50px'}} alt='Download CSV' /></CSVLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
