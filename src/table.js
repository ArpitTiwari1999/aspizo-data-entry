import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Table(props) {
    const [sampleClass, setSampleClass] = useState('');
    const [sampleAxels, setSampleAxels] = useState('');
    const [sampleSpeed, setSampleSpeed] = useState('');
    const classRef = useRef(null);
    useEffect(() => {
        if(props.data.length) {
            console.log('step1');
            console.log(props.data);
            if([11, 5].includes(parseInt(props.data[props.data.length-1]['CLASS']))) {
                console.log('step1');
                props.data[props.data.length-1].axelRef.focus()
            }
        }
    }, [props.data.length]);
    const renderTableHeader = () => {
        return [
            <th key='Id' style={{width: '2vh'}}>Id</th>,
            // <th key='Date' style={{width: '11vh'}}>Date</th>,
            <th key='Class' style={{width: '6vh'}}>Class</th>,
            <th key='Time' style={{width: '12.5vh'}}>Time</th>,
            <th key='Axels' style={{width: '6vh'}}>Axels</th>,
            <th key='Speed' style={{width: '5vh'}}>Speed</th>
        ];
    }
    const dataUpdate = (event, ID, keyName) => {
        let newData = [...props.data];
        newData[ID - 1][keyName] = event.target.value;
        props.setData(newData);
    }
    const getAxels = (CLASS) => {
        const getClass = parseInt(CLASS);
        if( (parseInt(getClass) > 0 && parseInt(getClass) < 5) || (parseInt(getClass) > 5 && parseInt(getClass) < 10) || (parseInt(getClass) > 12 && parseInt(getClass) < 15) ) return '2';
        else if (parseInt(getClass) === 10) return '3';
        else if (parseInt(getClass) === 5 || parseInt(getClass) === 11) return '';
        else if (parseInt(getClass) === 12 ) return '13';
        else return '';
    }
    const getAvgNumber = (min, max) => {
        const avgNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return avgNumber;
    };
    const getSpeed = (CLASS) => {
        const getClass = parseInt(CLASS);
        if(parseInt(getClass) === 1 ) return getAvgNumber(7,25);
        else if (parseInt(getClass) === 2) return getAvgNumber(30,80);
        else if (parseInt(getClass) === 3) return getAvgNumber(30, 60);
        else if (parseInt(getClass) === 4 ) return getAvgNumber(15, 35);
        else if (parseInt(getClass) === 5) return getAvgNumber(15, 35);
        else if (parseInt(getClass) === 6) return getAvgNumber(30, 100);
        else if (parseInt(getClass) === 7) return getAvgNumber(30, 100);
        else if (parseInt(getClass) === 8) return getAvgNumber(30, 100);
        else if (parseInt(getClass) === 9) return getAvgNumber(30, 80);
        else if (parseInt(getClass) === 10) return getAvgNumber(20, 70);
        else if (parseInt(getClass) === 11) return getAvgNumber(20, 70);
        else if (parseInt(getClass) === 12) return getAvgNumber(15, 25);
        else if (parseInt(getClass) === 13) return getAvgNumber(7, 25);
        else if (parseInt(getClass) === 14) return getAvgNumber(10, 40);
        else return '';
    }
    const manageDigits = (number) => (number.length > 1) ? number : '0'+number;
    const onKeyPressed = (event) => {
        if(event.keyCode === 13){
            if (props.timer === ''){
                alert('Please Enter Timer Data First');
                return;
            }
            let newData = [...props.data];
            if(newData.length) {
                const newElem = {ID: parseInt(newData[newData.length-1].ID) + 1, CLASS: sampleClass};
                newElem.AXELS = getAxels(sampleClass);
                const newTimer = props.timer.split(':');
                // newElem.TIME = manageDigits(newTimer[0])+':'+manageDigits(newTimer[1])+':'+manageDigits(newTimer[2]);
                const currentTime = props.videoRef.getCurrentTime();
                const min = parseInt(currentTime/60);
                const sec = parseInt(currentTime-(min*60));
                newElem.TIME = manageDigits(newTimer[0])+':'+manageDigits(min.toString())+':'+manageDigits(sec.toString());
                newElem.axelRef = null;
                newElem.SPEED = getSpeed(sampleClass);
                props.setData([...newData, newElem]);
                // console.log(sampleClass);
                // if([11, 5].includes(parseInt(sampleClass))) {
                //     console.log('sampleClass');
                //     setTimeout(() => props.data[props.data.length-1].axelRef.focus(), 1000);
                // }
            }
            else {
                const newTimer = props.timer.split(':');
                const currentTime = props.videoRef.getCurrentTime();
                const min = parseInt(currentTime/60);
                const sec = parseInt(currentTime-(min*60));
                props.setData([{ ID: '1', CLASS: sampleClass, AXELS: getAxels(sampleClass), TIME: newTimer[0]+':'+manageDigits(min.toString())+':'+manageDigits(sec.toString()), SPEED: getSpeed(sampleClass), axelRef: null }]);
                // if([11, 5].includes(parseInt(sampleClass))) {
                //     setTimeout(() => props.data[props.data.length-1].axelRef.focus(), 1000);
                // }
            }
            setSampleClass('');
        }
        else if(event.keyCode == 37) props.updateSeekPosition('left');
        else if(event.keyCode == 39) props.updateSeekPosition('right');
        else if(event.keyCode == 189) props.updatePlayBackSpeed(false);
        else if(event.keyCode == 187) props.updatePlayBackSpeed(true);
        else if(event.keyCode == 38) props.updateBuffer(true);
        else if(event.keyCode == 40) props.updateBuffer(false);
        else if(event.keyCode == 32){
            (props.timer !== "") && props.setStatus((props.status === 'pause') ? 'play' : 'pause');
        }
    }
    const isEventKeyCodeAllowed = (keyCode) => !([37, 39, 189, 187, 38, 40, 32].includes(keyCode));
    const renderTableData = () => {
        return props.data.map((unit) => {
           const { ID, DATE, CLASS, TIME, AXELS, SPEED } = unit;
           return (
              <tr key={ID}>
                 <td style={{width: '4.5vh'}}>{ID}</td>
                 {/* <td><input type="text" style={{width: '10.5vh'}} value={DATE} onChange={(event) => dataUpdate(event, ID, 'DATE')} /></td> */}
                 <td><input type="text" style={{width: '5vh'}} value={CLASS} onChange={(event) => dataUpdate(event, ID, 'CLASS')} /></td>
                 <td><input type="text" style={{width: '11.5vh'}} value={TIME} onChange={(event) => dataUpdate(event, ID, 'TIME')} /></td>
                 <td><input type="text" style={{width: '5vh'}} ref={e => unit.axelRef = e} value={AXELS} onKeyDown={(event)=> {
                    console.log(1);
                        if(event.keyCode === 13){
                            console.log(2);
                            classRef.current.focus();
                        }
                        console.log(3);
                    }} onChange={(event) => dataUpdate(event, ID, 'AXELS')} /></td>
                 <td><input type="text" style={{width: '5vh'}} value={SPEED} onChange={(event) => dataUpdate(event, ID, 'SPEED')} /><FontAwesomeIcon style={{ position: 'relative', left: '4vh', cursor: 'pointer' }} onClick={() => props.handleRowDelete(ID)} icon={faTimes} /></td>
                 {/* <FontAwesomeIcon style={{}} onClick={() => console.log(false)} icon={faFloppyDisk} /> */}
              </tr>
           )
        })
    }
    const renderEnterRow = () => {
        return (
            <tr>
               <td style={{width: '2vh'}}>[*]</td>
               {/* <td><input type="text" style={{width: '10.5vh'}} value={sampleDate} onChange={(event) => setSampleDate(event.target.value)} /></td> */}
               <td><input type="text" style={{width: '6vh'}} ref={classRef} value={sampleClass} onKeyDown={onKeyPressed} onChange={(event) => (props.timer !== "") && (event.target.value.slice(-1) !== " ") && isEventKeyCodeAllowed(event.keyCode) && setSampleClass(event.target.value)} /></td>
               <td><input type="text" style={{width: '12.5vh'}} defaultValue='*' /></td>
               <td><input type="text" style={{width: '6vh'}} defaultValue='*' /></td>
               <td><input type="text" style={{width: '5vh'}} defaultValue='*' /></td>
            </tr>
        )
    }
    return (
        <>
            <table className='students'>
                <tbody>
                    <tr>{renderTableHeader()}</tr>
                </tbody>
            </table>
            <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
                <table className='students'>
                    <tbody>
                    {renderTableData()}
                    {renderEnterRow()}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default Table;