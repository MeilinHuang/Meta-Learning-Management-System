import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import Delta from 'quill-delta';

// convert quill delta to html
export function convertDeltaToHtml(delta) {
  const converter = new QuillDeltaToHtmlConverter(delta, {});
  // console.log(converter.convert())

  // render custom object
  converter.renderCustomWith((customOp, contextOp) => {
    console.log("rendering custom object", customOp);
    switch (customOp.insert.type) {
      case "timestamp":
        return `<button class="ql-timestamp" value="${customOp.insert.value}">
                <span conteneditable="false">${secondsToTimestamp}</span>
            </button>`;

      case "concept":
        return `<button class="ql-concept" value="${customOp.insert.value}"><span contenteditable="false">${customOp.insert.value}</span></button>`

      case "page":
        return `<button class="ql-page" value="${customOp.insert.value}">
                <span conteneditable="false">Page ${customOp.insert.value}</span>
            </button>`;

      default:
        break;
    }
  });

  return converter.convert();
};

// filter out keyword from delta
export function filterDelta(deltaOps, keyword) {
  const delta = new Delta(deltaOps);
  const text = delta
    .filter((op) => containKeyword(op, keyword))
    .map((op) => op.insert[keyword] || op.attributes['link'].slice(9))
  return text;
}

function containKeyword(op, keyword) {
  // TOFIX: concept's identification
  const res = op.insert[keyword] !== undefined ||
    (
      op.attributes !== undefined &&
      op.attributes.link !== undefined &&
      op.attributes['link'].match(/^\/concept\/.+/) != null
    )
  return res;
}

// convert seconds to timestamp format "mm:ss"
export function secondsToTimestamp(seconds) {
  let min = parseInt(seconds / 60);
  min = min < 10 ? '0' + min : String(min);
  let sec = seconds % 60;
  sec = sec < 10 ? '0' + sec : String(sec);

  return String(min + ':' + sec);
}
