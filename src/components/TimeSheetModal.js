import React, { useEffect, useState } from 'react';
import timesheetStyles from '../pages/TimeSheet.module.css';
import Modal from '../components/Modal';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);
const timelog = deta.Base('entries');
const projectlog = deta.Base('projects');

function TimeSheetModal({tid, status}) {

// state to display the projects added
const [entryProjectList, setEntryProjectList] = useState([{}]);

const [entryList, setEntryList] = useState({
    date: '',
    startTime: '',
    endTime: '',
    project: '',
    work: ''
});

// function to get projects for the dropdown
const getEntryProject = async () => {
    let respProjectBody = {};
    const { value: items } = await projectlog.fetch([]).next();
    respProjectBody = items;
    setEntryProjectList(respProjectBody);
};

const getSelectedEntry = async (tid) => {
    const res = await timelog.get(tid);
    setEntryList(res)
}

// function to close the modal
const handleClose = () => {
    document.body.style = 'overflow: auto';
    status()
};

//send edited data to the database
const handleEdit = (tid) => {
    timelog.put(entryList, tid);
    alert('entry edited')
}

// footer for the modal
const footer = (
    <div className={modalStyles.footer_btns}>
        <button className={modalStyles.okBtn} onClick={() => handleEdit(tid)}>
            Save
        </button>
        <button className={modalStyles.okBtn} onClick={handleClose}>
            Cancel
        </button>
    </div>
);

useEffect(() => {
    getEntryProject();
    getSelectedEntry(tid)
}, [tid]);

    return (
        <div className={timesheetStyles.entry_list}>
                <Modal closeModal={handleClose} footer={footer}>
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
                                    value={entryList.date}
                                    onChange={(e) => setEntryList((prev) => {
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
                                        value={entryList.startTime}
                                        onChange={(e) => setEntryList((prev) => {
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
                                        value={entryList.endTime}
                                        onChange={(e) => setEntryList((prev) => {
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
                                    value={entryList.work}
                                    onChange={(e) => setEntryList((prev) => {
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
                                    value={entryList.project}
                                    onChange={(e) => setEntryList((prev) => {
                                        return ({...prev, project: e.target.value})
                                    })}
                                >
                                    {entryProjectList.map((entryProject, index) => (
                                        <option key={index}>
                                            {entryProject.project}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                </Modal>
        </div>
    )
}

export default TimeSheetModal