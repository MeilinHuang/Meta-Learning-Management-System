import { capitalise } from 'content/contentHelpers';
import React, { useState, useEffect } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';

const MessageModal = (props: { show: any; close: any; message: any }) => {
  return (
    <>
      {props.show && (
        <div className="z-10 fixed inset-0 opacity-50 z-50"></div>
      )}
      <Modal
        show={props.show}
        onHide={props.close}
        className='z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      // className="fixed inset-0 z-10 overflow-y-auto justify-center items-center p-60"
      >
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left border-2 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          <Modal.Body>
            <h4 className="text-md font-medium leading-6 text-gray-900 pb-4">
              {props.message}
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="flex w-max mx-auto justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={props.close}
            >
              Close
            </button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default MessageModal;
