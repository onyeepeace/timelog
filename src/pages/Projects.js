import React, { useEffect, useState } from 'react';
import projectStyles from './Project.module.css';
import Example from '../components/Modal';
import modalStyles from '../components/Modal.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const projectlog = deta.Base('projects');

const Projects = () => {
    // state for form inputs
    const [newColor, setNewColor] = useState('');
    const [newProject, setNewProject] = useState('');
    const [newParent, setNewParent] = useState('');

    // state to display projects added
    const [isReady, setIsReady] = useState(false);
    const [projectList, setProjectList] = useState([{}]);

    // state to open the modal and edit a project
    const [status, setStatus] = useState(false);
    
    const handleAddProject = (e) => {
        e.preventDefault();
        if (!newColor || !newProject) {
            alert('fields cannot be blank');
        } else {
            const values = {
                color: newColor,
                project: newProject,
                parent: newParent,
            };
            // adds project to the database
            projectlog.put(values);

            // clears the form fields
            setNewColor('')
            setNewProject('')
            setNewParent('')
        }
    };

    // function to get projects added to the database
    const getProject = async () => {
        let respBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respBody = items;
        setProjectList(respBody);
        setIsReady(true);
    };

    // function to open the modal
    const handleOpen = () => {
        setStatus(true);
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
            <button className={modalStyles.okBtn} onClick={handleClose}>
                Save
            </button>
            <button className={modalStyles.okBtn} onClick={handleClose}>
                Close
            </button>
        </>
    );

    const deleteProject = async (tid) => {
        await projectlog.delete(tid);
        setTimeout(getProject, 100);
    };

    const editEntry = async (tid) => {
        await projectlog.get(tid);
    };

    useEffect(() => {
        getProject();
    }, []);

    return (
        <main className={projectStyles.project_main}>
            <div className={projectStyles.container}>
                {/* form to add entries */}
                <form
                    action=''
                    onSubmit={handleAddProject}
                    className={projectStyles.form}
                >
                    {/* color */}
                    <div className={projectStyles.color_div}>
                        <label className={projectStyles.label}>Color</label>
                        <input
                            className={projectStyles.color}
                            type='color'
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                        />
                    </div>

                    {/* project name */}
                    <div className={projectStyles.project_name_form}>
                        <label className={projectStyles.label}>
                            Project name
                        </label>
                        <input
                            type='text'
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                        />
                    </div>

                    {/* select/add parent */}
                    <div className={projectStyles.project}>
                        <label className={projectStyles.label}>Parent</label>

                        <select
                            name='select_parent'
                            id='select_parent'
                            placeholder='Select parent...'
                            value={newParent}
                            onChange={(e) =>
                                setNewParent(e.target.value)
                            }
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

                    {/* Add new project */}
                    <button type='submit' className={projectStyles.submit}>
                        Add entry
                    </button>
                </form>

                {/* displays the projects added */}
                <div className={projectStyles.entries}>
                    {!isReady ? (
                        <p>No projects added yet...</p>
                    ) : (
                        <div className=''>
                            {projectList.map((singleProject) => (
                                <div
                                    className={projectStyles.project_list}
                                    key={singleProject.key}
                                >
                                    <div className={projectStyles.project_container}>
                                        <p className={projectStyles.project_name_heading}>Project name</p>
                                        <div className={projectStyles.project_content}>
                                            <div className={projectStyles.color_box} style={{backgroundColor: singleProject.color}}></div>
                                            <p className={projectStyles.project_name}>{singleProject.project}</p>
                                        </div>
                                    </div>

                                    <div className={projectStyles.parent_container}>
                                        <p className={projectStyles.parent_name_heading}>Parent name</p>
                                        <p className={projectStyles.parent_name}>{singleProject.parent}</p>
                                    </div>

                                    <div className={projectStyles.action_buttons}>
                                        <button
                                            className={projectStyles.delete}
                                            onClick={() => {
                                                deleteProject(singleProject.key);
                                                alert('project deleted');
                                            }}
                                        >
                                            Delete project
                                        </button>

                                        <button
                                            className={projectStyles.edit}
                                            onClick={() => {
                                                console.log(editEntry(singleProject.key));
                                                handleOpen()
                                            }}
                                        >
                                            Edit project
                                        </button>
                                    </div>
                                    
                                    {/* modal to edit a project */}
                                    {status && (
                                        <Example closeModal={handleClose} footer={footer}> 
                                            <div className={modalStyles.submit}>
                                                <form
                                                    action=''
                                                    onSubmit={handleAddProject}
                                                    className={projectStyles.form}
                                                >
                                                    {/* color */}
                                                    <div className={projectStyles.color_div}>
                                                        <label className={projectStyles.label}>Color</label>
                                                        <input
                                                            className={projectStyles.color}
                                                            type='color'
                                                            value={newColor}
                                                            onChange={(e) => setNewColor(e.target.value)}
                                                        />
                                                    </div>

                                                    {/* project name */}
                                                    <div className={projectStyles.project_name_form}>
                                                        <label className={projectStyles.label}>
                                                            Project name
                                                        </label>
                                                        <input
                                                            type='text'
                                                            value={newProject}
                                                            onChange={(e) => setNewProject(e.target.value)}
                                                        />
                                                    </div>

                                                    {/* select/add parent */}
                                                    <div className={projectStyles.project}>
                                                        <label className={projectStyles.label}>Parent</label>

                                                        <select
                                                            name='select_parent'
                                                            id='select_parent'
                                                            placeholder='Select parent...'
                                                            value={newParent}
                                                            onChange={(e) =>
                                                                setNewParent(e.target.value)
                                                            }
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
                                        </Example>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Projects;
