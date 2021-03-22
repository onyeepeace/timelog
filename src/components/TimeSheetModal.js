import React, { useEffect, useState } from 'react';
import timesheetStyles from '../pages/TimeSheet.module.css';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);
const timelog = deta.Base('entries');
const projectlog = deta.Base('projects');

function TimeSheetModal({tid}) {

// state for the form inputs
const [newDate, setNewDate] = useState('');
const [newStartTime, setNewStartTime] = useState('');
const [newEndTime, setNewEndTime] = useState('');
const [project, setProject] = useState('');
const [work, setWork] = useState('');

// state to display the projects added
const [entryProjectList, setEntryProjectList] = useState([{}]);

const [entryList, setEntryList] = useState([{
    newDate: '',
    newStartTime: '',
    newEndTime: '',
    project: '',
    work: ''
}]);

// function to get projects for the dropdown
const getEntryProject = async () => {
    let respProjectBody = {};
    const { value: items } = await projectlog.fetch([]).next();
    respProjectBody = items;
    setEntryProjectList(respProjectBody);
};

const getSelectedEntry = async (tid) => {
    await timelog.get(tid);
}
getSelectedEntry(tid)

useEffect(() => {
    getEntryProject();
}, []);

    return (
        <div className={timesheetStyles.entry_list}>
            {/* <Example closeModal={handleClose} footer={footer}> */}
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
                                value={entryList.newDate}
                                onChange={(e) => setEntryList((prev) => (
                                    {...prev, newDate: e.target.value}
                                ))}
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
                                    onChange={(e) => setNewStartTime(e.target.value)}
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
                                    onChange={(e) => setNewEndTime(e.target.value)}
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
                    </form>
                </div>
            {/* </Example> */}
        </div>
    )
}

export default TimeSheetModal