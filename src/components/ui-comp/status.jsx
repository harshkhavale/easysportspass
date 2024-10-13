import { classNames } from '../../lib/utils';

// eslint-disable-next-line
export default function Status({ type = 'green', text }) {
  return (
    <span
      className={classNames(
        type === 'green'
          ? 'bg-green-50 text-green-700 ring-green-600/20'
          : type === 'red'
          ? 'bg-red-50 text-red-700 ring-red-600/20'
          : type === 'yellow'
          ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
          : type === 'orange'
          ? 'bg-orange-50 text-orange-700 ring-orange-600/20'
          : type === 'blue'
          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
          : type === 'slate'
          ? 'bg-slate-50 text-slate-700 ring-slate-600/20'
          : '',
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
      )}
    >
      {text}
    </span>
  );
}
