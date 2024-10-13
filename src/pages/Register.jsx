import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { registerUser, sendOtp } from '../store/authSlice';
import { FaArrowLeftLong } from 'react-icons/fa6';

const validationSchema = yup.object({
  contact: yup
    .string()
    .required('Email or Contact Number is required')
    .test('is-email-or-phone', 'Invalid email or phone number', value =>
      value.includes('@')
        ? yup.string().email().isValidSync(value)
        : yup
            .string()
            .matches(/^[0-9]{10}$/, 'Must be a valid phone number')
            .isValidSync(value)
    ),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  postalCode: yup
    .string()
    .required('Postal Code is required')
    .matches(/^\d{6}$/, 'Postal Code must be exactly 6 digits'),
  terms: yup.boolean().required('You must accept the terms and conditions').oneOf([true], 'You must accept the terms and conditions'),
});

const Register = () => {
  const user = useSelector(state => state.auth.user);
  const temp = useSelector(state => state.auth.temp);
  const navigate = useNavigate();
  const selectedPlan = useSelector(state => state.general.selectedPlan);

  const dispatch = useDispatch();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlan == null) {
      navigate('/memberships');
    }
  }, [navigate, selectedPlan]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      contact: '',
      password: '',
      postalCode: '',
      terms: false,
    },
    validationSchema,
    onSubmit: async values => {
      if (!selectedPlan) {
        toast.error('Please select a membership plan.');
        navigate('/memberships');
        return;
      }

      setLoading(true);

      const isEmail = values.contact.includes('@');
      const payload = {
        ...values,
        planId: selectedPlan.planId,
        email: isEmail ? values.contact : undefined,
        mobile: isEmail ? undefined : values.contact,
        userCategoryId: selectedPlan.userCategoryId,
      };

      try {
        const result = await dispatch(registerUser(payload)).unwrap();
        if (result) {
          toast.success('Registration successful!');
          dispatch(sendOtp({ email: result.user.email, mobile: result.user.mobile }));
          navigate('/verifyuser');
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className='relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50'>
      <Link to={'/'} className=' absolute top-2 left-2 border border-blue-500 text-blue-500 bg-white rounded-full p-2 z-50'>
        <FaArrowLeftLong />
      </Link>
      <div className='flex items-center justify-center md:bg-blue-600'>
        {selectedPlan && (
          <div
            className={`sm:border sm:border-blue-500 relative p-6 bg-white rounded-lg md:shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:border-blue-500 border-2 ${
              hoveredPlan === selectedPlan.planId ? 'border-blue-500' : 'border-white'
            }`}
            onMouseEnter={() => setHoveredPlan(selectedPlan.planId)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            {hoveredPlan === selectedPlan.planId && (
              <div className='absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg'>Our most popular plan</div>
            )}
            <h3 className='text-4xl font-semibold flex items-center'>{selectedPlan.planName}</h3>
            <p className='text-4xl text-blue-600 font-bold my-4'>
              {selectedPlan.price}
              <span className='text-xl'>/mo</span>
            </p>

            <p className='text-lg font-semibold'>{selectedPlan.description}</p>

            <div className='mt-4'>
              <p className='text-md font-semibold mt-2'>Plan Attributes:</p>
              {selectedPlan.membershipPlanAttributes.length > 0 ? (
                <ul className='text-sm text-gray-400'>
                  {selectedPlan.membershipPlanAttributes.map((attribute, index) => (
                    <li key={index}>
                      <strong>{attribute.attributeName}:</strong> {attribute.attributeDetails}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-gray-400'>No additional attributes available.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center md:shadow-md justify-center p-4'>
        <form
          onSubmit={formik.handleSubmit}
          className='bg-white p-6 lg:p-5 md:border md:border-blue-200 rounded-2xl md:shadow-lg w-full max-w-2xl'
        >
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-800'>Register {temp ? 'with corporate Email' : ''}</h2>

          <div className='mb-6'>
            <label htmlFor='contact' className='block text-sm font-medium text-gray-600 mb-1'>
              {user ? 'Corporate Email' : 'Email or Contact Number'}
              <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='contact'
              id='contact'
              placeholder='Enter email or contact no.'
              value={temp ? temp : formik.values.contact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!!temp || loading}
              required
              className={`w-full p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formik.touched.contact && formik.errors.contact ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.contact && formik.errors.contact && <p className='text-red-500 text-sm mt-1'>{formik.errors.contact}</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-600 mb-1'>
                First Name
              </label>
              <input
                type='text'
                name='firstName'
                id='firstName'
                placeholder='Enter your first name'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className='w-full p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-600 mb-1'>
                Last Name
              </label>
              <input
                type='text'
                name='lastName'
                id='lastName'
                placeholder='Enter your last name'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className='w-full p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <label htmlFor='postalCode' className='block text-sm font-medium text-gray-600 mb-1'>
                Postal Code <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='postalCode'
                id='postalCode'
                placeholder='Enter your postal code'
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                required
                className={`w-full p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.postalCode && formik.errors.postalCode && (
                <p className='text-red-500 text-sm mt-1'>{formik.errors.postalCode}</p>
              )}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-600 mb-1'>
                Password <span className='text-red-500'>*</span>
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Enter your password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                required
                className={`w-full p-4 border outline-none rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.password && formik.errors.password && <p className='text-red-500 text-sm mt-1'>{formik.errors.password}</p>}
            </div>
          </div>

          <div className='flex items-center mb-6'>
            <div className='consent flex gap-2 flex-col'>
              <div className='flex gap-2 items-start'>
                <input
                  className='p-2'
                  type='checkbox'
                  name='terms'
                  id='terms'
                  checked={formik.values.terms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                <p className='text-xs'>
                  I want to be updated via email about new products, offers and services by Urban Sports GmbH and its partners and receive
                  occasional surveys. (Unsubscribe at any time by using the unsubscription link you find at the end of each email. To learn
                  how we process your data, visit our Privacy Policy).
                </p>
              </div>
              <div className='flex gap-2 items-start'>
                <input className='p-2' type='checkbox' disabled={loading} />
                <p className='text-xs'>
                  I have read and agree to the Terms and Conditions. Information about data processing can be found in the Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {formik.touched.terms && formik.errors.terms && <p className='text-red-500 text-sm mt-1'>{formik.errors.terms}</p>}

          <button
            type='submit'
            className='w-full bg-blue-600 text-white p-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-200'
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <Link to={'/login'} className='block text-center mt-4 text-blue-500'>
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
