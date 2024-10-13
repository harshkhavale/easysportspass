import Router from './routes/routes';

import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnauthorizedToken, fetchUserPlan } from './store/authSlice';
import { useEffect } from 'react';
import { setAuthToken } from './api';

export default function App() {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const userType = useSelector(state => state.auth.user?.userType);

  const dispatch = useDispatch();

  useEffect(() => {
    setAuthToken(token);
  }, [token, user]);

  useEffect(() => {
    if (!token || !user) {
      dispatch(fetchUnauthorizedToken());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user && token) {
      dispatch(fetchUserPlan(user?.userId));
    }
    // eslint-disable-next-line
  }, [user?.userId]);

  return (
    <div className='text-sm'>
      <Router user={user} userType={userType} />
      <Toaster position='top-center' />
    </div>
  );
}
