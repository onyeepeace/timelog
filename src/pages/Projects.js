import React, { useEffect, useState } from 'react';
import projectStyles from './Project.module.css';
import { GithubPicker } from 'react-color';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const projectlog = deta.Base('projects');

const Projects = () => {
    const [newColor, setNewColor] = useState('');
    const [newProject, setNewProject] = useState('');
    const [newParent, setNewParent] = useState('');

    const [isReady, setIsReady] = useState(false);
    const [projectList, setProjectList] = useState([{}]);

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
            projectlog.put(values);
        }
    };

    const getProject = async () => {
        let respBody = {};
        const { value: items } = await projectlog.fetch([]).next();
        respBody = items;
        setProjectList(respBody);
        setIsReady(true);
    };

    const deleteProject = async (tid) => {
        const res = await projectlog.delete(tid);
        setTimeout(getProject, 100);
    };

    useEffect(() => {
        getProject();
    }, []);

    return (
        <main className={projectStyles.project_main}>
            <div className={projectStyles.container}>
                {/* <GithubPicker /> */}
                <form
                    action=''
                    onSubmit={handleAddProject}
                    className={projectStyles.form}
                >
                    {/* color */}
                    <div className={projectStyles.color}>
                        <label className={projectStyles.label}>Color</label>
                        <input
                            className={projectStyles.color}
                            type='color'
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                        />
                    </div>

                    {/* project name */}
                    <div className={projectStyles.project_name}>
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
                        >
                            <option value='no_parent' disabled>
                                No parent
                            </option>
                            {projectList.map((singleParent) => (
                                <option
                                    value={newParent}
                                    onChange={(e) =>
                                        setNewParent(e.target.value)
                                    }
                                >
                                    {projectList.project}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add new project */}
                    <button type='submit' className={projectStyles.submit}>
                        Add entry
                    </button>
                </form>

                <div className={projectStyles.entries}>
                    {!isReady ? (
                        <p>No entries in this date range...</p>
                    ) : (
                        <div className=''>
                            {projectList.map((singleProject) => (
                                <div
                                    className={projectStyles.entry_list}
                                    key={singleProject.key}
                                >
                                    <p>{singleProject.color}</p>
                                    <p>{singleProject.project}</p>
                                    {/* <p style={{ fontWeight: 'bold' }}>
                                        {singleProject.project}
                                    </p> */}
                                    <select
                                        name='select_parent'
                                        id='select_parent'
                                        placeholder='Select parent...'
                                    >
                                        <option value='no_parent' disabled>
                                            No parent
                                        </option>
                                        <option
                                            value={newParent}
                                            onChange={(e) =>
                                                setNewParent(e.target.value)
                                            }
                                        >
                                            {singleProject.project}
                                        </option>
                                    </select>

                                    <button
                                        className={projectStyles.delete}
                                        onClick={() => {
                                            deleteProject(singleProject.key);
                                            alert('project deleted');
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
    );
};

export default Projects;
