import { useState } from 'react';
import { getButtonGroupStyles } from './topicTreeHelpers';

export default function Button({
  cy,
  expandCollapseApi
}: {
  cy: any;
  expandCollapseApi: any;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="hidden md:inline-block ml-4">
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          type="button"
          className={getButtonGroupStyles({
            active: !collapsed,
            leftCorner: true
          })}
          onClick={() => {
            if (cy && expandCollapseApi) {
              expandCollapseApi.expandAll();
              setCollapsed(false);
            }
          }}
        >
          Topics
        </button>

        <button
          type="button"
          className={getButtonGroupStyles({
            active: collapsed,
            rightCorner: true
          })}
          onClick={() => {
            if (cy && expandCollapseApi) {
              expandCollapseApi.collapseAll();
              setCollapsed(true);
            }
          }}
        >
          Groups
        </button>
      </span>
    </div>
  );
}
