import React, { useEffect, useState } from 'react';
import projectStyles from '../pages/Project.module.css';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);
const projectlog = deta.Base('projects');

function ProjectModal({modal, modalState}) {
    // state to display projects added
    const [projectList, setProjectList] = useState([{}]);

    // function to get projects added to the database
    const getProject = async () => {
        let respBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respBody = items;
        setProjectList(respBody);
    };
    
    useEffect(() => {
        getProject();
    }, []);

    return (
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
                        value={modal.color}
                        onChange={(e) => modalState((prev) => {
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
                        value={modal.project}
                        onChange={(e) => modalState((prev) => {
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
                        value={modal.parent}
                        onChange={(e) => modalState((prev) => {
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
    )
}

export default ProjectModal