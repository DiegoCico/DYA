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

    const getUpdatedDays = (dateStr, dayOne) => {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

        const splitDate = dateStr.split('-')
        const date = new Date(splitDate[0], splitDate[1]-1, splitDate[2])
        const dayName = date.toLocaleDateString('en-US', {weekday: 'long'})
        const todayIndex = days.indexOf(dayName)
        let xLabel = []
        if (dayOne) {
            xLabel = days.slice(todayIndex).concat(days.slice(0, todayIndex))
        } else {
            // current day all the way on the right side, to the left --> rest of the week
            xLabel = days.slice(todayIndex+1).concat(days.slice(0, todayIndex+1))
        }

        return xLabel
    }

    const getChildrenProgress = async (childrenID) => {
        try {
            let tempChildProgress = {
                labels: [],
                datasets: []
            }
    
            const activityCollection = collection(db, 'userActivity')
            let longestLoginUserID = ''
            let largestLogins = 0
            let parentData = []
    
            // Find the child with the most logins and prepare the datasets
            for (let i = 0; i < childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]))
                const qSnap = await getDocs(q)
                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]))
                const childQSnap = await getDocs(childQ)
    
                qSnap.forEach(doc => {
                    const data = doc.data()
                    const loginData = data.loginData
    
                    if (loginData.length > largestLogins) {
                        largestLogins = loginData.length
                        longestLoginUserID = data.uniqueId
                        parentData = loginData
    
                        childQSnap.forEach(childDoc => {
                            const dataset = {
                                label: childDoc.data().name,
                                data: loginData.map(day => day.xp),
                                borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                            }
                            tempChildProgress.datasets.push(dataset)
                        })
                    }
                })
            }
    
            if (longestLoginUserID) {
                let days = []
                if (parentData.length < 7) {
                    days = getUpdatedDays(parentData[0].day, true)
                } else {
                    days = getUpdatedDays(parentData[parentData.length - 1].day, false)
                }
                tempChildProgress.labels = days
            } else {
                console.log('Longest login user is not found')
            }
    
            // Adjust data points for other children
            for (let i = 0; i < childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]))
                const qSnap = await getDocs(q)
                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]))
                const childQSnap = await getDocs(childQ)
    
                qSnap.forEach(doc => {
                    if (doc.data().uniqueId !== longestLoginUserID) {
                        let updatedData = [...doc.data().loginData]
                        const toCheckDays = new Set(updatedData.map(item => item.day))
    
                        parentData.forEach(item => {
                            if (!toCheckDays.has(item.day)) {
                                updatedData.push({ day: item.day, xp: 0 })
                            }
                        })
    
                        updatedData.sort((a, b) => new Date(a.day) - new Date(b.day))
    
                        childQSnap.forEach(childDoc => {
                            const data = {
                                label: childDoc.data().name,
                                data: updatedData.map(day => day.xp),
                                borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                            }
                            tempChildProgress.datasets.push(data)
                        })
                    }
                })
            }
    
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