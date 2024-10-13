import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { supplierNavigation, publicSocials } from '../../constants/navigation';
import { logout } from '../../store/authSlice';

// component
import Sidebar from '../../components/ui-comp/navigation/sidebar';
import Header from '../../components/ui-comp/navigation/header';
import Footer from '../../components/ui-comp/navigation/footer';

import { tableActions } from '../../store/slices/table-slice';

export default function SupplierLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(tableActions.reset());

    // eslint-disable-next-line
  }, [navigate]);

  function onSidebarClose() {
    setSidebarOpen(false);
  }

  function onSidebarOpen() {
    setSidebarOpen(true);
  }

  function logOutHandler() {
    dispatch(logout());
    navigate('/login');
  }

  const supplierUserNavigation = [
    { name: 'Edit profile', href: '/supplier/manage-profile' },
    { name: 'Sign out', href: '', onClick: logOutHandler },
  ];

  return (
    <>
      <div>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={onSidebarClose}
          navigation={supplierNavigation || []}
          title={<p className='pb-6 w-full text-2xl font-bold text-white'>EasySportsPass</p>}
          onLogout={logOutHandler}
        />
        <div className='lg:pl-72 bg-gray-100'>
          <main>
            <Header onSidebarOpen={onSidebarOpen} navigation={supplierUserNavigation || []} />
            <div className='min-h-[calc(100vh-10rem)] py-4 px-4 sm:px-6 lg:px-8'>
              <Outlet />
            </div>
          </main>
        </div>
        <Footer companyName='Sports Club Inc.' copyrightYear='2024' socials={publicSocials || []} />
      </div>
    </>
  );
}

export function Supplier() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('activities');

    // eslint-disable-next-line
  }, []);

  return null;
}
