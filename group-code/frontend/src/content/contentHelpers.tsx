import {
  VideoCameraIcon,
  PhotoIcon,
  DocumentIcon,
  SpeakerWaveIcon,
  EllipsisHorizontalCircleIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

import {
  VideoCameraIcon as VideoCameraIconSolid,
  PhotoIcon as PhotoIconSolid,
  DocumentIcon as DocumentIconSolid,
  SpeakerWaveIcon as SpeakerWaveIconSolid,
  EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconSolid,
  LinkIcon as LinkIconSolid
} from '@heroicons/react/24/solid';
import { useGetTopicResourcesQuery } from 'features/api/apiSlice';

export const SERVER = 'http://localhost:8000';

export function ResourceIcon({
  type,
  className,
  solid
}: {
  type: string;
  className?: string;
  solid?: boolean;
}) {
  switch (type.toLowerCase()) {
    case 'video':
      return solid ? (
        <VideoCameraIconSolid aria-hidden="true" className={className} />
      ) : (
        <VideoCameraIcon aria-hidden="true" className={className} />
      );
    case 'document':
      return solid ? (
        <DocumentIconSolid aria-hidden="true" className={className} />
      ) : (
        <DocumentIcon aria-hidden="true" className={className} />
      );
    case 'slides':
      return solid ? (
        <PhotoIconSolid aria-hidden="true" className={className} />
      ) : (
        <PhotoIcon aria-hidden="true" className={className} />
      );
    case 'audio':
      return solid ? (
        <SpeakerWaveIconSolid aria-hidden="true" className={className} />
      ) : (
        <SpeakerWaveIcon aria-hidden="true" className={className} />
      );
    case 'file':
      return solid ? (
        <EllipsisHorizontalCircleIconSolid
          aria-hidden="true"
          className={className}
        />
      ) : (
        <EllipsisHorizontalCircleIcon
          aria-hidden="true"
          className={className}
        />
      );
    case 'link':
      return solid ? (
        <LinkIconSolid aria-hidden="true" className={className} />
      ) : (
        <LinkIcon aria-hidden="true" className={className} />
      );
    default:
      return solid ? (
        <DocumentIconSolid aria-hidden="true" className={className} />
      ) : (
        <DocumentIcon aria-hidden="true" className={className} />
      );
  }
}

export function formatDuration(duration: number) {
  const hours = Math.floor(duration / 60);
  return hours > 0
    ? `${hours} h ${duration - hours * 60} min`
    : `${duration} min`;
}

export function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getNextResourceIndex({
  currentResId,
  resources
}: {
  currentResId: number;
  resources: Array<{ id: number }>;
}): number {
  resources = getSortedResources(resources);
  for (let i = 0; i < resources.length; ++i) {
    if (resources[i].id == currentResId) {
      if (i + 1 == resources.length) {
        // no next resource
        return -1;
      } else {
        return resources[i + 1].id;
      }
    }
  }

  return -1;
}

export function getPrevResourceIndex({
  currentResId,
  resources
}: {
  currentResId: number;
  resources: Array<{ id: number }>;
}): number {
  resources = getSortedResources(resources);
  for (let i = 0; i < resources.length; ++i) {
    if (resources[i].id == currentResId) {
      if (i - 1 < 0) {
        // no prev resource
        return -1;
      } else {
        return resources[i - 1].id;
      }
    }
  }

  return -1;
}

// Returns link to access resource (either server_path for uploaded files or URL for linked files)
// If download === true, link to downloadable resource
export function getResourceLink({
  serverPath,
  url,
  download,
  resourceType
}: {
  serverPath: string;
  url: string;
  download?: boolean;
  resourceType: string;
}) {
  if (!serverPath && !url) {
    return '#';
  }

  if (resourceType === 'video' && download) {
    return SERVER + serverPath;
  }

  if (url) {
    return url;
  } else return SERVER + serverPath;
}

export function getTypeClass(type: string) {
  const resType = type.toLowerCase();
  let classes = 'relative pt-25 mt-5 flex justify-center w-full';
  switch (resType) {
    case 'document':
      return (classes += 'h-0 pb-[75%]');
    case 'video':
    case 'slides':
      return (classes += 'h-0 pb-[56.25%]');
    default:
      return classes;
  }
}

// Sort resources in increasing order based on their order_index
export function getSortedResources(resources: any) {
  return [...resources].sort(function (a: any, b: any) {
    return a.order_index - b.order_index;
  });
}

const permittedFormats = {
  video: ['mp4', 'webm', 'ogg'],
  audio: ['mp3', 'wav', 'ogg'],
  document: ['pdf'],
  slides: ['pdf'],
  file: []
};

export function getPermittedFormats(resource_type: string) {
  const currResourceType = resource_type as
    | 'video'
    | 'audio'
    | 'document'
    | 'slides'
    | 'file';
  const formats = permittedFormats[currResourceType].join(', ');
  if (permittedFormats[currResourceType].length === 0) {
    return '';
  } else if (permittedFormats[currResourceType].length === 1) {
    return 'Permitted format: ' + formats;
  } else {
    return 'Permitted formats: ' + formats;
  }
}

export function isPermittedFormat(resource_type: string, format: string) {
  const currResourceType = resource_type as
    | 'video'
    | 'audio'
    | 'document'
    | 'slides';
  if (permittedFormats[currResourceType].includes(format)) {
    return true;
  }
  return false;
}
