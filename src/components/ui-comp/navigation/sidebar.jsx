import PropTypes from 'prop-types';

import { Fragment } from 'react';

// headless ui
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

// other
import { LogOut, XIcon } from 'lucide-react';
import { classNames } from '../../../lib/utils';
import { Link, NavLink, useNavigate } from 'react-router-dom';

//eslint-disable-next-line
function SidebarContent({ navigation, title, onLogout, onClose }) {
  const navigate = useNavigate();

  return (
    <div className='flex grow flex-col overflow-y-auto bg-blue-600 px-6 p-4 w-full'>
      <div className='flex w-full'>{title}</div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-4'>
              {Array.isArray(navigation)
                ? navigation.map(item => (
                    <li key={item?.name}>
                      <NavLink
                        to={item?.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700',
                            'group flex gap-x-5 items-center rounded-md p-2 text-sm leading-6 font-semibold'
                          )
                        }
                        onClick={e => {
                          e.preventDefault();
                          onClose(e);
                          navigate(item?.href);
                        }}
                      >
                        <span>{item?.icon && <item.icon className={'h-5 w-5 shrink-0'} aria-hidden='true' />}</span>
                        <span>{item?.name}</span>
                      </NavLink>
                    </li>
                  ))
                : ''}
            </ul>
          </li>
          <li className='mt-auto'>
            <Link
              to='#'
              className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white'
              onClick={onLogout}
            >
              <LogOut className='h-6 w-6 shrink-0 text-blue-200 group-hover:text-white' aria-hidden='true' />
              Log Out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default function Sidebar({ isOpen, navigation, onClose, title, onLogout }) {
  return (
    <>
      <div className={'relative z-[1010]'}>
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as='div' className='relative z-[1010] lg:hidden' onClose={onClose}>
            <TransitionChild
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </TransitionChild>

            <div className='fixed inset-0 flex'>
              <TransitionChild
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <DialogPanel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <TransitionChild
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                      <button type='button' className='-m-2.5 p-2.5' onClick={onClose}>
                        <span className='sr-only'>Close sidebar</span>
                        <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <SidebarContent onClose={onClose} onLogout={onLogout} title={title} navigation={navigation} />
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition.Root>

        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
          <SidebarContent onClose={onClose} onLogout={onLogout} title={title} navigation={navigation} />
        </div>
      </div>
    </>
  );
}

const navigationType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
  })
);

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  navigation: navigationType,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

SidebarContent.propTypes = {
  navigation: navigationType,
  onLogout: PropTypes.func.isRequired,
};
