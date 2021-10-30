import React from "react"
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Link,
    Center,
    Button,
    useBreakpointValue,
    useDisclosure,
    Flex,
    IconButton,
    Spacer
} from "@chakra-ui/react";
import { GrAdd } from 'react-icons/gr';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

import LectureTable from './LectureTable';
import AddLectureModal from './AddLectureModal';

function LectureTableContainer({ lectures, code, searchFiles, handleLectureState }) {
  const buttonContents = useBreakpointValue({ base: "", md: "Add" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const compare = ( a, b ) => {
    if ( a.week < b.week ) return -1;
    if ( a.week > b.week ) return 1;
    return 0;
  };

  // Sets lecture state
  const renderLectures = () => {
    fetch(`http://localhost:8000/${code}/lectures`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(r => r.json())
    .then(data => {
      handleLectureState(data);
    });
  };

   // Post lecture
  const handleAddLectureSubmit = (formData) => {
    // Post lecture
    fetch(`http://localhost:8000/${code}/lecture`, {
      method: "POST",
      body: formData[0],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then(data => {
      // Upload files 
      fetch(`http://localhost:8000/lecture/file/${data.lectureId}`, {
      method: "POST",
      body: formData[1],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      }).then(renderLectures())
    })
  };
  
  if (lectures && lectures.length) lectures.sort(compare);

  return (
      <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} height="50%" borderColor="white" paddingTop="2%">
          <AccordionItem>
            {
              !searchFiles && 
              <AccordionItem width="99%">
                <Flex alignItems="center"> 
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Lecture Videos
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <IconButton backgroundColor="white" size="sm" marginLeft="1%" marginRight="0.5%" icon={<EditIcon />}/>
                  <IconButton backgroundColor="white" size="sm" icon={<DeleteIcon />}/>
                </Flex>
                <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  { /* Add new database lecture-information panel */ }
                  <Box flex="1" textAlign="left" padding="1%">
                    Lecture videos playlist at: 
                    <Link href="https://www.youtube.com" padding="1%" color="blue">
                      www.youtube.com
                    </Link>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            }
              {
                (lectures && lectures.length) && lectures.map( lecture => (
                  <AccordionItem width="99%">
                    <Flex alignItems="center">  
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Week {lecture.week}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton> 
                      <IconButton backgroundColor="white" size="sm" marginLeft="1%" marginRight="0.5%" icon={<EditIcon />}/>
                      <IconButton backgroundColor="white" size="sm" icon={<DeleteIcon />}/>
                    </Flex>
                    <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                    <LectureTable lecture={lecture} code={code} />
                    </AccordionPanel>
                  </AccordionItem>))
              }
              {
                searchFiles && 
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Results
                    </Box>
                    <AccordionIcon />
                  </AccordionButton> 
                  <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  <LectureTable lecture={lectures} searchFiles={searchFiles} code={code} />
                  </AccordionPanel>
                </AccordionItem>
              }
          </AccordionItem>
          <Center width={{ base: '100%', lg: '100%' }} padding="1%">
            <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px'}} width="100%" backgroundColor="white">{buttonContents}</Button>
            <AddLectureModal isOpen={isOpen} onClose={onClose} isLectures onSubmit={handleAddLectureSubmit} code={code} /> 
          </Center>
      </Accordion>
  )
}

export default LectureTableContainer