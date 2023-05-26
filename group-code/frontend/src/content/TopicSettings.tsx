import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  UsersIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/20/solid';
import { getButtonGroupStyles } from 'topictree/topicTreeHelpers';

import RoleEditor from '../account/RoleEditor2';
import EditTopicForm from './EditTopicForm';
import DeleteArchiveForm from './DeleteArchiveForm';

import { useIsSuperuserQuery } from 'features/api/apiSlice';

export default function TopicSettings() {
  const [rolesMode, setRolesMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const { topicId } = useParams();
  const [superuser, setSuperuser] = useState(false);

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setSuperuser(true);
    }
  }, [superuserData]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Modes button group - manage roles, edit, archive/delete */}
      {superuser && (
        <div className="flex w-full lg:w-3/4">
          <button
            type="button"
            className={
              getButtonGroupStyles({
                active: rolesMode,
                leftCorner: true
              }) + ' grow'
            }
            onClick={() => {
              setRolesMode(true);
              setEditMode(false);
              setDeleteMode(false);
            }}
          >
            <UsersIcon className="w-4 h-4 mr-2" />
            <span>Edit Roles</span>
          </button>
          <button
            type="button"
            className={
              getButtonGroupStyles({
                active: editMode
              }) + ' grow'
            }
            onClick={() => {
              setRolesMode(false);
              setEditMode(true);
              setDeleteMode(false);
            }}
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            <span>Edit Info</span>
          </button>
          <button
            type="button"
            className={
              getButtonGroupStyles({
                active: deleteMode,
                rightCorner: true
              }) + ' grow'
            }
            onClick={() => {
              setRolesMode(false);
              setEditMode(false);
              setDeleteMode(true);
            }}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            <span>Archive/Delete</span>
          </button>
        </div>
      )}
      <div className="mt-7 w-full lg:w-3/4">
        {rolesMode && <RoleEditor topicId={Number(topicId) || 0} />}
        {editMode && <EditTopicForm />}
        {deleteMode && <DeleteArchiveForm />}
      </div>
    </div>
  );
}
