import { Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MDTypography from 'components/MDTypography';
import React from 'react';
import { Link } from 'react-router-dom';


const ConceptAlphabet = ({ conceptList }) => {

  const alphabet = [];
  for (let size = 26; size > 0; size--) alphabet.push([]);

  const startWith = (e) => e.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
  const codeToChar = (code) => String.fromCharCode('A'.charCodeAt(0) + code);
  conceptList.forEach(ele => alphabet[startWith(ele)].push(ele));

  if (conceptList.length === 0) {
    return <h4>You don't have concept.</h4>
  }

  const renderList = (list, offset) => 
    list.map((ch, idx) => (
      <Box display='flex' flexDirection='row' key={idx} p={1}>
        <Box width='30px'>
          <MDTypography variant='h4' id={`#${codeToChar(idx + offset)}`}>{codeToChar(idx + offset)}</MDTypography>
        </Box>
        <Box ml={3}>
          <ul>
            {
              ch.map(c =>
                <li key={c}>
                  <Link to={`/student/knowledge-base/${c}`}>{c}</Link>
                </li>)
            }
          </ul>
        </Box>
      </Box>
    ))
  

  return (
    <Box display='flex' flexDirection='row'>
      <Grid container p={2} spacing={3}>
        <Grid item xs={6}>
          {
            renderList(alphabet.slice(0, alphabet.length / 2), 0)
          }
        </Grid>
        <Grid item xs={6}>
          {
            renderList(alphabet.slice(alphabet.length / 2), alphabet.length / 2)
          }
        </Grid>
      </Grid>

    </Box>
  );
}

export default ConceptAlphabet;