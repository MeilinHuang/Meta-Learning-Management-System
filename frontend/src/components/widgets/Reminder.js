import React, { useEffect, useState } from "react";
import {
    Text,
    Flex,
} from "@chakra-ui/react";

function Reminder({reminder}) {
    const [show, setShow] = useState(false)

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ]
    let date = new Date(reminder.remind_date)
    let remind_date = (date.getDate() + 1) + " " + monthNames[date.getMonth()].substring(0, 3)
    return (
        <Flex marginTop={2} bg="blue.300" borderRadius="10px" padding="5px" color="white" _hover={{cursor: "pointer", textDecoration: "underline"}} onClick={e => setShow(!show)}>
            {
                !show ?
                    <Text fontSize={"sm"} width={"100px"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        {reminder.description}
                    </Text>
                :
                    <Text fontSize={"sm"} width={"100px"}>
                        {reminder.description}
                    </Text>
            }
            <Text flexGrow="1" fontSize={"sm"} fontWeight="semibold" textAlign="end">
                {remind_date}
            </Text>
        </Flex>
    )
}

export default Reminder