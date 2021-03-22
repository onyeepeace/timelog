## A web app to track your time
Timelog is a web application built with ReactJS and [Deta](https://deta.sh) as the database for storing the data. It can be used to log time spent working on projects.
View it here [Timelog](https://logtime.netlify.app)

**What you can do on Timelog**
- Add time entries
- Add/Create projects
- View report for time spent per project
- Edit entries and projects
- Delete entries and projects
- Sort through entries and report

**Page views**
**Timesheet page** - Here, you can add a date, start time, end time, a note on what you're working on and a project. Clicking on the add entry button creates a new entry with the data filled in the form. You can sort entries by today to show entries for the day or this week to show entries for the week. You can edit each project and also delete them.

<img width="1064" alt="timesheetpage" src="https://user-images.githubusercontent.com/53520853/112054711-30605500-8b56-11eb-8dc3-4d30e306e817.png">

**Project page** - Here you can create a project, choose a color for your project and a parent project for your project. Clicking on the add project button creates a new project with the data filled in the form. You can edit each project and also delete them.

<img width="1065" alt="projectpage" src="https://user-images.githubusercontent.com/53520853/112055448-268b2180-8b57-11eb-96c7-8ffd21d18e14.png">

**Report page** - This page displays a report for every project created. You can sort the report by today to show projects for the day or this week to show projects for the week.
The report displays a piechart to visualize the time spent on each project. You can see the name of each project and the time spent working on them. You can also view a detailed report showing the date, start time, end time, note and project name of each project.

<img width="1063" alt="reportpage" src="https://user-images.githubusercontent.com/53520853/112056242-14f64980-8b58-11eb-840b-bbaf870e669e.png">

### Steps to clone this project to your local machine
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
**1. Clone repository**
```
# Open your terminal and paste the following:
$ git clone https://github.com/onyeepeace/timelog.git

# Go into the repository
$ cd timelog

# Install packages and dependencies
$ yarn install
```

**2. Get a project key from Deta**
- Create an account on [Deta](https://deta.sh).
- Create a project and copy the project key.
```
# Create a .env file in the root folder of the timelog project. Add the following and save:
$ REACT_APP_TIMELOG_PROJECT_KEY = 'your copied project key'

# Start the app. This will start the app on localhost:3000
$ yarn start
```
The application can be deployed on Netlify or Vercel.
