import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceIcon, formatDuration } from './contentHelpers';

import { useGetTopicResourcesQuery } from 'features/api/apiSlice';

export default function OverviewBar() {
  const topicId = useParams()['topicId'];
  const currSection = useParams()['section'];

  const { data: resourcesData } = useGetTopicResourcesQuery({
    topic_id: topicId,
    section: currSection
  });

  const [typesSummary, setTypesSummary] = useState<Array<[string, number]>>([]);

  // Update types summary when a new set of resources is shown
  useEffect(() => {
    if (resourcesData) {
      const typesSummaryObj = {};

      resourcesData.resources.forEach(
        (resource: { resource_type: string; duration: number }) => {
          const type = resource.resource_type;
          if (!(type in typesSummaryObj)) {
            typesSummaryObj[type] = 0;
          }
          typesSummaryObj[type] += resource.duration;
        }
      );

      const newTypesSummary: Array<[string, number]> =
        Object.entries(typesSummaryObj);

      newTypesSummary.sort((a: [string, number], b: [string, number]) => {
        return b[1] - a[1];
      });
      setTypesSummary(newTypesSummary.slice(0, 4));
    }
  }, [resourcesData]);

  return (
    <>
      {resourcesData && typesSummary.length > 0 && (
        <div className="flex divide-x items-center max-w-[48rem] rounded-md text-sm p-1 mb-2">
          {typesSummary.map(([type, duration], indx) => {
            return (
              <div key={indx} className="flex items-center px-3">
                <ResourceIcon
                  type={type}
                  className="w-[14px] mr-2 text-gray-500"
                  solid={true}
                />
                <span className="text-gray-800 text-xs font-medium hidden lg:flex">
                  {type + '\u00A0∙\u00A0'}
                </span>
                <span className="text-gray-800 text-xs font-medium">
                  {formatDuration(duration)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
