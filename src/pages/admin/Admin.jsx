/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { CiViewList } from 'react-icons/ci';
import { LiaCitySolid } from 'react-icons/lia';
import { CgAttribution } from 'react-icons/cg';
import { MdOutlineBusinessCenter } from 'react-icons/md';
import { PiMapPin } from 'react-icons/pi';
import { TiChartAreaOutline } from 'react-icons/ti';
import { IoMdMenu } from 'react-icons/io';
import Membership from '../../components/admin/Membership';
import Users from '../../components/admin/Users';
import City from '../../components/admin/City';
import MembershipPlanAttribute from '../../components/admin/MembershipPlanAttribute';
import CorporateUser from '../../components/admin/CorporateUser';
import Country from '../../components/admin/Country';
import State from '../../components/admin/State';
import { IoMdClose } from 'react-icons/io';

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const activeSection = useSelector(state => state.general.activeSection);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin-login');
      return;
    }
  }, [user, navigate]);

  const handleNavigation = section => {
    dispatch({ type: 'general/setActiveSection', payload: section });
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100 text-sm'>
      <div className={`w-full lg:w-64 bg-gray-200 text-black ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className='p-6 text-2xl font-bold border-b border-gray-100'>EasySportsPass</div>
        <div className='flex-1 p-4'>
          <SidebarItem
            icon={<FiHome />}
            label='Home'
            isActive={activeSection === 'Home'}
            onClick={() => handleNavigation('Home')}
          />
          <SidebarItem
            icon={<CiViewList />}
            label='Membership Plans'
            isActive={activeSection === 'Membership'}
            onClick={() => handleNavigation('Membership')}
          />
          <SidebarItem
            icon={<FiUser />}
            label='Manage Users'
            isActive={activeSection === 'Users'}
            onClick={() => handleNavigation('Users')}
          />
          <SidebarItem
            icon={<PiMapPin />}
            label='Country'
            isActive={activeSection === 'Country'}
            onClick={() => handleNavigation('Country')}
          />
          <SidebarItem
            icon={<TiChartAreaOutline />}
            label='State'
            isActive={activeSection === 'State'}
            onClick={() => handleNavigation('State')}
          />
          <SidebarItem
            icon={<LiaCitySolid />}
            label='City'
            isActive={activeSection === 'City'}
            onClick={() => handleNavigation('City')}
          />
          <SidebarItem
            icon={<CgAttribution />}
            label='Plan Attributes'
            isActive={activeSection === 'Attributes'}
            onClick={() => handleNavigation('Attributes')}
          />
          <SidebarItem
            icon={<MdOutlineBusinessCenter />}
            label='Corporate Users'
            isActive={activeSection === 'Corporate'}
            onClick={() => handleNavigation('Corporate')}
          />
          <SidebarItem
            icon={<FiSettings />}
            label='Settings'
            isActive={activeSection === 'Settings'}
            onClick={() => handleNavigation('Settings')}
          />
        </div>
        <div className='p-4 border-t border-white'>
          <div className='flex items-center p-3 rounded-md cursor-pointer hover:bg-white' onClick={handleLogout}>
            <FiLogOut className='mr-3' />
            <span>Log out</span>
          </div>
        </div>
      </div>

      <button
        className='lg:hidden p-4 bg-gray-200 text-black fixed top-0 right-0'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <IoMdClose /> : <IoMdMenu />}
      </button>

      <div className='flex-1 p-8'>
        {activeSection === 'Home' && (
          <div className='text-3xl font-bold text-gray-800'>Welcome to the Admin Dashboard</div>
        )}
        {activeSection === 'Membership' && <Membership />}
        {activeSection === 'Users' && <Users />}
        {activeSection === 'City' && <City />}
        {activeSection === 'Attributes' && <MembershipPlanAttribute />}
        {activeSection === 'Corporate' && <CorporateUser />}
        {activeSection === 'Country' && <Country />}
        {activeSection === 'State' && <State />}
        {activeSection === 'Settings' && <div className='text-2xl font-bold text-gray-800'>Settings Section</div>}
      </div>
    </div>
  );
};

export const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('home');
  });

  return null;
};

const SidebarItem = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 rounded-md cursor-pointer mb-4 ${isActive ? 'bg-white' : ''}`}
      onClick={onClick}
    >
      {icon}
      <span className='ml-3'>{label}</span>
    </div>
  );
};

export default Admin;
