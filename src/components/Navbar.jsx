import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useMediaQuery } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';

import { publicNavigation } from '../constants/navigation';
import { Button } from '../components/ui-comp/button/button';
import { classNames } from '../lib/utils';

export default function Navbar() {
  const lgMatches = useMediaQuery('(min-width: 65rem)');
  return (
    <Disclosure
      as='nav'
      className={classNames(
        lgMatches ? 'bg-white shadow fixed top-0 left-0 w-full' : 'bg-white shadow fixed top-0 left-0 w-full z-[10000]'
      )}
    >
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button */}
                <DisclosureButton className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </DisclosureButton>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex flex-shrink-0 items-center'>
                  <h1 className='hidden lg:block font-bold text-3xl text-blue-600 '>EasySportsPass</h1>
                  <h1 className='block lg:hidden font-bold text-xl text-blue-600 '>EasySportsPass</h1>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                <div className='flex gap-6 items-center'>
                  <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                    {publicNavigation.map((navigation, index) => (
                      <NavLink
                        key={index}
                        to={navigation.to}
                        className={({ isActive }) =>
                          isActive
                            ? 'inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900'
                            : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }
                      >
                        {navigation.name}
                      </NavLink>
                    ))}
                  </div>

                  <div className='lg:flex gap-4 items-center hidden'>
                    <Link to='/memberships'>
                      <Button size={'sm'}>Sign up</Button>
                    </Link>
                    <Link to='/login'>
                      <Button size={'sm'} variant='outline'>
                        Log in
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className='sm:hidden'>
            <div className='space-y-1 pb-4 pt-2'>
              {publicNavigation.map((navigation, index) => (
                <NavLink
                  key={index}
                  to={navigation.to}
                  className={({ isActive }) =>
                    isActive
                      ? 'block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700'
                      : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  }
                >
                  <DisclosureButton key={index} as='div'>
                    {navigation.name}
                  </DisclosureButton>
                </NavLink>
              ))}

              <div className='p-4 flex flex-col gap-4'>
                <Link to='/memberships'>
                  <Button className={'w-full'}>Sign up</Button>
                </Link>
                <Link to='/login'>
                  <Button className={'w-full'} variant='outline'>
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
