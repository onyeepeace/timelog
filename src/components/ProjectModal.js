import React, { useEffect, useState } from 'react';
import projectStyles from '../pages/Project.module.css';
import Modal from '../components/Modal';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);
const projectlog = deta.Base('projects');

function ProjectModal({tid, status}) {
    // state to display projects added
    const [projectList, setProjectList] = useState([{}]);

    const [projectItem, setProjectItem] = useState({
        color: '',
        project: '',
        parent: ''
    });

    const getSelectedProject = async (tid) => {
        const res = await projectlog.get(tid);
        setProjectItem(res)
    }
    
    // function to close the modal
    const handleClose = () => {
        document.body.style = 'overflow: auto';
        status()
    };
    
    //send edited data to the database
    const handleEdit = (tid) => {
        projectlog.put(projectItem, tid);
        alert('project edited')
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

    // function to get projects added to the database
    const getProject = async () => {
        let respBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respBody = items;
        setProjectList(respBody);
    };
    
    useEffect(() => {
        getProject();
        getSelectedProject(tid)
    }, [tid]);

    return (
        <Modal closeModal={handleClose} footer={footer}>
            <div className={modalStyles.submit}>
                <form
                    action=''
                    // onSubmit={}
                    className={projectStyles.form}
                >
                    {/* color */}
                    <div className={projectStyles.color_div}>
                        <label className={projectStyles.label}>Color</label>
                        <input
                            className={projectStyles.color}
                            type='color'
                            value={projectItem.color}
                            onChange={(e) => setProjectItem((prev) => {
                                return ({...prev, color: e.target.value})
                            })}
                        />
                    </div>

                    {/* project name */}
                    <div className={projectStyles.project_name_form}>
                        <label className={projectStyles.label}>
                            Project name
                        </label>
                        <input
                            type='text'
                            value={projectItem.project}
                            onChange={(e) => setProjectItem((prev) => {
                                return ({...prev, project: e.target.value})
                            })}
                        />
                    </div>

                    {/* select/add parent */}
                    <div className={projectStyles.project}>
                        <label className={projectStyles.label}>Parent</label>

                        <select
                            name='select_parent'
                            id='select_parent'
                            placeholder='Select parent...'
                            value={projectItem.parent}
                            onChange={(e) => setProjectItem((prev) => {
                                return ({...prev, parent: e.target.value})
                            })}
                        >
                            <option value='no_parent' defaultChecked>
                                No parent
                            </option>
                            {projectList.map((singleParent, index) => (
                                <option key={index}>
                                    {singleParent.project}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default ProjectModal