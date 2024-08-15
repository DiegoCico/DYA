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
        console.log(dateStr)
        console.log(dayName)
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

    const getChildrenProgress = async(childrenID) => {
        try {
            let tempChildProgress = {
                labels: [],
                datasets: []
            }

            const activityCollection = collection(db, 'userActivity')
            let longestLoginUserID = ''
            let largestLogins = 0
            let dataset = {
                borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
            }
            let childData = []
            for (let i = 0; i<childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]))
                const qSnap = await getDocs(q)
                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]))
                const childQSnap = await getDocs(childQ)
                qSnap.forEach(doc => {
                    const data = doc.data()
                    const loginData = data.loginData
                    let childLabel = ''
                    // getting largest num of logins
                    if (loginData.length > largestLogins) {
                        largestLogins = loginData.length
                        longestLoginUserID = data.uniqueId
                        childData = loginData.map(day => day.xp)
                        childQSnap.forEach(doc => {
                            childLabel = doc.data().name
                        })
                        dataset.label = childLabel
                        dataset.data = childData
                    }
                    
                })
            }
            console.log('Longest user', tempChildProgress.datasets)
            tempChildProgress.datasets.push(dataset)

            let parentData = []
            if (longestLoginUserID) {
                console.log('Longest userID is', longestLoginUserID, 'with', largestLogins, 'logins')
                const q = query(activityCollection, where('uniqueId', '==', longestLoginUserID))
                const qSnap = await getDocs(q)
                let days = []
                
                if (!qSnap.empty) {
                    qSnap.forEach(doc => {
                        const loginData = doc.data().loginData
                        parentData = loginData
                        if (loginData.length < 7) {
                            days = getUpdatedDays(loginData[0].day, true)
                        } else {
                            days = getUpdatedDays(loginData[loginData.length - 1].day, false)
                        }
                    })
                    tempChildProgress.labels = days
                } else {
                    console.log('Longest login user is not found')
                }
            }

            // adjust data points and fill missed days
            for (let i = 0; i<childrenID.length; i++) {
                const q = query(activityCollection, where('uniqueId', '==', childrenID[i]))
                const qSnap = await getDocs(q)

                const childQ = query(collection(db, 'users'), where('uniqueId', '==', childrenID[i]))
                const childQSnap = await getDocs(childQ)
                qSnap.forEach(doc => {
                    console.log(doc.data().loginData)
                    if (doc.data().uniqueId !== longestLoginUserID) {
                        let data = {
                            borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                        }
                        const updatedData = [...doc.data().loginData]
                        const toCheckDays = new Set(doc.data().loginData.map(item => item.day))

                        parentData.forEach(item => {
                            if (!toCheckDays.has(item.day)) {
                                updatedData.push({day: item.day, xp: 0})
                            }
                        })

                        updatedData.sort((a, b) => {
                            const [yearA, monthA, dayA] = a.day.split('-').map(Number);
                            const [yearB, monthB, dayB] = b.day.split('-').map(Number);
                    
                            const dateA = new Date(yearA, monthA - 1, dayA);
                            const dateB = new Date(yearB, monthB - 1, dayB);
                    
                            return dateA - dateB;
                        })
                        let childLabel = ''
                        childQSnap.forEach(doc => {
                            childLabel = doc.data().name
                        })
                        console.log('Updated data', updatedData)
                        data.label = childLabel
                        data.data = updatedData.map(day => day.xp)
                        tempChildProgress.datasets.push(data)
                    }
                })
            }

            console.log(parentData)
            setLineData(tempChildProgress)
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
            setLineData({
                labels: [],
                datasets: []
            })
            await getChildrenProgress(childrenID)
        }

        getData()
    }, [childrenID])

    // consoling out
    console.log(lineData)

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