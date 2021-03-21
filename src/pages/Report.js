import React, { useEffect, useState } from 'react';
import ReactSvgPieChart from "react-svg-piechart"
import moment from 'moment';
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
    const [today, setToday] = useState(false);
    const [thisWeek, setThisWeek] = useState(false);
    
    const see = entryProjectList.map(color => (color.color))
    console.log(see)
        
    const look = see.map(luks => luks)
    console.log(look)

    const date = entryList.map(entryData => (
        {title: entryData.project, value: parseInt(entryData.duration), color: "#22594e"}
    ))
    console.log(date)

    // const data = [
    //     {title: "Data 1", value: 100, color: "#22594e"},
    //     {title: "Data 2", value: 60, color: "#2f7d6d"},
    //     {title: "Data 3", value: 30, color: "#3da18d"},
    //     {title: "Data 4", value: 20, color: "#69c2b0"},
    //     {title: "Data 5", value: 10, color: "#a1d9ce"},
    //   ]
    //   console.log(data)

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

    const handleToday = async () => {
        setToday(true)
        let respBody = {}
        const {value: items} = await timelog.fetch([{"date": new Date().toISOString().slice(0, 10)
        }]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    }

    const calculateDate = (days) => {
        var someDate = new Date();
        someDate.setDate(someDate.getDate() + days); //number  of days to add, e.x. 15 days
        var dateFormated = someDate.toISOString().slice(0,10);
        console.log(dateFormated);
    }

    const handleThisWeek = async () => {
        setThisWeek(true)
        let respBody = {}
        const {value: items} = await timelog.fetch([{"date": calculateDate(7)
        }]).next();
        respBody = items;
        setEntryList(respBody);
        setIsReady(true);
    }

    useEffect(() => {
        getEntry();
        getEntryProject();
    }, []);

    const totalDurations = entryList.slice(1)
    .reduce((prev, cur) => {
        return prev.add(cur.duration);
      },
      moment.duration(entryList[0].duration));
    const total = moment.utc(totalDurations.asMilliseconds()).format("HH:mm")

    return (
        <main className={reportStyles.report_main}>
                <div className={reportStyles.container}>
                <button onClick={handleToday}>Today</button>
                <button onClick={handleThisWeek}>This Week</button>
                {(today || thisWeek) && (
                    <>
                        {!isReady ? (
                            <p>No entries in this date range...</p>
                        ) : (
                            <div>
                                <div className={reportStyles.chart_container}>
                                    <div className={reportStyles.piechart}>
                                        <ReactSvgPieChart data={date} expandOnHover/>
                                    </div>
                                    <div className={reportStyles.chart_projects}>
                                        <ul>
                                            {entryList.map((entryProject) => (
                                                <li key={entryProject.key}>{entryProject.project}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className={reportStyles.mini_report}>
                                    <div className={reportStyles.mini_heading}>
                                        <h4>Project</h4>
                                        <h4>Time spent</h4>
                                    </div>
                                    {entryList.map(entryData => (
                                        <div className={reportStyles.mini_report_data}>
                                            <p>{entryData.project}</p>
                                            <p>{entryData.duration}</p>
                                        </div>
                                    ))}
                                    <div className={reportStyles.total_time}>
                                        <p>Total time spent</p>
                                        <p>{total}</p>
                                    </div>
                                </div>
                                
                                <button className={reportStyles.report_button} >See detailed report</button>
                                <div className={reportStyles.detailed_report} id="detailed">
                                    <div className={reportStyles.detailed_heading}>
                                        <h4>Date</h4>
                                        <h4>Start</h4>
                                        <h4>End</h4>
                                        <h4>Project</h4>
                                        <h4>Duration</h4>
                                        <h4>Note</h4>
                                    </div>
                                    {entryList.map(entryData => (
                                        <div className={reportStyles.detailed_report_data}>
                                            <p>{entryData.date}</p>
                                            <p>{entryData.startTime}</p>
                                            <p>{entryData.endTime}</p>
                                            <p>{entryData.project}</p>
                                            <p>{entryData.duration}</p>
                                            <p>{entryData.work}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default Report;
