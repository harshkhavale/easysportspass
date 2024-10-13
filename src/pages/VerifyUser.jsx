import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, Toaster } from 'react-hot-toast';
import { sendOtp, setVerified, verifyOtp } from '../store/authSlice';
import { FaArrowLeftLong } from 'react-icons/fa6';

const VerifyUser = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.auth.user);
  const otpStatus = useSelector(state => state.auth.otpStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (!user.email && !user.mobile)) {
      navigate('/login');
    }
    if (user && (user.emailVerified || user.mobileVerified)) {
      navigate('/user');
    }
  }, [user, navigate]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        verifyOtp({
          email: user?.email,
          mobile: user?.mobile,
          verificationCode: enteredOtp,
        })
      ).unwrap();

      toast.success('OTP verified successfully!');
      dispatch(setVerified());
      navigate('/user');
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);

    try {
      dispatch(sendOtp({ email: user?.email, mobile: user?.mobile }));

      if (otpStatus == 'succeeded') {
        toast.success('OTP has been resent.');
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex relative justify-center items-center min-h-screen bg-gray-100'>
      <Link to={'/register'} className=' absolute top-2 left-2 border border-blue-500 text-blue-500 bg-white rounded-full p-2'>
        <FaArrowLeftLong />
      </Link>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='bg-white p-8 rounded-lg w-96'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Verify OTP</h2>
        {user ? (
          <>
            <p className='text-center mb-4 text-gray-600'>
              {user.email
                ? `Enter the 6-digit code sent to your email (${user.email}).`
                : `Enter the 6-digit code sent to your mobile (${user.mobile}).`}
            </p>

            <div className='flex justify-center space-x-2 mb-4'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type='text'
                  maxLength='1'
                  value={digit}
                  onChange={e => handleChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  autoComplete='off'
                  className='w-12 h-12 text-2xl text-center border rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className='w-full bg-blue-600 text-white p-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-200'
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Verify'}
            </button>

            <button
              onClick={handleResend}
              className='w-full px-4 py-2 mt-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition'
              disabled={loading || otpStatus === 'loading'}
            >
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Resend OTP'}
            </button>
          </>
        ) : (
          <p className='text-center text-red-500'>User data is not available. Please log in again.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
