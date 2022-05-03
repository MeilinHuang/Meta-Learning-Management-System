import React from 'react';
import YoutubePlayer from 'react-player/youtube';
import { Container } from '@mui/material';
// import { handleTimestampButton } from './TextEditor/Toolbar.js';

let p = null;

const VideoPlayer = ({ url }) => {
  const [player, setPlayer] = React.useState();
  React.useEffect(() => {
    p = player;
  }, [player]);
  return (
    <Container p={3}>
      {
        (url === '' || !url) 
        ? <h4>[Video not available]</h4>
        : (
          <YoutubePlayer 
              height='400px' 
              width='100%' 
              ref={(p) => setPlayer(p)}
              url={url} 
              controls={true} 
              config={{
                  youtube: {
                      playerVars: {
                        start: 0,
                        rel: 0
                      }
                    }
              }}
          />
        )
      }
    </Container>
  );
};

export { p };
export default VideoPlayer;