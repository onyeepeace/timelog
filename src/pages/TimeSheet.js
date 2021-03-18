import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './TimeSheet.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const timelog = deta.Base('entries');

function Timesheet() {
    const [newDate, setNewDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [work, setWork] = useState('');

    const [isReady, setIsReady] = useState(false);
    const [entryList, setEntryList] = useState([{}]);

    const handleAddEntry = (e) => {
        e.preventDefault();
        if (!work || !newDate || !newStartTime || !newEndTime) {
            alert('fields cannot be blank');
        } else {
            const values = {
                work,
                date: newDate,
                startTime: newStartTime,
                endTime: newEndTime,
            };
            timelog.put(values);
        }
    };

    const getEntry = async () => {
        let respBody = {};
        const { value: items } = await timelog.fetch([]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    };

    const deleteToDo = async (tid) => {
        const res = await timelog.delete(tid);
        setTimeout(getEntry, 100);
    };

    useEffect(() => {
        getEntry();
    }, []);

    return (
        <Router>
            <main className='timesheet_main'>
                <div>
                    <form action='' onSubmit={handleAddEntry}>
                        {/* date */}

                        <input
                            type='date'
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />

                        {/* start time */}
                        <input
                            type='time'
                            name='time-start'
                            id='time-start'
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                        />

                        {/* end time */}
                        <input
                            type='time'
                            name='time-end'
                            id='time-end'
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                        />

                        {/* work notes */}
                        <input
                            type='text'
                            name='work'
                            id='work'
                            placeholder='what are you working on?'
                            value={work}
                            onChange={(e) => setWork(e.target.value)}
                        />

                        {/* select/add project */}
                        <select
                            name='select_project'
                            id='select_project'
                            placeholder='Select project...'
                        >
                            <option value='no_project' disabled>
                                No project
                            </option>
                        </select>

                        {/* play timer */}
                        <button type='button'>play timer...</button>

                        {/* restart timer */}
                        <button type='button'>restart the timer</button>

                        {/* Add new entry */}
                        <button type='submit'>Add entry</button>
                    </form>

                    {!isReady ? (
                        <p>No entries in this date range...</p>
                    ) : (
                        <div className=''>
                            {entryList.map((item) => (
                                <li
                                    key={item.key}
                                    onClick={() => deleteToDo(item.key)}
                                >
                                    <p>{item.date}</p>
                                    <p>{item.startTime}</p>
                                    <p>{item.endTime}</p>
                                    <p>{item.work}</p>
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </Router>
    );
}

export default Timesheet;
