import React from 'react';
import './Project.css';

const Projects = () => {
    return (
        <main className='project-main'>
            <div>
                <form action=''>
                    <input type='color' name='color' id='color' />
                    <input type='text' name='project_name' />
                    <select name='select_parent' id='select_parent'>
                        <option value='no parent'>No parent</option>
                    </select>
                    <button type='submit'>Add project</button>
                </form>
            </div>
        </main>
    );
};

export default Projects;
