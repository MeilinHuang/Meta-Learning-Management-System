import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useUpdateRoleMutation,
  useGetTopicRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetEnrolledUsersQuery,
  useGetUserRolesQuery,
  useUpdateUserRolesMutation,
  useGetTopicPermissionQuery
} from 'features/api/apiSlice';

import Select from 'react-select';

function RoleSettings(props: {
  roleId: number;
  name: string;
  perms: { permName: boolean };
  deleteCallback: () => void;
}) {
  const [roleName, setRoleName] = React.useState('');

  React.useEffect(() => {
    setRoleName(props.name);
  }, [props.name]);

  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const [updateRole, { isLoading: updateRoleIsLoading }] =
    useUpdateRoleMutation();
  const [deleteRole, { isLoading: deleteRoleIsLoading }] =
    useDeleteRoleMutation();

  const fixedPerms: {
    value: boolean;
    originalPermName: string;
    fixedPermName: string;
  }[] = [];
  for (const [key, value] of Object.entries(props.perms)) {
    const obj = {
      value: value,
      originalPermName: key,
      fixedPermName: toTitleCase(key.replace('can_', '').split('_').join(' '))
    };
    fixedPerms.push(obj);
  }

  function formatPerms(
    toFormat: {
      value: boolean;
      originalPermName: string;
      fixedPermName: string;
    }[]
  ) {
    const result = {};
    toFormat.forEach((perm) => {
      result[perm.originalPermName] = perm.value;
    });
    return result;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* Role name */}
      <div className="flex flex-wrap gap-6">
        <div>
          <label htmlFor="email" className="sr-only">
            Role Name
          </label>
          <div className="text-slate-500 mb-1">Role Name</div>
          <input
            type="text"
            name="role_name"
            id="role_name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        {/* Permission checkboxes */}
        <fieldset>
          <legend className="sr-only">Permission Flags</legend>
          <div className="text-slate-500 mb-1">Permissions</div>
          <div className="space-y-5">
            {fixedPerms.map((perms, index) => (
              <div
                className="relative flex items-start"
                key={`${props.roleId}/${perms.originalPermName}`}
              >
                <div className="flex h-6 items-center">
                  <input
                    id={perms.originalPermName}
                    aria-describedby="offers-description"
                    name={perms.originalPermName}
                    type="checkbox"
                    defaultChecked={perms.value}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={() => (fixedPerms[index].value = !perms.value)}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor={perms.originalPermName}
                    className="font-medium text-gray-900"
                  >
                    {perms.fixedPermName}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
        {/* Update / delete buttons */}
        <div className="flex w-full">
          <button
            className="w-1/2 mr-2 rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              if (!updateRoleIsLoading) {
                updateRole({
                  role_id: props.roleId,
                  role_name: roleName,
                  permissions: formatPerms(fixedPerms)
                });
              }
            }}
          >
            Update Role
          </button>
          <button
            type="button"
            className="w-1/2 text-white rounded-md bg-red-600 hover:bg-red-400 py-1.5 px-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset"
            onClick={() => {
              if (!deleteRoleIsLoading) {
                deleteRole({ role_id: props.roleId });
                props.deleteCallback();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoleEditor(props: { topicId: number }) {
  const { topicId } = useParams();

  const [selected, setSelected] = React.useState(0);
  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  }>();

  const [formattedUsers, setFormattedUsers] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [formattedRoles, setFormattedRoles] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [selectedRoles, setSelectedRoles] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const {
    data: topicRoles,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTopicRolesQuery({ topic_id: props.topicId });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersIsLoading
  } = useGetEnrolledUsersQuery({ topic_id: Number(topicId) });

  const {
    data: userRolesData,
    error: userRolesError,
    isLoading: userRolesIsLoading
  } = useGetUserRolesQuery({
    user_id: selectedUser
      ? Number(selectedUser.value)
      : Number(localStorage.getItem('user_id')),
    topic_id: Number(topicId)
  });

  const [createRole, { isLoading: createRoleIsLoading }] =
    useCreateRoleMutation();

  const deleteRoleCallback = () => {
    if (selected > 0) setSelected(selected - 1);
  };

  const [updateUserRoles, { isLoading: updateUserRolesIsLoading }] =
    useUpdateUserRolesMutation();

  useEffect(() => {
    if (usersData) {
      setFormattedUsers(
        usersData.map((user: { id: number; username: string }) => {
          return {
            label: user.username,
            value: `${user.id}`
          };
        })
      );
    }
  }, [usersData]);

  useEffect(() => {
    if (topicRoles) {
      setFormattedRoles(
        topicRoles.map((role: { name: string; id: number }) => {
          return {
            label: role.name,
            value: `${role.id}`
          };
        })
      );
    }
  }, [topicRoles]);

  useEffect(() => {
    if (userRolesData) {
      setSelectedRoles(
        userRolesData.map((role: { name: string; id: number }) => {
          return {
            label: role.name,
            value: `${role.id}`
          };
        })
      );
    }
  }, [userRolesData]);

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        {/* Edit roles */}
        <div className="relative flex justify-start">
          <span className="bg-white pr-3 text-sm font-semibold leading-6 text-gray-900">
            Edit Roles
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 mb-8">
        <div className="mx-auto grid grid-cols-2">
          <div className="overflow-hidden rounded-md bg-white shadow w-60">
            <ul role="list" className={'divide-y divide-gray-200'}>
              {isSuccess &&
                topicRoles.map((role: any, index: number) => (
                  <li
                    key={role.id}
                    className={
                      selected == index
                        ? 'bg-indigo-100 px-12 py-8 hover:shadow hover:bg-grey text-center rounded-md'
                        : 'px-6 py-4 hover:shadow hover:bg-slate-100 text-center hover:cursor-pointer rounded-md'
                    }
                    onClick={() => setSelected(index)}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {role.name}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="rounded text-center bg-indigo-50 py-2 px-5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 m-2"
                onClick={() => {
                  if (!createRoleIsLoading) {
                    createRole({
                      topic_id: props.topicId,
                      permissions: {},
                      role_name: 'New Role'
                    });
                    setTimeout(() => {
                      setSelected(selected + 1);
                    }, 100);
                  }
                }}
              >
                Add New Role
              </button>
            </div>
          </div>

          <div
            className={topicRoles && topicRoles.length == 0 ? 'invisible' : ''}
          >
            <RoleSettings
              perms={
                topicRoles !== undefined
                  ? topicRoles[selected].perms
                  : { perms: {} }
              }
              name={topicRoles !== undefined ? topicRoles[selected].name : ''}
              roleId={topicRoles !== undefined ? topicRoles[selected].id : -1}
              deleteCallback={deleteRoleCallback}
            />
          </div>
        </div>
      </div>
      {/* Assign roles */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-3 text-sm font-semibold leading-6 text-gray-900">
            Assign Roles
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 mb-32">
        {/* Select user */}
        <div className="w-full flex items-center">
          <label
            htmlFor="name"
            className="w-1/6 block text-sm mr-3 font-medium text-gray-700"
          >
            User
          </label>
          <Select
            name="user"
            options={formattedUsers}
            className="basic-multi-select mt-1 block w-5/6 text-sm text-left"
            classNamePrefix="select"
            maxMenuHeight={100}
            value={selectedUser}
            onChange={(e) => {
              if (e) {
                const user = formattedUsers.filter(
                  (user) => user.value === e.value
                )[0];
                setSelectedUser(user);
              }
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: '#eef2ff',
                primary: '#818cf8'
              }
            })}
          />
        </div>
        {selectedUser && (
          <>
            {/* User roles */}
            <div className="w-full flex items-center">
              <label
                htmlFor="name"
                className="block w-1/6 text-sm mr-3 font-medium text-gray-700"
              >
                {selectedUser && `${selectedUser.label}'s roles`}
              </label>
              <Select
                name="roles"
                options={formattedRoles}
                isMulti
                className="w-5/6 basic-multi-select mt-1 block text-sm text-left"
                classNamePrefix="select"
                maxMenuHeight={90}
                value={selectedRoles}
                onChange={(e) => {
                  setSelectedRoles([...e]);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary25: '#eef2ff',
                    primary: '#818cf8'
                  }
                })}
              />
            </div>
            {/* Submit button */}
            <div className="w-full flex justify-end">
              <button
                className="w-1/2 mt-2 rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  updateUserRoles({
                    user_id: Number(selectedUser.value),
                    topic_id: Number(topicId),
                    roles: selectedRoles.map((role: { value: string }) =>
                      Number(role.value)
                    )
                  });
                }}
              >
                Update User Roles
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
