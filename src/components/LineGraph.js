import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

/**
 * LineGraph Component
 *
 * The `LineGraph` component renders a line chart that visualizes the progress of multiple children over the past week. 
 * Each child's XP (experience points) for each day of the week is plotted on the chart.
 *
 * Props:
 * - childrenID (Array): An array of child IDs whose progress is to be visualized.
 *
 * State:
 * - lineData (Object): Contains the labels (days of the week) and datasets (XP data for each child).
 *
 * Methods:
 * - getUpdatedDays(dateStr): Generates a list of ISO string dates for the 7-day period starting from the given date.
 * - getTodayWeek(): Returns the ISO string date of the Monday of the current week.
 * - getChildrenProgress(childrenID): Fetches and processes the progress data for the specified children, then updates the `lineData` state.
 *
 * Effects:
 * - useEffect: Fetches and updates the line graph data when the component mounts or when `childrenID` changes.
 */

export default function LineGraph(props) {
    const { childrenID } = props;
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: []
    });

    /**
     * Generates a list of ISO string dates for the 7-day period starting from the given date.
     * @param {string} dateStr - The ISO string date to start from.
     * @returns {Array} - An array of ISO string dates representing the week.
     */
    const getUpdatedDays = (dateStr) => {
        let week = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(dateStr);
            currentDay.setDate(currentDay.getDate() + i);
            week.push(currentDay.toISOString().split('T')[0]);
        }
        return week;
    };

    /**
     * Returns the ISO string date of the Monday of the current week.
     * @returns {string} - The ISO string date for Monday.
     */
    const getTodayWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diff);

        return monday.toISOString().split('T')[0];
    };

    /**
     * Fetches and processes the progress data for the specified children, then updates the `lineData` state.
     * @param {Array} childrenID - An array of child IDs whose progress data is to be fetched.
     */
    const getChildrenProgress = async (childrenID) => {
        try {
            const thisWeekMonday = getTodayWeek();
            const thisWeek = getUpdatedDays(thisWeekMonday);

            let tempChildProgress = {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: []
            };

            const activityCollection = collection(db, 'userActivity');

            for (let i = 0; i < childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]));
                const qSnap = await getDocs(q);
                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]));
                const childQSnap = await getDocs(childQ);

                qSnap.forEach(doc => {
                    const data = doc.data();
                    const loginData = data.loginData.slice(-7);
                    childQSnap.forEach(childDoc => {
                        const xpData = thisWeek.reduce((acc, date) => {
                            acc[date] = 0;
                            return acc;
                        }, {});

                        loginData.forEach(login => {
                            if (xpData.hasOwnProperty(login.day)) {
                                xpData[login.day] = login.xp;
                            }
                        });

                        const data = thisWeek.map(date => xpData[date]);

                        let dataset = {
                            label: childDoc.data().name,
                            data: data,
                            borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                        };
                        tempChildProgress.datasets.push(dataset);
                    });
                });
            }

            setLineData(tempChildProgress);
        } catch (error) {
            console.log(error.message);
        }
    };

    const options = {
        responsive: true,
    };

    useEffect(() => {
        const getData = async () => {
            setLineData({
                labels: [],
                datasets: []
            });
            await getChildrenProgress(childrenID);
        };

        getData();
    }, [childrenID]);

    return (
        <>
            {lineData.datasets.length > 0 ? (
                <Line options={options} data={lineData} />
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
