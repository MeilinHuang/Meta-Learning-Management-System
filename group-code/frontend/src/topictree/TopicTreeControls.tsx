import React from 'react';
import PathwayDropdown from './PathwayDropdown';
import { currPathT } from './types';

type TopicTreeControlsProps = { 
  currPath: currPathT; 
  setCurrPath: (currPath: currPathT) => void; 
  progress: number; 
  isSuperuser:boolean;
  pathwaysData: {
    userPathsData: {
      pathways: Array<any>, 
      error:any, 
      isLoading:boolean, 
      isSuccess:boolean
    }, 
    allPathsData: {
      pathways: Array<any>, 
      error:any, 
      isLoading:boolean, 
      isSuccess:boolean
    },
  }
};

export default function TopicTreeControls(props: TopicTreeControlsProps) {
  return (
    <>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0.4rem', justifyContent: 'space-between' }} className='bg-gray-50'>
        <div className="w-2/3" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <h2>Currently viewing:</h2>
          <PathwayDropdown 
            currPath={props.currPath} 
            setCurrPath={props.setCurrPath} 
            isSuperuser={props.isSuperuser}
            pathwaysData={props.pathwaysData}
          />
        </div>
        {!props.isSuperuser && 
          <div className="w-1/3">
            <div className="bg-neutral-600 dark:bg-neutral-600">
              <div
                className="bg-teal-600 p-0.5 text-center text-xs text-white font-medium leading-none"
                style={{ width: `${props.progress}%` }}>
                {props.progress}%
              </div>
            </div>
          </div>
        }
      </div>
      <hr className="mb-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </>
  )
}