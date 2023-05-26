import React from 'react';
import {
  useUpdateRoleMutation,
  useGetTopicRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation
} from 'features/api/apiSlice';

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
      {/* the outer div is for seperate buttons and checkboxs */}
      <div className="flex flex-wrap gap-6">
        {' '}
        {/* checkboxs */}
        <div>
          <label htmlFor="email" className="sr-only">
            Role Name
          </label>
          <div className="text-slate-500 ">Role Name</div>
          <input
            type="text"
            name="role_name"
            id="role_name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <fieldset>
          <legend className="sr-only">Permission Flags</legend>
          <div className="text-slate-500">Permissions</div>
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
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        {/* buttons */}
        <button
          className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
          Update
        </button>
        <button
          type="button"
          className="rounded-md bg-red-600 hover:bg-red-400 py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
  );
}

export default function RoleEditor(props: { topicId: number }) {
  const [selected, setSelected] = React.useState(0);
  const {
    data: topicRoles,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTopicRolesQuery({ topic_id: props.topicId });

  const [createRole, { isLoading: createRoleIsLoading }] =
    useCreateRoleMutation();

  const deleteRoleCallback = () => {
    if (selected > 0) setSelected(selected - 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-2">
      <div className="text-center py-4 px-10 bg-stone-300 font-mono text-2xl border-2 rounded-md m-4">
        Topic Roles
      </div>
      <div className="m-2">
        <button className="text-center py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md m-2 shadow-sm hover:bg-indigo-100">
          Back
        </button>
      </div>
      <div className="flex flex-wrap gap-4 m-4">
        <div className="mx-auto max-w-3xl grid grid-cols-2">
          <div className="overflow-hidden rounded-md bg-white shadow w-60">
            <ul role="list" className={'divide-y divide-gray-200'}>
              {isSuccess &&
                topicRoles.map((role: any, index: number) => (
                  <li
                    key={role.id}
                    className={
                      selected == index
                        ? 'bg-slate-300 px-12 py-8 hover:shadow hover:bg-grey text-center rounded-md'
                        : 'px-6 py-4 hover:shadow hover:bg-slate-100 text-center hover:cursor-pointer rounded-md'
                    }
                    onClick={() => setSelected(index)}
                  >
                    {role.name}
                  </li>
                ))}
            </ul>
            {/* For UI, I think this button would look best if it was at the very bottom of the list of roles, kinda stuck to the bottom of the screen */}
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
    </div>
  );
}
