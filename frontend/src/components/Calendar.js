import React, { useState, useEffect } from "react"
import { Flex, Box, Text } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import moment from 'moment'
import "./Calendar.css"

function Calendar() {
    const [month, setMonth] = useState(moment())
    const [rows, setRows] = useState([])

    let weekdayshort = moment.weekdaysShort().map(day => day.substring(0, day.length - 1));
    const firstDay = (date) => { 
        return moment(date).startOf("month").format("d")
    }

    const getMonth = (monthVal) => {
        let empty = []
        for (let i = 0; i < firstDay(monthVal); i++) {
            empty.push("")
        }
    
        let days = []
        for (let i = 1; i < monthVal.daysInMonth() + 1; i++) {
            days.push(i)
        }
        
        let total = [...empty, ...days]
        
        let tmp = []
        let curr = []
        total.forEach((day, i) => {
            if (i % 7 !== 0 || i === 0) {
                curr.push(day)
            }
            else {
                tmp.push(curr)
                curr = [day]    
            }
        })
        tmp.push(curr)
        return tmp
    }

    useEffect(() => {
        setRows(getMonth(month))
    }, [month])

    return (
        <Box width="100%">
            <Flex bg="gray.100" height="50px">
                <Flex _hover={{bg:"gray.400"}} height="100%" width="25%" alignItems="center" justifyContent="center" cursor="pointer" onClick={() => {
                    const tmpMonth = month.subtract(1, "month")
                    setMonth(tmpMonth)
                    setRows(getMonth(tmpMonth))
                }}>
                    <ChevronLeftIcon/>
                </Flex>
                <Flex height="100%" width="50%" textAlign="center" alignItems="center" justifyContent="center">
                    <Text>
                        {month.startOf("month").format("MMMM") + " " + month.format("y")}
                    </Text>
                </Flex>
                <Flex _hover={{bg:"gray.400"}} height="100%" width="25%" alignItems="center" justifyContent="center" cursor="pointer" onClick={() => {
                    const tmpMonth = month.add(1, "month")
                    setMonth(tmpMonth)
                    setRows(getMonth(tmpMonth))
                }}>
                    <ChevronRightIcon/>
                </Flex>
            </Flex>
            <table width="100%">
                <tbody>
                    <tr>
                        {
                            weekdayshort.map(e => {
                                return (
                                    <td key={e} className="weekday">{e}</td>
                                )
                            })
                        }
                    </tr>
                    {
                        rows.map((row, index) => {

                            return (
                                <tr key={"row-" + index}>
                                    {
                                        row.map((day, i) => {
                                            let className = "dayTile"
                                            if (parseInt(moment().format("D")) === day && month.startOf("month").format("MMMM") === moment().startOf("month").format("MMMM")) {
                                                className += " today"
                                            }
                                            return (
                                                <td key={"month-" + month.format("MMMM") + " day-" + i} className={className}>{day}</td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </Box>
    )
}

export default Calendar