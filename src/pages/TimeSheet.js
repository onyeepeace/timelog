import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import timesheetStyles from './TimeSheet.module.css';
import Example from '../components/Modal';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const timelog = deta.Base('entries');
const projectlog = deta.Base('projects');

function Timesheet() {
    const [newDate, setNewDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [project, setProject] = useState('');
    const [work, setWork] = useState('');

    const [isReady, setIsReady] = useState(false);
    const [entryList, setEntryList] = useState([{}]);
    const [entryProjectList, setEntryProjectList] = useState([{}]);

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

        let starting = newStartTime
        let ending = newEndTime
        if (starting < 0)
        starting = starting + 24;
        if (ending < 0)
        ending = ending + 24;
        if (!work || !project || !newDate || !newStartTime || !newEndTime) {
            alert('fields cannot be blank');
        } else {
            const values = {
                work,
                project,
                date: newDate,
                startTime: starting,
                endTime: ending,
                duration: duration
            };
            timelog.put(values);
            setNewDate('')
            setWork('')
            setProject('')
            setNewEndTime('')
            setNewStartTime('')
        }
    };

    const getEntry = async () => {
        let respBody = {};
        const { value: items } = await timelog.fetch([]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    };

    const getEntryProject = async () => {
        let respProjectBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respProjectBody = items;
        setEntryProjectList(respProjectBody);
    };

    let projectColor
    {entryProjectList.map((entryProject) => (
        projectColor = entryProject.color                      
    ))}

    // i want to edit the entries database
    const [status, setStatus] = useState(false);

    const handleOpen = () => {
        setStatus(true);
        document.body.style = 'overflow: hidden';
    };

    const handleClose = () => {
        setStatus(false);
        document.body.style = 'overflow: auto';
    };

    const footer = (
        <>
        <button className={modalStyles.okBtn} onClick={handleClose}>
            Save
        </button>
        <button className={modalStyles.okBtn} onClick={handleClose}>
            Close
        </button>
        </>
    );

    const deleteEntry = async (tid) => {
        const res = await timelog.delete(tid);
        setTimeout(getEntry, 100);
    };

    useEffect(() => {
        getEntry();
        getEntryProject();
    }, []);

    return (
        <Router>
            <main className={timesheetStyles.timesheet_main}>
                <div className={timesheetStyles.container}>
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
                                    {entryProjectList.map((entryProject) => (
                                        <option value={entryProject.project} key={entryProject.key} />
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

                                {/* restart timer */}
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

                    <div className={timesheetStyles.entries}>
                        {!isReady ? (
                            <p>No entries in this date range...</p>
                        ) : (
                            <div className=''>
                                {entryList.map((item) => (
                                    <div className={timesheetStyles.entry_list} key={item.key}>
                                        {/* <p>{item.date}</p> */}
                                        {/* start to end time, end time - start time, : button(modal) */}
                                        <div className={timesheetStyles.project_notes}>
                                            <p className={timesheetStyles.newProject} style={{backgroundColor: projectColor}}>
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
                                                className={timesheetStyles.edit} onClick={() => handleOpen()}>
                                                Edit entry
                                            </button>

                                            {status && (
                                                <Example closeModal={handleClose} footer={footer}> 
                                                    <div className={modalStyles.submit}>
                                                    <form
                                                        action=''
                                                        onSubmit={handleAddEntry}
                                                        className={timesheetStyles.form}
                                                    >
                                                            {/* date */}
                                                            <div className={timesheetStyles.date}>
                                                                <label className={timesheetStyles.label}>Date</label>
                                                                <input
                                                                    type='date'
                                                                    value={item.date}
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
                                                                        value={item.startTime}
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
                                                                        value={item.endTime}
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
                                                                    value={item.work}
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
                                                                    value={item.project}
                                                                    onChange={(e) => setProject(e.target.value)}
                                                                />
                                                                <datalist id='projectDataList'>
                                                                    {entryProjectList.map((entryProject) => (
                                                                        <option value={entryProject.project} key={entryProject.key} />
                                                                    ))}
                                                                </datalist>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Example>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </Router>
    );
}

export default Timesheet;
