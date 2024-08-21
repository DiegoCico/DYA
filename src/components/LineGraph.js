import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineGraph(props) {
    const { childrenID } = props
    const [ lineData, setLineData ] = useState({
        labels: [],
        datasets: []
    })

    const getUpdatedDays = (dateStr) => {
        // const splitDate = dateStr.split('-')
        // const date = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
        // const dayName = date.toLocaleDateString('en-US', {weekday: 'long'})
        
        // return dayName
        let week = []
        for (let i=0; i<7; i++) {
            const currentDay = new Date(dateStr)
            currentDay.setDate(currentDay.getDate() + i)
            week.push(currentDay.toISOString().split('T')[0])
        }
        return week
    }

    const getTodayWeek = () => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek-1
        const monday = new Date(today)
        monday.setDate(today.getDate()-diff)

        const formattedDate = monday.toISOString().split('T')[0]
        return formattedDate
    }

    const getChildrenProgress = async (childrenID) => {
        try {
            const thisWeekMonday = getTodayWeek()
            const thisWeek = getUpdatedDays(thisWeekMonday)
            
            let tempChildProgress = {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: []
            }
    
            const activityCollection = collection(db, 'userActivity')
    
            for (let i = 0; i < childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]))
                const qSnap = await getDocs(q)
                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]))
                const childQSnap = await getDocs(childQ)
    
                qSnap.forEach(doc => {
                    const data = doc.data()
                    const loginData = data.loginData.slice(-7)
                    childQSnap.forEach(childDoc => {
                        const xpData = thisWeek.reduce((acc, date) => {
                            acc[date] = 0
                            return acc
                        }, {})

                        loginData.forEach(login => {
                            if (xpData.hasOwnProperty(login.day)) {
                                xpData[login.day] = login.xp
                            }
                        })

                        const data = thisWeek.map(date => xpData[date])
                        
                        let dataset = {
                            label: childDoc.data().name,
                            data: data,
                            borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`

                        }
                        tempChildProgress.datasets.push(dataset)
                    })
                    
                })
            }
            
            console.log(tempChildProgress)
            setLineData(tempChildProgress)
        } catch (error) {
            console.log(error.message)
        }
    }
    
    const options = {
        responsive: true,
    }
    
    useEffect(() => {
        const getData = async () => {
            setLineData({
                labels: [],
                datasets: []
            })
            await getChildrenProgress(childrenID)
        }
    
        getData()
    }, [childrenID])
    
    return (
        <>
            {lineData.datasets.length > 0 ? (
                <Line options={options} data={lineData} />
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
    
}