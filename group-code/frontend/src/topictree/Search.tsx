import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { Node, Edge } from 'reactflow';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchTopics } from './types';

type SearchProps = {
  selectedTopic: Node | null;
  selectedPrereq: Edge | null;
  searchTopics: SearchTopics;
  setSelection: (node: Node|string|null, edge: Edge|string|null) => void;
}

const DropdownIndicator = (props:any) => {
  return (
    <components.DropdownIndicator {...props}>
      <MagnifyingGlassIcon className="text-gray-800 w-5 h-5" />
    </components.DropdownIndicator>
  );
};


export default function Search(props: SearchProps) {
  const [currVal, setCurrVal] = useState<{label: string; value: string; group: string}>(props.selectedTopic ? {label: props.selectedTopic.data.label, value: props.selectedTopic.id, group: 'Topic'} : (props.selectedPrereq && props.selectedPrereq.data && props.selectedPrereq.data.label ? {label: props.selectedPrereq.data.label, value: props.selectedPrereq.id, group: 'Pre-req relationship'}  : {label: '', value: '', group: ''}));

  useEffect(() => {
    if (props.selectedTopic){
      setCurrVal({label: props.selectedTopic.data.label, value: props.selectedTopic.id, group: 'Topic'})
    } else if (props.selectedPrereq) {
      setCurrVal({label: props.selectedPrereq.data.label, value: props.selectedPrereq.id, group: 'Pre-req relationship'})
    } else {
      setCurrVal({label: '', value: '', group: ''});
    }
  }, [props.selectedTopic, props.selectedPrereq])

  return (
    <div className="pb-1 px-5 w-full">
      <h1 className=" pb-1 text-lg font-medium text-white">Search:</h1>
      <Select
        name="search"
        options={props.searchTopics}
        value={currVal}
        className="hidden sm:block basic-select w-full w-text-sm text-sm text-left"
        classNamePrefix="select"
        placeholder="Search..."
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary25: '#eef2ff',
            primary: '#818cf8'
          }
        })}
        components={{ DropdownIndicator }}
        maxMenuHeight={400}
        onChange={(e) => {
          if (e) {
            setCurrVal({label: e.label, value: e.value, group: e.group});
            if(e.group === 'Topic') {
              props.setSelection(e.value, null);
            } else if (e.group === 'Pre-req relationship'){
              props.setSelection(null, e.value);
            } else if (e.group === '') {
              props.setSelection(null, null);
            }
          }
        }}
        aria-label="Topic Tree Search bar"
      />
    </div>
  )
}