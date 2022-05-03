// code modified from https://codesandbox.io/s/j569z?file=/src/EditorToolbar.js

import React from "react";
import { p as Player } from '../VideoPlayer';
import { myPageRef, setPage } from '../PdfViewer';
import { Quill } from "react-quill";
import hljs from 'highlight.js';
import 'react-quill/dist/quill.core.css'
import 'react-quill/dist/quill.bubble.css'
import 'highlight.js/styles/monokai-sublime.css';
import './Toolbar.css';
import { secondsToTimestamp } from "katrina/helperFunctions/helperFunctions";
Quill.debug('error');

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "lucida",
  "monospace",
];
Quill.register(Font, true);

/*  ================= Video timestamp button ==================== */

// handle video timestamp navigation
const handleTimestampButton = (e) => {
  // if the current page is editor page (lecture page), seek to timestamp. Else, do nothing
  const urlRegx = /courses\/[A-Z]{4}[0-9]{4}\/[A-Z0-9]{4}\/\d+/i 
  if (window.location.href.match(urlRegx) !== null && Player != null) {
    Player.seekTo(e.target.parentNode.value);
  }
}

// create an embed timestamp button
let BlockEmbed = Quill.import('blots/embed');
class TimestampBlot extends BlockEmbed {
  static create(seconds) {
    let node = super.create();
    const timestampText = secondsToTimestamp(seconds);
    node.innerText = timestampText;
    node.value = seconds;
    return node;
  }

  constructor(node) {
    super(node);
    // add event listener to each timestamp button
    node.addEventListener('click', handleTimestampButton);
  }

  static value(node) {
    // return node.getAttribute('seconds');
    return node.value;
  }
}
TimestampBlot.blotName = 'timestamp';
TimestampBlot.tagName = 'button';
TimestampBlot.className = 'ql-timestamp';
Quill.register(TimestampBlot);

function insertTimestamp () {
  const cursorPosition = this.quill.getSelection().index;
  // check selection format

  // insert default timestamp
  this.quill.insertEmbed(cursorPosition, 
                        'timestamp', 
                        parseInt(Player.getCurrentTime()), 
                        Quill.sources.USER);
  this.quill.setSelection(cursorPosition + 1, Quill.sources.SILENT);
  // const selectedLength = this.quill.getSelection().length;
};

/*  ================= Concept page insert button ==================== */

function handleConceptButton(e){
  let value;
  if (e.target.parentNode.value === undefined){
    value = e.target.value
  } else {
    value = e.target.parentNode.value
  }

  if (window.location.href.indexOf('student') > -1)
    window.open(`/student/knowledge-base/${value}`)
}

// let Inline = Quill.import('blots/inline');
class ConcBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.innerText = value;
    node.value = `${value}`.toLowerCase();
    return node;
  }

  constructor(node) {
    super(node);
    // add event listener to each timestamp button
    node.addEventListener('click', handleConceptButton);
  }

  static value(node) {
    return node.value;
  }
}
ConcBlot.blotName = 'concept';
ConcBlot.tagName = 'button';
ConcBlot.className = 'ql-concept';
Quill.register(ConcBlot);

function insertConcept () {
  const cursorPosition = this.quill.getSelection()?.index;
  let value = prompt("Enter concept to insert:");
  // // insert default timestamp
  while (value.match(/^\s*$/i) || value.match(/^[0-9].*/)) {
    value = prompt("Please check: \n 1. Don't enter empty string. \n 2. The first character can only be letters. \n\nEnter concept to insert:");
  }

  const keyword = `${value.trimEnd().trimStart()}`;
  this.quill.insertEmbed(cursorPosition, 
    'concept', 
    keyword,  // remove starting and trailing spaces
    Quill.sources.USER);
  this.quill.setSelection(cursorPosition + value.length, Quill.sources.SILENT)
} 

/*  ================= Lecture slices page locator ==================== */

// handle lecture slides page locator
const handlePageButton = (e) => {
  // if the current page is editor page (lecture page), seek to page. Else, do nothing
  const urlRegx = /courses\/[A-Z]{4}[0-9]{4}\/[A-Z0-9]{4}\/\d+/i;
  if (window.location.href.match(urlRegx) !== null) {
    setPage(parseInt(e.target.parentNode.value));
    console.log(e.target.parentNode)
  }
}

// create an embed timestamp button
class PageBlot extends BlockEmbed {
  static create(page) {
    let node = super.create();
    node.innerText = 'Page ' + page;
    node.value = page;
    return node;
  }

  constructor(node) {
    super(node);
    // add event listener to each timestamp button
    node.addEventListener('click', handlePageButton);
  }

  static value(node) {
    return node.value;
  }
}
PageBlot.blotName = 'page';
PageBlot.tagName = 'button';
PageBlot.className = 'ql-page';
Quill.register(PageBlot);

function insertPage () {
  const cursorPosition = this.quill.getSelection().index;
  const jumpTo = parseInt(myPageRef.getAttribute('data-page-number'));
  if (isNaN(jumpTo)) alert("You cannot insert Non-number page");
  else {
    // insert current page number
    this.quill.insertEmbed(cursorPosition, 
                          'page', 
                          jumpTo,
                          Quill.sources.USER); 
    this.quill.setSelection(cursorPosition + jumpTo.toString().length, Quill.sources.SILENT);

  }
};


// Modules object for setting up the Quill editor
export const modules = {
  syntax: {
    highlight: text => hljs.highlightAuto(text).value,
  },
  toolbar: {
    container: "#toolbar",
    tooltip: true,
    // image-tooltip: true,
    // link-tooltip: true,
    handlers: {
      undo: undoChange,
      redo: redoChange,
      timestamp: insertTimestamp,
      concept: insertConcept,
      page: insertPage,
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "code",
  "timestamp",
  "concept",
  "page",
];
 

// Quill Toolbar component
export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="lucida">Lucida</option>
      </select>
      <select className="ql-size" defaultValue="medium">
        {/* <option value="extra-small">Extra Small</option> */}
        <option value="small">Small</option>
        <option value="medium"></option>
        <option value="large">Large</option>
      </select>
      <select className="ql-header" defaultValue="false">
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="4" />
        <option value="5" />
        <option value="6" />
        <option value="false">Body</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" data-tooltip="Bold (Ctrl+B)" title="Bold"/>
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
    </span>
    <span className="ql-formats">
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-video" />
    </span>
    <span className="ql-formats">
      <button className="ql-formula" />
      <button className="ql-code-block" />
      <button className="ql-code" />
      <button className="ql-clean" />
    </span>
    <span className="ql-formats">
      <button className="ql-undo">
        <CustomUndo />
      </button>
      <button className="ql-redo">
        <CustomRedo />
      </button>
    </span>
    <span className="ql-formats">
      <button className="ql-timestamp" disabled={Player === undefined} style={{color: 'black', fontWeight: 'bold'}}>+T</button>
    </span>
    <span className="ql-formats">
      <button className="ql-concept" style={{color: 'black', fontWeight: 'bold'}}>+C</button>
    </span>
    <span className="ql-formats">
      <button className="ql-page" disabled={myPageRef === undefined} style={{ color: 'black', fontWeight: 'bold' }}>+P</button>
    </span>
  </div>
)


export default QuillToolbar;
