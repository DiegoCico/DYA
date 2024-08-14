import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineGraph(props) {
    const { childrenID, children } = props
    const [childrenProgress, setChildrenProgress] = useState([])
    const [ lineData, setLineData ] = useState({
        labels: [],
        datasets: []
    })
    const colors = ['red', 'green', 'blue', 'purple']

    const getUpdatedDays = (day, dayOne) => {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

        const date = new Date()
        const todayIndex = days.indexOf(day)
        let xLabel = []
        if (dayOne) {
            xLabel = [days.slice(todayIndex).concat(days.slice(0, todayIndex))]
        } else {
            // current day all the way on the right side, to the left --> rest of the week
            xLabel = [days.slice(todayIndex+1).concat(days.slice(0, todayIndex+1))]
        }

        console.log(xLabel)
    }

    const getChildrenProgress = async(childrenID) => {
        if (childrenID.length === 0) return
        let tempChildrenProgress = []
        let tempLineData = {
            labels: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            datasets: []
        }
        try {
            for (let i=0; i<childrenID.length; i++) {
                const q = query(collection(db, 'userActivity'), where('uniqueId', '==', childrenID[i]))
                const querySnapshot = await getDocs(q)
                const child = children.find(child => child.uniqueId===childrenID[i])
                if (!child) {
                    console.log(`Child not found, ID ${childrenID[i]}`)
                    continue
                }

                const name = child ? child.name : null

                querySnapshot.forEach(doc => {
                    const data = doc.data()
                    if (data && Array.isArray(data.loginData)) {
                        let xpData = data.loginData.map(date => date.xp)
                        tempChildrenProgress.push({label: name, data: xpData, borderColor: colors[Math.floor(Math.random()*colors.length)]})
                        console.log(name, 'xp list', xpData)
                    } else {
                        console.log(`Login data not found for ID ${name}`)
                    }
                })

                
            }
            
            setChildrenProgress(tempChildrenProgress)
            tempLineData.datasets = tempChildrenProgress
            setLineData(tempLineData)

        } catch(error) {
            console.log(error.message)
        }
    }

    const userProgress = {
        labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ],
        datasets: [
            {
                label: 'Child 1 Name',
                data: [20, 10, 0, 10, 30, 30, 10],
                borderColor: 'rgb(75, 192, 192)'
            },
            {
                label: 'Child 2 Name',
                data: [40, 20, 30, 20, 20, 10, 50],
                borderColor: 'red',
            },
        ]
    }
    const options = {

    }
    useEffect(() => {
        const getData = async() => {
            await getChildrenProgress(childrenID)
        }

        getData()
    }, [childrenID])
    console.log('All children progress', lineData)
    console.log('Test data', userProgress)
    getUpdatedDays('Monday',  true)
    return (
        <>
            {lineData.datasets.length > 0 ? (
                <Line options={options} data={userProgress} />
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}