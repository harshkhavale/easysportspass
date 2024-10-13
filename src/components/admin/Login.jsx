import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../store/authSlice';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useEffect } from 'react';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    if (user && user.userType === 'Administrator') {
      navigate('/admin');
    }
  }, [user, dispatch, navigate]);
  const initialValues = {
    contact: '',
    password: '',
  };

  const validationSchema = Yup.object({
    contact: Yup.string()
      .required('Email or contact number is required')
      .test('is-valid', 'Must be a valid email or contact number', value => {
        const isEmail = value && value.includes('@');
        const isPhoneNumber = value && /^[0-9]+$/.test(value);
        return isEmail || isPhoneNumber;
      }),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { contact, password } = values;

    const isEmail = contact.includes('@');

    const payload = {
      password,
      email: isEmail ? contact : undefined,
      mobile: isEmail ? undefined : contact,
    };

    try {
      await dispatch(loginUser(payload)).unwrap();
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='relative flex min-h-screen bg-blue-600'>
      <Link to={'/'} className=' absolute top-2 left-2 border border-blue-500 text-blue-500 bg-white rounded-full p-2'>
        <FaArrowLeftLong />
      </Link>
      <div className='w-full md:w-1/2 flex items-center justify-center p-4 md:p-10'>
        <div className='w-full max-w-md'>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className='bg-white p-8 border border-blue-200 rounded-2xl shadow-lg w-full'>
                <h2 className='text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-800'>Admin Login</h2>
                <div className='mb-4 md:mb-5'>
                  <label htmlFor='contact' className='block text-sm md:text-base font-medium text-gray-600 mb-1'>
                    Email or Contact Number
                  </label>
                  <Field
                    type='text'
                    name='contact'
                    id='contact'
                    placeholder='Enter your email or contact number'
                    className='w-full p-3 md:p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                  <ErrorMessage name='contact' component='div' className='text-red-600 text-sm mt-1' />
                </div>
                <div className='mb-6 md:mb-8'>
                  <label htmlFor='password' className='block text-sm md:text-base font-medium text-gray-600 mb-1'>
                    Password
                  </label>
                  <Field
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Enter your password'
                    className='w-full p-3 md:p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                  <ErrorMessage name='password' component='div' className='text-red-600 text-sm mt-1' />
                </div>
                <button
                  type='submit'
                  className='w-full p-3 md:p-4 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-700 transition duration-300'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
