import React, { useCallback } from 'react';

import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';

import { useMemo, useRef, useState } from 'react';
import { useGetThreadsQuery } from '../features/api/apiSlice';

import { formatDistance, subDays } from 'date-fns';
import parseISO from 'date-fns/parseISO';

import { Thread } from './forum.types';

import { ArrowUpIcon } from '@heroicons/react/20/solid';

type ThreadListProps = {
  sectionId: number;
  selectThreadCallback: (thread: Thread) => void;
};

function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export default function ThreadList(props: ThreadListProps) {
  const [currentBatch, setCurrentBatch] = useState(0);
  const [lastStartIndex, setLastStartIndex] = useState<number>();

  const batchSize = 20;
  const currentOffset = currentBatch * batchSize;
  const limit = 20;

  const lastResult = useGetThreadsQuery(
    { offset: currentOffset - 20, limit, sectionId: props.sectionId },
    { skip: currentOffset < limit }
  );
  const currentResult = useGetThreadsQuery({
    offset: currentOffset,
    limit,
    sectionId: props.sectionId
  });
  const nextResult = useGetThreadsQuery({
    offset: currentOffset + 20,
    limit,
    sectionId: props.sectionId
  });

  const hasNextPage = useMemo(() => {
    if (nextResult.data === undefined) {
      return false;
    }
    return nextResult.data.threads.length !== nextResult.data.limit;
  }, [nextResult]);

  type ThreadQueryType = {
    offset: number;
    limit: number;
    threads: Array<any>;
    total_count: number;
  };

  const combined = useMemo(() => {
    const arr = new Array(limit * (batchSize + limit));
    for (const data of [lastResult.data, currentResult.data, nextResult.data]) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (data) {
        arr.splice(data.offset, data.threads.length, ...data.threads);
      }
    }
    return arr;
  }, [
    limit,
    currentOffset,
    lastResult.data,
    currentResult.data,
    nextResult.data
  ]);

  const itemCount =
    currentResult.data !== undefined ? currentResult.data.total_count : 60;
  const isNextPageLoading = useMemo(() => {
    if (
      nextResult.data === undefined ||
      currentResult.data === undefined ||
      lastResult.data === undefined
    ) {
      return true;
    }
    return (
      lastResult.data.isLoading ||
      currentResult.data.isLoading ||
      nextResult.data.isLoading
    );
  }, [lastResult, currentResult, nextResult]);
  const loadNextPage = (startIndex: number, finishIndex: number) => {
    console.log(combined);
    if (startIndex === undefined) {
      setLastStartIndex(startIndex);
    }
    if (lastStartIndex !== undefined && startIndex > lastStartIndex) {
      setCurrentBatch(currentBatch + 1);
    } else if (lastStartIndex !== undefined && startIndex < lastStartIndex) {
      setCurrentBatch(currentBatch - 1);
    }
    setLastStartIndex(startIndex);
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const emptyFunc = () => {
    console.log('Empty func called');
  };
  //const loadMoreItems = isNextPageLoading ? emptyFunc : loadNextPage;
  const loadMoreItems = loadNextPage;
  const isItemLoaded = (index: number) => combined[index] !== undefined;
  const Item = ({ index, style }: any) => {
    let content;
    if (!isItemLoaded(index)) {
      content = <div>Loading...</div>;
    } else {
      const item =
        combined[index] !== undefined
          ? combined[index]
          : {
              id: -1,
              title: 'Loading...',
              content: 'Loading...',
              time: new Date(1970, 1, 1, 0, 0, 0),
              preview: '',
              author: {
                id: -1,
                name: 'Loading...',
                username: 'Loading...'
              },
              posts: [],
              upvotes: 0,
              stickied: false
            };
      content = (
        <div
          key={item.id}
          className="relative bg-white py-1 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50"
          onClick={() => props.selectThreadCallback(item)}
        >
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              {item.stickied && (
                <span className="inline-flex items-center rounded bg-green-100 px-2 text-xs font-medium text-green-800 m">
                  Stickied
                </span>
              )}
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="truncate text-sm text-gray-500">{item.content}</p>
              </a>
            </div>
            <div className="flex flex-col justify-center items-end">
              <time
                dateTime={item.time}
                className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
              >
                {formatDistance(
                  parseISO(item.time),
                  convertDateToUTC(new Date()),
                  {
                    addSuffix: true
                  }
                )}
              </time>
              <div className="">
                <button
                  type="button"
                  className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <ArrowUpIcon className="h-3 w-3" aria-hidden="true" />
                  <span>{item.upvotes}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-gray-600 line-clamp-2">{item.preview}</p>
          </div>
        </div>
      );
    }
    return <div style={style}>{content}</div>;
  };

  return (
    <div className="h-full overflow-hidden">
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                className="List"
                height={height}
                itemCount={itemCount}
                itemSize={84}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={width}
              >
                {Item}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}
