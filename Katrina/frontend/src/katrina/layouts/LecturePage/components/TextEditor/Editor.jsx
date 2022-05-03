import React from "react";
import ReactQuill from "react-quill";
import Toolbar, { modules, formats } from "./Toolbar";
import "react-quill/dist/quill.snow.css";
import { Box } from "@mui/system";
import MDButton from "components/MDButton";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import MDTypography from "components/MDTypography";

const Editor = ({ currentTime, setCurrentTime, value, lastUpdate, handleChange, handleSave, handlePublic }) => {
  
  return (
    <Box sx={{width: '40%', p:3}}>
      <Box 
        display='flex' 
        flexDirection='row' 
        alignItems='baseline'

      >
        <MDButton
          variant="gradient"
          onClick={handleSave}
          color="info"
          size="large"
          sx={{marginBottom: 2}}
        >
          Save
        </MDButton>
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch 
                checked={value.is_public}
                onChange={handlePublic}
                inputProps={{ 'aria-label': 'controlled' }}        
              />
            } 
            label="Public" 
            labelPlacement='bottom'
          />
        </FormGroup>
      </Box>
      <MDTypography variant='subtitle2'>Last modified: {lastUpdate} </MDTypography>
      <Toolbar currentTime={currentTime} setCurrentTime={setCurrentTime}/>
      <ReactQuill
        theme="snow"
        style={{ height:'600px', maxHeight: '70%'}}
        value={value.html}
        onChange={handleChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
      
    </Box>
  );
}

export default Editor;
