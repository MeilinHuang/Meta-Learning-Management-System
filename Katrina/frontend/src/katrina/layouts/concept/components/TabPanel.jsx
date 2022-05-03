import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AccordionDetails, Accordion, AccordionSummary } from 'katrina/components/Accordions';
import { Link } from 'react-router-dom';

import ReactQuill from 'react-quill';
import "react-quill/dist/quill.bubble.css";
import MDButton from 'components/MDButton';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

const modules = {
  syntax: {
    highlight: text => hljs.highlightAuto(text).value,
  },
  
};
function TabPanel({ value, index, lectureObj}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{width: '100%'}}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {
            lectureObj.lectures.map((l) => {
              return (
                <Accordion key={l.id}>
                  <AccordionSummary aria-controls={`${l.id}-content`} id={`${l.id}-header`}>
                    <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>{l.title}</Typography>
                    <Link
                      to={`/student/courses/${lectureObj.course_code}/${lectureObj.course_term}/${l.id}`}
                    >
                      <MDButton
                        variant="outlined" 
                        color='info'
                        size='small' 
                        sx={{m:1}}
                      >
                        View Lecture
                      </MDButton>
                    </Link>
                  </AccordionSummary>
                  <AccordionDetails>
                      <ReactQuill
                        theme="bubble"
                        value={l.html}
                        readOnly={true}
                        modules={modules}
                      />
                  </AccordionDetails>
                </Accordion>
              )
            })
          }
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default TabPanel;