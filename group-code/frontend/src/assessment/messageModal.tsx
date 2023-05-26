import React, { useState, useEffect } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';

const MessageModal = (props: { show: any; close: any; message: any }) => {
  return (
    <>
      <Modal
        show={props.show}
        cancel={props.close}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <Modal.Body>
            <h4 className="text-lg font-medium leading-6 text-gray-900">
              {props.message}
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
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
