import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import timesheetStyles from './TimeSheet.module.css';

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

    const handleAddEntry = (e) => {
        e.preventDefault();
        if (!work || !project || !newDate || !newStartTime || !newEndTime) {
            alert('fields cannot be blank');
        } else {
            const values = {
                work,
                project,
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

    const getEntryProject = async () => {
        let respProjectBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respProjectBody = items;
        setEntryProjectList(respProjectBody);
    };

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
                        {/* date */}
                        <div className={timesheetStyles.date}>
                            <label className={timesheetStyles.label}>
                                Date
                            </label>
                            <input
                                type='date'
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>

                        <div className={timesheetStyles.time}>
                            {/* start time */}
                            <div className={timesheetStyles.start}>
                                <label className={timesheetStyles.label}>
                                    Start time
                                </label>
                                <input
                                    type='time'
                                    name='time-start'
                                    id='time-start'
                                    value={newStartTime}
                                    onChange={(e) =>
                                        setNewStartTime(e.target.value)
                                    }
                                />
                            </div>

                            {/* end time */}
                            <div className={timesheetStyles.end}>
                                <label className={timesheetStyles.label}>
                                    End time
                                </label>
                                <input
                                    type='time'
                                    name='time-end'
                                    id='time-end'
                                    value={newEndTime}
                                    onChange={(e) =>
                                        setNewEndTime(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* work notes */}
                        <div className={timesheetStyles.note}>
                            <label className={timesheetStyles.label}>
                                Note
                            </label>
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
                            <label className={timesheetStyles.label}>
                                Project
                            </label>
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
                                    <option value={entryProject.project} />
                                ))}
                            </datalist>
                        </div>

                        <div className={timesheetStyles.timer}>
                            {/* play timer */}
                            <button
                                type='button'
                                className={timesheetStyles.play}
                            >
                                play timer...
                            </button>

                            {/* restart timer */}
                            <button
                                type='button'
                                className={timesheetStyles.reset}
                            >
                                restart the timer
                            </button>
                        </div>

                        {/* Add new entry */}
                        <button
                            type='submit'
                            className={timesheetStyles.submit}
                        >
                            Add entry
                        </button>
                    </form>

                    <div className={timesheetStyles.entries}>
                        {!isReady ? (
                            <p>No entries in this date range...</p>
                        ) : (
                            <div className=''>
                                {entryList.map((item) => (
                                    <div
                                        className={timesheetStyles.entry_list}
                                        key={item.key}
                                    >
                                        {/* <p>{item.date}</p> */}
                                        {/* start to end time, end time - start time, : button(modal) */}
                                        <div
                                            className={
                                                timesheetStyles.project_notes
                                            }
                                        >
                                            <p
                                                className={
                                                    timesheetStyles.newProject
                                                }
                                            >
                                                {item.project}
                                            </p>
                                            <p
                                                className={
                                                    timesheetStyles.newWork
                                                }
                                            >
                                                {item.work}
                                            </p>
                                        </div>

                                        <div
                                            className={
                                                timesheetStyles.project_duration
                                            }
                                        >
                                            <div
                                                className={
                                                    timesheetStyles.time_frame
                                                }
                                            >
                                                <p>
                                                    {item.startTime} -{' '}
                                                    {item.endTime}
                                                </p>
                                            </div>

                                            <div
                                                className={
                                                    timesheetStyles.time_spent
                                                }
                                            >
                                                <p>
                                                    {item.startTime} -{' '}
                                                    {item.endTime}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className={timesheetStyles.delete}
                                            onClick={() => {
                                                deleteEntry(item.key);
                                                alert('entry deleted');
                                            }}
                                        >
                                            Delete entry
                                        </button>
                                        <hr />
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
