/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import timesheetStyles from './TimeSheet.module.css';
import Example from '../components/Modal';
import modalStyles from '../components/Modal.module.css';
import TimeSheetModal from '../components/TimeSheetModal';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const timelog = deta.Base('entries');
const projectlog = deta.Base('projects');

function Timesheet() {
    // state for the form inputs
    const [newDate, setNewDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [project, setProject] = useState('');
    const [work, setWork] = useState('');

    // state to display the entries added
    const [isReady, setIsReady] = useState(false);
    const [entryList, setEntryList] = useState([{}]);
    const [entryProjectList, setEntryProjectList] = useState([{}]);

    // state to sort the entries added
    const [today, setToday] = useState(false);
    const [thisWeek, setThisWeek] = useState(false);
    
    // state to open the modal and edit an entry
    const [status, setStatus] = useState(false);
    const [singleEntry, setSingleEntry] = useState({});

    const handleAddEntry = async (e) => {
        e.preventDefault();
        let duration
        let durationStart = newStartTime.split(":")
        let durationEnd = newEndTime.split(":")
        let time1 = new Date(0, 0, 0, durationStart[0], durationStart[1], 0);
        let time2 = new Date(0, 0, 0, durationEnd[0], durationEnd[1], 0);
        var diff = time2.getTime() - time1.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        if (hours < 0)
        hours = hours + 12;
        duration = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
        
        if (!work || !project || !newDate || !newStartTime || !newEndTime) {
            alert('fields cannot be blank');
        } else {
            const values = {
                work,
                project,
                date: newDate,
                startTime: newStartTime,
                endTime: newEndTime,
                duration: duration
            };
            // adds entries to the database
            timelog.put(values);

            // clears the form fields
            setNewDate('')
            setWork('')
            setProject('')
            setNewEndTime('')
            setNewStartTime('')
        }
    };

    // function to get projects added to the database
    const getEntryProject = async () => {
        let respProjectBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respProjectBody = items;
        setEntryProjectList(respProjectBody);
    };

    // filters entries by today
    const handleToday = async () => {
        setToday(true)
        let respBody = {}
        const {value: items} = await timelog.fetch([{"date": new Date().toISOString().slice(0, 10)
        }]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    }

    // calculates days for filter
    const calculateDate = (days) => {
        var someDate = new Date();
        someDate.setDate(someDate.getDate() + days);
        someDate.toISOString().slice(0,10);
    }

    // filters entries by this week
    const handleThisWeek = async () => {
        setThisWeek(true)
        let respBody = {}
        const {value: items} = await timelog.fetch([{"date": calculateDate(7)
        }]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    }

    const editEntry = async (tid) => {
        const res = await timelog.get(tid);
        setSingleEntry(res);
    }

    // function to open the modal
    const handleOpen = (tid) => {
        setStatus(true);
        // editEntry(tid)
        document.body.style = 'overflow: hidden';
    };

    // function to close the modal
    const handleClose = () => {
        setStatus(false);
        document.body.style = 'overflow: auto';
    };

    // footer for the modal
    const footer = (
        <>
            <button className={modalStyles.okBtn} >
                Save
            </button>
            <button className={modalStyles.okBtn} onClick={handleClose}>
                Close
            </button>
        </>
    );

    const deleteEntry = async (tid) => {
        await timelog.delete(tid);
        setTimeout(handleToday, 100);
    };

    useEffect(() => {
        getEntryProject();
    }, []);

    return (
        <Router>
            <main className={timesheetStyles.timesheet_main}>
                <div className={timesheetStyles.container}>
                    {/* form to add entries */}
                    <form
                        action=''
                        onSubmit={handleAddEntry}
                        className={timesheetStyles.form}
                    >
                        <div className={timesheetStyles.all_inputs}>
                            {/* date */}
                            <div className={timesheetStyles.date}>
                                <label className={timesheetStyles.label}>Date</label>
                                <input
                                    type='date'
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>

                            <div className={timesheetStyles.time}>
                                {/* start time */}
                                <div className={timesheetStyles.start}>
                                    <label className={timesheetStyles.label}>Start time</label>
                                    <input
                                        type='time'
                                        name='time-start'
                                        id='time-start'
                                        value={newStartTime}
                                        onChange={(e) =>setNewStartTime(e.target.value)}
                                    />
                                </div>

                                {/* end time */}
                                <div className={timesheetStyles.end}>
                                    <label className={timesheetStyles.label}>End time</label>
                                    <input
                                        type='time'
                                        name='time-end'
                                        id='time-end'
                                        value={newEndTime}
                                        onChange={(e) =>setNewEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* work notes */}
                            <div className={timesheetStyles.note}>
                                <label className={timesheetStyles.label}>Note</label>
                                <input
                                    type='text'
                                    name='work'
                                    id='work'
                                    placeholder='what are you working on?'
                                    value={work}
                                    onChange={(e) => setWork(e.target.value)}
                                />
                            </div>

                            {/* select/add project */}
                            <div className={timesheetStyles.project}>
                                <label className={timesheetStyles.label}>Project</label>
                                <input
                                    name='projectData'
                                    id='projectData'
                                    list='projectDataList'
                                    placeholder='Select project'
                                    value={project}
                                    onChange={(e) => setProject(e.target.value)}
                                />
                                <datalist id='projectDataList'>
                                    {entryProjectList.map((entryProject, index) => (
                                        <option value={entryProject.project} key={index} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className={timesheetStyles.all_buttons}>
                            <div className={timesheetStyles.timer}>
                                {/* play timer */}
                                <button type='button' className={timesheetStyles.play}>
                                    play timer
                                </button>

                                {/* reset timer */}
                                <button type='button' className={timesheetStyles.reset}>
                                    reset timer
                                </button>
                            </div>

                            {/* Add new entry */}
                            <button type='submit' className={timesheetStyles.submit}>
                                Add entry
                            </button>
                        </div>
                    </form>

                    {/* displays the entries added */}
                    <div className={timesheetStyles.entries}>
                        <button onClick={handleToday}>Today</button>
                        <button onClick={handleThisWeek}>This Week</button>
                        {(today || thisWeek) && (
                            <>
                                {!isReady ? (
                                    <p>No entries in this date range...</p>
                                ) : (
                                    <div className=''>
                                        {entryList.map((item, index) => (
                                            <div className={timesheetStyles.entry_list} key={index}>
                                                <p>{item.date}</p>
                                                <div className={timesheetStyles.project_notes}>
                                                    <p className={timesheetStyles.newProject} style={{backgroundColor: ''}}>
                                                        {item.project}
                                                    </p>
                                                    <p className={timesheetStyles.newWork}>
                                                        {item.work}
                                                    </p>
                                                </div>

                                                <div className={timesheetStyles.project_duration}>
                                                    <div className={timesheetStyles.time_frame}>
                                                        <p>
                                                            {item.startTime} -{' '} {item.endTime}
                                                        </p>
                                                    </div>

                                                    <div className={timesheetStyles.time_spent}>
                                                        <p>
                                                            {item.duration}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className={timesheetStyles.action_buttons}>
                                                    <button 
                                                    className={timesheetStyles.delete}
                                                        onClick={() => {
                                                            deleteEntry(item.key);
                                                            alert('entry deleted');
                                                        }}
                                                    >
                                                        Delete entry
                                                    </button>

                                                    <button
                                                        className={timesheetStyles.edit} 
                                                        onClick={() => {
                                                            handleOpen(item.key)
                                                            editEntry(item.key)
                                                        }}
                                                    >
                                                        Edit entry
                                                    </button>
                                                </div>

                                                {/* modal to edit entries */}
                                                {status && (
                                                    <Example closeModal={handleClose} footer={footer}>
                                                        <TimeSheetModal tid={item.key} />
                                                    </Example>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </Router>
    );
}

export default Timesheet;
