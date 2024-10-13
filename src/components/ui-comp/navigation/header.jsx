import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BellIcon, ChevronDownIcon, Menu, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { classNames, getInitials } from '../../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui-comp/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../dropdown-menu';
import { Button } from '../button/button';
import { useQuery } from '@tanstack/react-query';
import { createPrivateApi, getRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

// eslint-disable-next-line
export default function Header({ onSidebarOpen, navigation, showSidebar = true }) {
  const firstName = useSelector(state => state.auth.user.firstName);
  const lastName = useSelector(state => state.auth.user.lastName);
  // const userProfilePic = useSelector(state => state.auth.user.profilePic);
  const userId = useSelector(state => state.auth.user.userId);
  const token = useSelector(state => state.auth?.token);

  const [imageUrl, setImageUrl] = useState('');

  const fullName = `${firstName} ${lastName}`;
  const privateAxios = createPrivateApi(token);

  const { data: getImageData } = useQuery({
    queryKey: ['get-user-profile-pic', [imageUrl, 'userData']],
    queryFn: () => getRequest({ url: imageUrl, customAxios: privateAxios }),
    gcTime: 0,
    staleTime: Infinity,
  });

  const {
    data: getUserData,
    isLoading: getUserIsLoading,
    isRefetching: getUserIsRefetching,
    isError: getUserIsError,
    error: getUserError,
  } = useQuery({
    queryKey: ['get-user-by-id'],
    queryFn: () =>
      getRequest({
        customAxios: privateAxios,
        url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}/${userId}`,
      }),
  });

  useEffect(() => {
    if (!getUserIsLoading || !getUserIsRefetching) {
      if (getUserData?.profilePic) {
        setImageUrl(`${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${getUserData?.profilePic}`);
      }
    }
  }, [getUserData, getUserIsLoading, getUserIsRefetching]);

  useEffect(() => {
    if (getUserIsError) {
      toast.error(getUserError.message || 'Something went wrong');
    }
  }, [getUserIsError, getUserError]);

  return (
    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
      {showSidebar && (
        <button
          type='button'
          className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
          onClick={() => {
            onSidebarOpen();
          }}
        >
          <span className='sr-only'>Open sidebar</span>
          <Menu className='h-6 w-6' aria-hidden='true' />
        </button>
      )}
      {/* Separator */}
      <div className='h-6 w-px bg-gray-900/10 lg:hidden' aria-hidden='true' />

      <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
        <form className='relative flex flex-1' action='#' method='GET'>
          <label htmlFor='search-field' className='sr-only'>
            Search
          </label>
          <SearchIcon className='pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400' aria-hidden='true' />
          <input
            id='search-field'
            className='block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm'
            placeholder='Search...'
            type='search'
            name='search'
          />
        </form>
        <div className='flex items-center gap-x-4 lg:gap-x-6'>
          <button type='button' className='-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'>
            <span className='sr-only'>View notifications</span>
            <BellIcon className='h-6 w-6' aria-hidden='true' />
          </button>

          {/* Separator */}
          <div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10' aria-hidden='true' />

          {/* Profile dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='-m-1.5 flex items-center p-1.5'>
                <span className='sr-only'>Open user menu</span>
                <Avatar>
                  <AvatarImage src={getImageData} alt={fullName} />
                  <AvatarFallback>{getInitials(`${getUserData?.firstName} ${getUserData?.lastName}`)}</AvatarFallback>
                </Avatar>
                <span className='hidden lg:flex lg:items-center'>
                  <span className='pl-4 text-sm font-semibold leading-6 text-gray-900' aria-hidden='true'>
                    {`${getUserData?.firstName}`}
                  </span>
                  <ChevronDownIcon className='pl-2 h-5 w-5 text-gray-400' aria-hidden='true' />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              {Array.isArray(navigation)
                ? navigation.map((item, key) => (
                    <DropdownMenuItem key={key} onClick={item.onClick ? () => item.onClick() : () => {}}>
                      <Link to={item.href} className={classNames('block text-sm leading-6 text-gray-900')}>
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))
                : ''}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Define PropTypes
Header.propTypes = {
  onSidebarOpen: PropTypes.func.isRequired,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  onLogout: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
};
