import React, { useEffect, useState } from 'react';
import timesheetStyles from '../pages/TimeSheet.module.css';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);
const projectlog = deta.Base('projects');

function TimeSheetModal({modal, modalState}) {

    // state to display the projects added
    const [entryProjectList, setEntryProjectList] = useState([{}]);

    // function to get projects for the dropdown
    const getEntryProject = async () => {
        let respProjectBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respProjectBody = items;
        setEntryProjectList(respProjectBody);
    };

    useEffect(() => {
        getEntryProject();
    }, []);

    return (
        <div className={timesheetStyles.entry_list}>
            <div className={modalStyles.submit}>
            <form
                action=''
                // onSubmit={}
                className={timesheetStyles.form}
            >
                    {/* date */}
                    <div className={timesheetStyles.date}>
                        <label className={timesheetStyles.label}>Date</label>
                        <input
                            type='date'
                            value={modal.date}
                            onChange={(e) => modalState((prev) => {
                                return ({...prev, date: e.target.value})
                            })}
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
                                value={modal.startTime}
                                onChange={(e) => modalState((prev) => {
                                return ({...prev, startTime: e.target.value})
                            })}
                            />
                        </div>

                        {/* end time */}
                        <div className={timesheetStyles.end}>
                            <label className={timesheetStyles.label}>End time</label>
                            <input
                                type='time'
                                name='time-end'
                                id='time-end'
                                value={modal.endTime}
                                onChange={(e) => modalState((prev) => {
                                return ({...prev, endTime: e.target.value})
                            })}
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
                            value={modal.work}
                            onChange={(e) => modalState((prev) => {
                                return ({...prev, work: e.target.value})
                            })}
                        />
                    </div>

                    {/* select/add project */}
                    <div className={timesheetStyles.project}>
                        <label className={timesheetStyles.label}>Project</label>
                        <select
                            name='projectData'
                            id='projectData'
                            placeholder='Select project'
                            value={modal.project}
                            onChange={(e) => modalState((prev) => {
                                return ({...prev, project: e.target.value})
                            })}
                        >
                            <option></option>
                            {entryProjectList.map((entryProject, index) => (
                                <option key={index}>
                                    {entryProject.project}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TimeSheetModal