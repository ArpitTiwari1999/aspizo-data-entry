import React, { useState } from "react";
function Table(props) {
    const [sampleDate, setSampleDate] = useState('');
    const [sampleClass, setSampleClass] = useState('');
    const [sampleAxels, setSampleAxels] = useState('');
    const [sampleSpeed, setSampleSpeed] = useState('');
    const renderTableHeader = () => {
        return [
            <th key='Id' style={{width: '2vh'}}>Id</th>,
            <th key='Date' style={{width: '11vh'}}>Date</th>,
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
        else if (parseInt(getClass) == 5 || parseInt(getClass) == 10) return '3';
        else if (parseInt(getClass) == 11) return '4';
        else if (parseInt(getClass) == 12 ) return '13';
        else return '';
    }
    const getAvgNumber = (min, max) => parseInt(min + (Math.random() * max));
    const getSpeed = (CLASS) => {
        const getClass = parseInt(CLASS);
        if(parseInt(getClass) === 1 ) return getAvgNumber(5,25);
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
        else if (parseInt(getClass) === 13) return getAvgNumber(10, 40);
        else if (parseInt(getClass) === 14) return getAvgNumber(5, 25);
        else return '';
    }
    const onKeyPressed = (event) => {
        if(event.keyCode === 13){
            if (props.timer === ''){
                alert('Please Enter Timer Data First');
                return;
            }
            let newData = [...props.data];
            if(newData.length) {
                const newElem = {ID: parseInt(newData[newData.length-1].ID) + 1, CLASS: sampleClass};
                newElem.AXELS = getAxels(sampleClass) ;
                newElem.TIME = props.timer.slice(0,8);
                newElem.DATE = sampleDate;
                newElem.SPEED = getSpeed(sampleClass);
                props.setData([...newData, newElem]);
            }
            else {
                props.setData([{ ID: '1', CLASS: sampleClass, AXELS: getAxels(sampleClass), TIME: props.timer.slice(0,8), DATE: sampleDate, SPEED: getSpeed(sampleClass) }]);
            }
            setSampleClass('');
        }
        else if(event.keyCode == 32){
            (props.timer !== "") && props.setStatus((props.status === 'pause') ? 'play' : 'pause');
        }
    }
    const renderTableData = () => {
        return props.data.map((unit) => {
           const { ID, DATE, CLASS, TIME, AXELS, SPEED } = unit;
           return (
              <tr key={ID}>
                 <td style={{width: '4.5vh'}}>{ID}</td>
                 <td><input tye="text" style={{width: '10.5vh'}} value={DATE} onChange={(event) => dataUpdate(event, ID, 'DATE')} /></td>
                 <td><input tye="text" style={{width: '5vh'}} value={CLASS} onChange={(event) => dataUpdate(event, ID, 'CLASS')} /></td>
                 <td><input tye="text" style={{width: '11.5vh'}} value={TIME} onChange={(event) => dataUpdate(event, ID, 'TIME')} /></td>
                 <td><input tye="text" style={{width: '5vh'}} value={AXELS} onChange={(event) => dataUpdate(event, ID, 'AXELS')} /></td>
                 <td><input tye="text" style={{width: '5vh'}} value={SPEED} onChange={(event) => dataUpdate(event, ID, 'SPEED')} /></td>
              </tr>
           )
        })
    }
    const renderEnterRow = () => {
        return (
            <tr>
               <td style={{width: '4.5vh'}}>[*]</td>
               <td><input tye="text" style={{width: '10.5vh'}} value={sampleDate} onChange={(event) => setSampleDate(event.target.value)} /></td>
               <td><input tye="text" style={{width: '5vh'}} value={sampleClass} onKeyDown={onKeyPressed} onChange={(event) => (props.timer !== "") && (event.target.value.slice(-1) !== " ") && setSampleClass(event.target.value)} /></td>
               <td><input tye="text" style={{width: '11.5vh'}} value='*' /></td>
               <td><input tye="text" style={{width: '5vh'}} value={sampleAxels} onChange={(event) => setSampleAxels(event.target.value)} /></td>
               <td><input tye="text" style={{width: '5vh'}} value={sampleSpeed} onChange={(event) => setSampleSpeed(event.target.value)} /></td>
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
            <div style={{ maxHeight: '68vh', overflow: 'auto' }}>
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