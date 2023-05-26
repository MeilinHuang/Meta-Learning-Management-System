import { getResourceLink, getTypeClass } from './contentHelpers';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import MDEditor from '@uiw/react-md-editor';
import AudioPlayer from 'react-modern-audio-player';
import PdfViewer from './PdfViewer/PdfViewer';

import {
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Resource({
  url,
  type,
  title,
  id
}: {
  url: string;
  type: string;
  title: string;
  id: string;
}) {
  return (
    <div className={getTypeClass(type)}>
      {type === 'video' && (
        <iframe
          className="absolute t-0 l-0 w-full h-full"
          src={url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
      {type === 'document' && (
        <PdfViewer url={url} title={title} id={id} />
        // Alternative: embed PDF using iframe
        // <iframe
        //   className="absolute t-0 l-0 w-full h-full"
        //   src={url + '#view=FitH'}
        //   title={title}
        // />
      )}
      {type === 'slides' && (
        <PdfViewer url={url} title={title} id={id} slides={true} />
        // <iframe
        //   className="absolute t-0 l-0 w-full h-full"
        //   src={url}
        //   width="476px"
        //   height="288px"
        // ></iframe>
      )}
      {type === 'audio' && (
        <AudioPlayer
          playList={[
            {
              name: title,
              img: 'https://www.vhv.rs/dpng/d/22-226200_transparent-sound-wave-logo-hd-png-download.png',
              src: url,
              id: 1
            }
          ]}
          activeUI={{
            all: true,
            playList: false,
            trackInfo: false
          }}
          // Alternative: HTML5 audio element
          // <audio controls>
          //   <source src={url} type="audio/mpeg" />
          //   Your browser does not support the audio element.
          // </audio>
        />
      )}
      {type === 'link' && (
        <a
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          target="_blank"
          href={url}
        >
          <ArrowTopRightOnSquareIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
          View {title}
        </a>
      )}
      {type === 'file' && (
        <a
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          target="_blank"
          href={url}
          download
        >
          <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Download {title}
        </a>
      )}
    </div>
  );
}
