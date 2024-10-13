import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from '../../store/authSlice';

// component
import Header from '../../components/ui-comp/navigation/header';
import Footer from '../../components/ui-comp/navigation/footer';

import { tableActions } from '../../store/slices/table-slice';
import { publicSocials } from '../../constants/navigation';

export default function UserLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(tableActions.reset());

    // eslint-disable-next-line
  }, [navigate]);

  function logOutHandler() {
    dispatch(logout());
    navigate('/login');
  }

  const userNavigation = [
    { name: 'Edit profile', href: '/user/manage-profile' },
    { name: 'Sign out', href: '', onClick: logOutHandler },
  ];

  return (
    <>
      <div>
        <div className='bg-gray-100'>
          <main>
            <Header showSidebar={false} navigation={userNavigation || []} />
            <div className='min-h-[calc(100vh-10rem)] py-4 px-4 sm:px-6 lg:px-8'>
              <Outlet />
            </div>
          </main>
        </div>
        <Footer showSidebar={true} companyName='Sports Club Inc.' copyrightYear='2024' socials={publicSocials || []} />
      </div>
    </>
  );
}

export function User() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('activities');

    // eslint-disable-next-line
  }, []);

  return null;
}
