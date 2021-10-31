import React, { useState } from "react";
import {
	Flex,
	Text,
    Button
} from "@chakra-ui/react";
import Announcement from "../dashboard/Announcement/Announcement"

function RecentAnnouncment({recent_announce, code}) {
    const [show, setShow] = useState(false)
    //For announcement
	const [announcements, setAnnouncements] = useState([]);
    return (
        <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5}>
            <Text fontSize="2xl" letterSpacing="wide" fontWeight={600}>
                Recent Announcement
            </Text>
            <Text fontSize="lg" fontWeight="semibold">{code}</Text>
            { show ? (
                <Flex>
                    <Flex>
                        {
                            recent_announce && code ? (
                                <Announcement padding={0} margin={0} announcement={recent_announce} course={code} setAnnouncements={setAnnouncements} isAnnouncementPage={false}/>
                            ) : (
                                <Flex>
                                    <Text>
                                        There are no new announcements
                                    </Text>
                                </Flex>
                            )
                        }
                    </Flex>
                </Flex>
            ) : (
                <Flex maxHeight={400} overflow="hidden">
                {
                    recent_announce && code ? (
                        <Announcement padding={0} margin={0} announcement={recent_announce} course={code} setAnnouncements={setAnnouncements} isAnnouncementPage={false}/>
                    ) : (
                        <Flex>
                            <Text>
                                There are no new announcements
                            </Text>
                        </Flex>
                    )
                }
                </Flex>
            )
            }
            {
                recent_announce && code &&
                <Flex paddingTop={2} flexGrow={1} justifyContent="end">
                    <Button onClick={() => setShow(!show)}>
                        { show ? "Hide" : "Show"}
                    </Button>
                </Flex>
            }
        </Flex>
    )
}

export default RecentAnnouncment