import React, { useState, useEffect } from "react";
import { 
    Flex, 
    Box, 
    Text, 
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverFooter,
    Portal,
    Input,
    Button,
    Tooltip,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import moment from "moment";
import "./Calendar.css";
import { backend_url } from "../../Constants";

function Calendar() {
  const [month, setMonth] = useState(moment());
  //For calendar reminder
  const [date, setDate] = useState(new Date())
  const [rows, setRows] = useState([]);
  const [reminders, setReminders] = useState([])
  const [reminder_text, setRemText] = useState("")

  const [invalid, setInvalid] = useState(false)
  const [input_val, setValue] = useState("")

  let weekdayshort = moment
    .weekdaysShort()
    .map((day) => day.substring(0, day.length - 1));
  const firstDay = (date) => {
    return moment(date).startOf("month").format("d");
  };

  const getMonth = (monthVal) => {
    let empty = [];
    for (let i = 0; i < firstDay(monthVal); i++) {
      empty.push("");
    }

    let days = [];
    for (let i = 1; i < monthVal.daysInMonth() + 1; i++) {
      days.push(i);
    }

    let total = [...empty, ...days];

    let tmp = [];
    let curr = [];
    total.forEach((day, i) => {
      if (i % 7 !== 0 || i === 0) {
        curr.push(day);
      } else {
        tmp.push(curr);
        curr = [day];
      }
    });
    tmp.push(curr);
    return tmp;
  };

  useEffect(() => {
    setRows(getMonth(month));
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Authorisation: `Bearer ${localStorage.getItem("token")}`,
        },
      };
    fetch(backend_url + "user/" + localStorage.getItem("id") +"/calendar", options)
    .then(resp => resp.json())
    .then(data => {
        setReminders(data)
    })

    //remove dependency array warning, probably should fix this
    // eslint-disable-next-line
  }, [month]);

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ]
  return (
    <Box width="100%">
      <Flex bg="gray.100" height="50px">
        <Flex
          _hover={{ bg: "gray.400" }}
          height="100%"
          width="25%"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => {
            const tmpMonth = month.subtract(1, "month");
            setMonth(tmpMonth);
            setRows(getMonth(tmpMonth));
          }}
        >
          <ChevronLeftIcon />
        </Flex>
        <Flex
          height="100%"
          width="50%"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
        >
          <Text>
            {month.startOf("month").format("MMMM") + " " + month.format("y")}
          </Text>
        </Flex>
        <Flex
          _hover={{ bg: "gray.400" }}
          height="100%"
          width="25%"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => {
            const tmpMonth = month.add(1, "month");
            setMonth(tmpMonth);
            setRows(getMonth(tmpMonth));
          }}
        >
          <ChevronRightIcon />
        </Flex>
      </Flex>
      <table width="100%">
        <tbody>
          <tr>
            {weekdayshort.map((e) => {
              return (
                <td key={e} className="weekday">
                  {e}
                </td>
              );
            })}
          </tr>
          {rows.map((row, index) => {
            return (
              <tr key={"row-" + index}>
                {/* Not sure on how to remove warning without doing drastic changes */}
                <Popover>
                    {row.map((day, i) => {
                      let className = "dayTile";
                      if (day === "") {
                          return (
                            <td key={"month-" + month.format("MMMM") + " day-" + i} className={className}>
                                <div>
                                {day}
                                </div>
                            </td>
                          )
                      }
                      let rem = new Date(month.format("y") + " " + month.format("MMMM") + " " + day)
                      //In case a date is a reminder
                      let reminder_note = ""
                      //Is the current date
                      if (parseInt(moment().format("D")) === day && 
                          month.startOf("month").format("MMMM") === moment().startOf("month").format("MMMM") &&
                          parseInt(moment().format("YYYY")) === parseInt(month.format("y"))) {
                          className += " today";
                      }
                      for (let x = 0; x < reminders.length; x++) {
                        let reminder_date = reminders[x].remind_date.split("T")[0]
                        //console.log(reminder_date, rem)
                        if (reminder_date === new Date(rem).toISOString().split("T")[0]) {
                            className += " reminder"
                            reminder_note = reminders[x].description
                            break
                        }
                      }
                      //Is before the current date and is not reminder then dont allow user to click
                      if (new Date() > rem && reminder_note.length == 0) {
                        return (
                            <td key={"month-" + month.format("MMMM") + " day-" + i} className={className}>
                              <div>
                                {day}
                              </div>
                            </td>
                        )
                      }
                      className += " after_current"
                      return (
                        <td key={"month-" + month.format("MMMM") + " day-" + i} className={className} onClick={e => {
                            setValue("")
                            setDate(rem)
                            if (reminder_note.length > 0) {
                                setRemText(reminder_note)
                            }
                            else {
                                setRemText("")
                            }
                        }}>
                            <div>
                              <Tooltip>
                                <PopoverTrigger margin="0" padding="0">
                                    <div>{day}</div>
                                </PopoverTrigger>  
                              </Tooltip>
                            </div>                     
                        </td>
                      );
                    })}
                    <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      { reminder_text.length === 0 ? (
                          <Box>
                            <PopoverHeader fontSize={"1.1rem"} fontWeight={600}>Create Reminder for {monthNames[date.getMonth()].substring(0, 3) + " " + date.getDate() + " " + date.getFullYear()}</PopoverHeader>
                            <PopoverBody>
                                <Input onChange={e => {setValue(e.target.value); setInvalid(false)}} isInvalid={invalid} placeholder="Reminder" value={input_val}></Input>
                            </PopoverBody>
                            <PopoverFooter>
                            <Flex justifyContent="flex-end">
                                <Button onClick={e => {
                                    if (input_val === "") {
                                        setInvalid(true)
                                    }
                                    else {
                                        setValue("")
                                        const options = {
                                            method: "PUT",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            },
                                            body: JSON.stringify({
                                                "remind_date": date.toISOString(),
                                                "description": input_val,
                                            })
                                        };
                
                                        fetch(backend_url + "user/" + localStorage.getItem("id") + "/calendar", options)
                                        .then(resp => {
                                            if (resp.status === 200) {
                                                const options = {
                                                    method: "GET",
                                                    headers: {
                                                        "Content-Type": "application/JSON",
                                                        Authorisation: `Bearer ${localStorage.getItem("token")}`,
                                                    },
                                                };
                                                fetch(backend_url + "user/" + localStorage.getItem("id") +"/calendar", options)
                                                .then(resp => resp.json())
                                                .then(data => {
                                                    setReminders(data)
                                                })
                                            }
                                        })
                                    }
                                }}>SAVE</Button>
                            </Flex>
                            </PopoverFooter>
                          </Box>
                        ) : (
                            <Box>
                              <PopoverHeader fontSize={"1.1rem"} fontWeight={600}>Reminder</PopoverHeader>
                              <PopoverBody>{reminder_text}</PopoverBody>
                              <PopoverFooter>
                                <Flex justifyContent="end">
                                  <Button variant={"outline"} onClick={e => {
                                      reminders.map(reminder => {
                                          if (reminder.description === reminder_text) {

                                            //Not sure why it is not working
                                            fetch(backend_url + "user/calendar/" + 1, {
                                                method: "DELETE",
                                                headers: {
                                                  Authorisation: `Bearer ${localStorage.getItem("token")}`,
                                                },
                                            })
                                            .then(resp => resp.json())
                                            .then(data => console.log(data))
                                          }
                                      })
                                  }}>DELETE</Button>
                                </Flex>
                              </PopoverFooter>
                            </Box>
                        )
                      }
                    </PopoverContent>
                    </Portal>
                </Popover>
              </tr>
            );
          })}
        </tbody>
      </table>
      
    </Box>
  );
}

export default Calendar;
