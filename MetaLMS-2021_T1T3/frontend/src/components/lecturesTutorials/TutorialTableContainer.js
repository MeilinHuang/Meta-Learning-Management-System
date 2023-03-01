/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react"
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
    IconButton
} from "@chakra-ui/react";
import { GrAdd } from 'react-icons/gr';
import { EditIcon, DeleteIcon, NotAllowedIcon } from '@chakra-ui/icons'

import TutorialTable from './TutorialTable';
import AddTutorialModal from './AddTutorialModal';
import EditTutorialModal from './EditTutorialModal';
import EditLinkModal from './EditLinkModal';
import { backend_url } from "../../Constants";

function TutorialTableContainer({ tutorials, code, searchFiles, handleTutorialState }) {
  const buttonContents = useBreakpointValue({ base: "", md: "Add" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });

  const isAdmin = localStorage.getItem("staff");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit} = useDisclosure();
  const {isOpen: isOpenLink, onOpen: onOpenLink, onClose: onCloseLink} = useDisclosure();

  const [ target, setTarget ] = useState();
  const [ link, setLink ] = useState();
  const [ panelId, setPanelId ] = useState();

  const compare = ( a, b ) => {
    if ( a.week < b.week ) return -1;
    if ( a.week > b.week ) return 1;
    return 0;
  };

  // Render link
  useEffect(() => {
    fetch(`${backend_url}target/${code}/panels?target=tutorial`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then((r) => r.json())
      .then((data) => {
        setLink(data.link);
        setPanelId(data.id);
      });
  }, [setLink, code]);

  // Sets lecture state
  const renderTutorials = () => {
    fetch(`${backend_url}${code}/tutorials`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(r => r.json())
    .then(data => {
      handleTutorialState(data);
    });
  };

   // Post lecture
  const handleAddTutorialSubmit = (formData) => {
    // Post lecture
    fetch(`${backend_url}${code}/tutorial`, {
      method: "POST",
      body: formData[0],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then(data => {
      // Upload files 
      fetch(`${backend_url}tutorial/file/${data.tutorialId}`, {
      method: "POST",
      body: formData[1],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      }).then(renderTutorials);
    }).then(() => {
      renderTutorials();
    })
  };

  // Handle Edit
  const handleTutorialEdit = (formData) => {
    // PUT lecture
    fetch(`${backend_url}${code}/tutorial/${target}`, {
      method: "PUT",
      body: formData,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then( () => {
      renderTutorials();
    })
    setTarget();
  };

  // Handle Delete
  const handleDelete = (tutorialId) => {
    fetch(`${backend_url}${code}/tutorial/${tutorialId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then( () => {
      renderTutorials();
    })
  };

  // Handle link edit
  const handleLinkEdit = (form) => {
    fetch(`${backend_url}panel/${panelId}`, {
      method: "PUT",
      body: form,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then(r => {
      setLink(r.link);
    });
  };

  // Handle link clear
  const handleLinkClear = () => {
    const formData = new FormData();
    formData.append("link", "");

    fetch(`${backend_url}panel/${panelId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then( () => {
      renderTutorials();
    })
    setLink();
  };
  
  if (tutorials && tutorials.length) tutorials.sort(compare);

  return (
      <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} height="50%" borderColor="white" paddingTop="2%">
          <AccordionItem>
            {
              !searchFiles && 
              <AccordionItem width="99%">
                <Flex alignItems="center"> 
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Tutorial Videos
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {isAdmin == 1 && <><IconButton 
                    onClick={onOpenLink} 
                    backgroundColor="white" size="sm" 
                    marginLeft="1%" marginRight="0.5%" 
                    icon={<EditIcon />}
                  />
                  <EditLinkModal 
                    isOpen={isOpenLink} 
                    onClose={onCloseLink} 
                    isLectures 
                    onSubmit={handleLinkEdit}
                    code={code} 
                  />
                  <IconButton 
                    onClick={handleLinkClear} 
                    backgroundColor="white" 
                    size="sm" 
                    icon={<NotAllowedIcon />}
                  /></>}
                </Flex>
                <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  <Box flex="1" textAlign="left" padding="1%">
                    Tutorial recordings: 
                    {link ? 
                    <Link href={link} padding="1%" color="blue" isExternal>
                      {link}
                    </Link> : " N/A" }
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            }
              {
                (tutorials && tutorials.length) ? tutorials.map( tutorial => (
                  <AccordionItem key={tutorial.id} width="99%">
                    <Flex alignItems="center">  
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Week {tutorial.week}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton> 
                      {isAdmin == 1 && <><IconButton 
                        onClick={() => {
                          onOpenEdit();
                          setTarget(tutorial.id)
                        }}
                        backgroundColor="white" 
                        size="sm" 
                        marginLeft="1%" 
                        marginRight="0.5%" 
                        icon={<EditIcon />}
                      />
                      <EditTutorialModal 
                        isOpen={isOpenEdit} 
                        onClose={onCloseEdit} 
                        isLectures 
                        onSubmit={handleTutorialEdit}
                        lectureId={tutorial.id}
                        code={code} 
                      /> 
                      <IconButton backgroundColor="white" size="sm" icon={<DeleteIcon />} onClick={() => handleDelete(tutorial.id)} /></>}
                    </Flex>
                    <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                    <TutorialTable tutorial={tutorial} code={code} renderTutorials={renderTutorials}/>
                    </AccordionPanel>
                  </AccordionItem>)) : <></>
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
                  <TutorialTable lecture={tutorials} searchFiles={searchFiles} code={code} />
                  </AccordionPanel>
                </AccordionItem>
              }
          </AccordionItem>
          {
            (!searchFiles && isAdmin == 1) && 
            <Center width={{ base: '100%', lg: '100%' }} padding="1%">
              <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px'}} width="100%" backgroundColor="white">{buttonContents}</Button>
              <AddTutorialModal isOpen={isOpen} onClose={onClose} isLectures onSubmit={handleAddTutorialSubmit} code={code} /> 
            </Center>
          }
      </Accordion>
  )
}

export default TutorialTableContainer