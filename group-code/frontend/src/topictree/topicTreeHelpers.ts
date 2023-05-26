export function getButtonGroupStyles({
  active,
  leftCorner,
  rightCorner
}: {
  active: boolean;
  leftCorner?: boolean;
  rightCorner?: boolean;
}) {
  let classes =
    '-ml-px flex justify-center items-center border px-4 py-2 text-sm font-medium focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500';
  if (active) {
    classes +=
      ' z-10 border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-50';
  } else {
    classes += ' bg-white text-gray-700 hover:bg-gray-50';
  }

  if (leftCorner) {
    classes += ' rounded-l-md';
  }

  if (rightCorner) {
    classes += ' rounded-r-md';
  }

  return classes;
}
