import React, { useEffect, useState } from 'react';
import ReactSvgPieChart from "react-svg-piechart"
import reportStyles from './Report.module.css';

const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
const deta = Deta(process.env.REACT_APP_TIMELOG_PROJECT_KEY);

const timelog = deta.Base('entries');
const projectlog = deta.Base('projects');

const Report = () => {
    const [isReady, setIsReady] = useState(false);
    const [entryList, setEntryList] = useState([{}]);
    const [entryProjectList, setEntryProjectList] = useState([{}]);

    let project
    let duration
    let color

    entryList.map((entryData) => {
        project = entryData.project
        duration = parseInt(entryData.duration)
    })

    entryProjectList.map((projectData) => {
        color = projectData.color
    })

    console.log(project, duration, color)


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

    useEffect(() => {
        getEntry();
        getEntryProject();
    }, []);

    return (
        <main className={reportStyles.report_main}>
            <div>
                {!isReady ? (
                    <p>No entries in this date range...</p>
                ) : (
                    <div>
                        <ReactSvgPieChart
                            data={[{title: project, value: duration, color: color}]}
                            // If you need expand on hover (or touch) effect
                            expandOnHover
                        />
                        {project}
                        {duration}
                        {color}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Report;
