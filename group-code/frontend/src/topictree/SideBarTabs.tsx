import React from 'react';

type SideBarTabsProps = {
  tabOpen: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete',
  setTabOpen: (tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete') => void,
  isSuperuser: boolean;
}

export default function SideBarTabs(props: SideBarTabsProps) {
  return (
    <div className="flex flex-col items-center w-16 py-8 space-y-2 bg-indigo-500 dark:bg-indigo-500  dark:border-gray-700">
      <button 
        title='Topic tree Help and documentation'
        onClick={() => (props.tabOpen !== 'help') ? props.setTabOpen('help') : props.setTabOpen('none') } 
        className={
          props.tabOpen === 'help' 
          ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
          : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
        }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p>Help</p>
      </button>

      <button
        title='Topic Tree Search'
        onClick={() => (props.tabOpen !== 'search') ? props.setTabOpen('search') : props.setTabOpen('none') } 
        className={
          props.tabOpen === 'search' 
          ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
          : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
        }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Search</p>
      </button>

      <button 
        title='Details'
        onClick={() => (props.tabOpen !== 'details') ? props.setTabOpen('details') : props.setTabOpen('none') } 
        className={
          props.tabOpen === 'details' 
          ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
          : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
        }>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <p>Details</p>
      </button>

      {props.isSuperuser && 
        <>    
          <button 
            title='Edit'
            onClick={() => (props.tabOpen !== 'edit') ? props.setTabOpen('edit') : props.setTabOpen('none') } 
            className={
              props.tabOpen === 'edit' 
              ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
              : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
            }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <p>Edit</p>
          </button>
    
          <button 
            title='Add'
            onClick={() => (props.tabOpen !== 'add') ? props.setTabOpen('add') : props.setTabOpen('none') } 
            className={
              props.tabOpen === 'add' 
              ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
              : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
            }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Add</p>
          </button>
    
          <button 
            title='Delete'
            onClick={() => (props.tabOpen !== 'delete') ? props.setTabOpen('delete') : props.setTabOpen('none') } 
            className={
              props.tabOpen === 'delete' 
              ? "flex flex-col items-center w-14 py-3 text-xs text-white bg-indigo-800 rounded-lg"
              : "flex flex-col items-center w-14 py-3 text-xs text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-600"
            }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <p>Delete</p>
          </button>
        </>
      }
    </div>
  )
}