import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaRegEdit, FaSave } from 'react-icons/fa'; // Import icons
import axios from 'axios';
import { publicApi } from '../api';
import { fetchUserPlan } from '../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const defaultImage = 'https://via.placeholder.com/150'; // Default image placeholder
  const [profilePic, setProfilePic] = useState(user.profilePic || defaultImage);
  const [toggle, setToggle] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    postalCode: user.postalCode || '',
    email: user.email || '',
    mobile: user.mobile || '',
    aboutMe: user.aboutMe || '',
  });

  const [location, setLocation] = useState('');
  const [showPasswordAccordion, setShowPasswordAccordion] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (formData.postalCode) {
      fetchLocation(formData.postalCode);
    }
  }, [formData.postalCode]);

  const fetchLocation = async postalCode => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&format=json`);
      const locationData = response.data[0];
      if (locationData) {
        setLocation(locationData.display_name);
      } else {
        setLocation('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation('Error fetching location');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    try {
      const updatedFormData = { ...formData, userId: user?.userId };

      const response = await publicApi.put(`http://localhost:5083/api/users/${user?.userId}`, updatedFormData);

      dispatch({ type: 'auth/updateUser/fulfilled', payload: response.data });
      dispatch(fetchUserPlan(user?.userId));
      setToggle(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='container mx-auto p-6 rounded-lg max-w-3xl bg-white shadow-md'>
      <div className='flex justify-end'>
        {toggle ? (
          <button
            type='button'
            onClick={updateProfile}
            className='bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition'
          >
            <FaSave className='inline mr-1' /> Save
          </button>
        ) : (
          <button type='button' onClick={() => setToggle(true)} className='p-2 rounded-full transition'>
            <FaRegEdit size={24} />
          </button>
        )}
      </div>

      <div className='flex items-center space-x-6 mt-4'>
        <div className='relative'>
          <img
            src={profilePic || defaultImage}
            alt='Profile'
            className='w-32 h-32 border-2 border-dashed border-gray-300 shadow-md object-cover rounded-full'
          />
          <label className='absolute bottom-0 right-0 bg-gray-300 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition'>
            <FaCamera className='text-xl' />
            <input type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
          </label>
        </div>
        <div className='flex-1'>
          {toggle ? (
            <>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className='text-3xl font-semibold text-gray-800 px-2 py-1 border rounded-md w-full'
                placeholder='First Name'
              />
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className='text-3xl font-semibold text-gray-800 px-2 py-1 border rounded-md mt-2 w-full'
                placeholder='Last Name'
              />
              <input
                type='text'
                name='aboutMe'
                value={formData.aboutMe}
                onChange={handleChange}
                className='mt-2 border px-2 py-1 rounded-md w-full'
                placeholder='About Me'
              />
            </>
          ) : (
            <>
              <h1 className='text-3xl font-semibold text-gray-800'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-gray-600 mt-1'>{user.aboutMe}</p>
            </>
          )}
          <p className='text-gray-600 mt-1'>
            Email:{' '}
            {toggle ? (
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
                placeholder='Email'
              />
            ) : (
              <span className='font-medium'>{user.email}</span>
            )}
          </p>
          <p className='text-gray-600 mt-1'>
            Mobile:{' '}
            {toggle ? (
              <input
                type='text'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
                placeholder='Mobile'
              />
            ) : (
              <span className='font-medium'>{user.mobile || 'N/A'}</span>
            )}
          </p>
          <p className='text-gray-600 mt-1'>
            Postal Code:{' '}
            {toggle ? (
              <input
                type='text'
                name='postalCode'
                value={formData.postalCode}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
                placeholder='Postal Code'
              />
            ) : (
              <span className='font-medium'>{user.postalCode}</span>
            )}
          </p>
          <p className='text-gray-600 mt-1'>
            Location: <span className='font-medium'>{location}</span>
          </p>
        </div>
      </div>

      {/* Membership Plan Section */}
      <div className='mt-12'>
        <h2 className='text-2xl font-semibold text-gray-800'>Membership Plan</h2>
        <div className='mt-4 bg-gray-100 p-6 rounded-lg shadow'>
          <p className='text-lg text-gray-700'>
            You are currently on the
            <span className='font-bold'> {user?.plan?.planName || 'Free'}</span> plan.
          </p>
          <p className='mt-2 text-sm text-gray-600'>{user?.plan?.description}</p>
          <button className='mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition'>Upgrade Plan</button>
        </div>
      </div>

      {/* Password Change Accordion */}
      <div className='mt-12'>
        <h2
          className='text-2xl font-semibold text-gray-800 cursor-pointer'
          onClick={() => setShowPasswordAccordion(!showPasswordAccordion)}
        >
          {showPasswordAccordion ? '-' : '+'} Change Password
        </h2>
        {showPasswordAccordion && (
          <div className='mt-4 space-y-4'>
            <div>
              <label className='block text-gray-700'>Current Password</label>
              <input
                type='password'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              />
            </div>
            <div>
              <label className='block text-gray-700'>New Password</label>
              <input
                type='password'
                name='newPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              />
            </div>
            <div>
              <label className='block text-gray-700'>New Password</label>
              <input
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              />
            </div>
            <div>
              <label className='block text-gray-700'>Confirm New Password</label>
              <input
                type='password'
                name='confirmNewPassword'
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              />
            </div>
            <button type='submit' className='bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition'>
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
