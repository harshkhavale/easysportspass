import React from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginUser, setResetPasswordMessage } from '../store/authSlice';
import { useFormik } from 'formik';
import { ArrowUpFromDot, MoveLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

// component
import Spinner from '../components/ui-comp/loader/spinner';
import { Button } from '../components/ui-comp/button/button';
import { Label } from '../components/ui-comp/label';
import { Input } from '../components/ui-comp/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui-comp/dialog';
import { postRequest, publicApi } from '../api';
import { phoneRegExp } from '../lib/utils';
import { ENDPOINTS } from '../constants/endpoints';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [type, setType] = React.useState('');
  const [emailOrMobile, setEmailOrMobile] = React.useState('');

  const forgetPassDialogRef = React.useRef(null);
  const dialogCloseButtonRef = React.useRef(null);

  const {
    isPending: forgotPassLinkIsPending,
    isError: forgotPassLinkIsError,
    error: forgotPassLinkError,
    mutate: forgotPassLinkMutate,
    reset: forgotPassLinkReset,
  } = useMutation({
    mutationKey: ['forget-pass-link-key'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data.message || 'We have sended a link to reset your password on your registered mobile or email');
      dialogCloseButtonRef.current?.click();
      forgotPassLinkReset();
      dispatch(
        setResetPasswordMessage({
          type,
          emailOrMobile,
        })
      );
      navigate('/reset-password/reset-pass-message');
    },
  });

  React.useEffect(() => {
    if (forgotPassLinkIsError) {
      toast.error(forgotPassLinkError.message || 'Something went wrong while sending a forgot password link');
      forgotPassLinkReset;
    }
  }, [forgotPassLinkIsError, forgotPassLinkError, forgotPassLinkReset]);

  const forgotLinkInitialValues = {
    emailOrMobile: '',
  };

  const forgotLinkValidationSchema = Yup.object().shape({
    emailOrMobile: Yup.string()
      .test('email-or-mobile', 'Must be a valid email or mobile number', function (value) {
        if (!value) return false;
        const isEmail = value.includes('@');
        const isPhoneNumber = phoneRegExp.test(value);
        return isEmail || isPhoneNumber;
      })
      .required('Email or mobile number is required'),
  });
  const forgotLinkFormik = useFormik({
    initialValues: forgotLinkInitialValues,
    validationSchema: forgotLinkValidationSchema,
    onSubmit(values) {
      const isEmail = values.emailOrMobile.includes('@');
      setEmailOrMobile(values.emailOrMobile);
      if (isEmail) {
        setType('email');
        forgotPassLinkMutate({
          customAxios: publicApi,
          data: { email: values.emailOrMobile },
          url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.MESSAGE.FORGOT_PASSWORD_EMAIL_LINK}`,
        });
      } else {
        setType('sms');
        forgotPassLinkMutate({
          customAxios: publicApi,
          data: { mobile: values.emailOrMobile },
          url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.MESSAGE.FORGOT_PASSWORD_MOBILE_LINK}`,
        });
      }
    },
  });

  const initialValues = {
    contact: '',
    password: '',
  };

  const validationSchema = Yup.object({
    contact: Yup.string()
      .test('email-or-mobile', 'Must be a valid email or mobile number', function (value) {
        if (!value) return false;
        const isEmail = value.includes('@');
        const isPhoneNumber = phoneRegExp.test(value);
        return isEmail || isPhoneNumber;
      })
      .required('Email or mobile number is required'),
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
      navigate('/user');
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={forgetPassDialogRef} className={'hidden'}>
            Forgot password dialog
          </Button>
        </DialogTrigger>
        <DialogContent className={'h-screen md:h-[unset]'}>
          <DialogHeader>
            <DialogTitle>Forgot Password?</DialogTitle>
            <DialogDescription>{`No worries, we'll send you reset instructions.`}</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-1 flex-col'>
              <Input
                label={'Registered Email or Mobile No'}
                id='emailOrMobile'
                name='emailOrMobile'
                inputType='input'
                type='text'
                inputClassName='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder={'Enter your registered Email ID or Mobile No'}
                onChange={forgotLinkFormik.handleChange}
                onBlur={forgotLinkFormik.handleBlur}
                value={forgotLinkFormik.values.emailOrMobile}
                isError={forgotLinkFormik.errors.emailOrMobile && forgotLinkFormik.touched.emailOrMobile}
                errorMessage={forgotLinkFormik.errors.emailOrMobile}
                disabled={forgotPassLinkIsPending}
                required
              />
            </div>
          </div>{' '}
          <DialogFooter>
            <DialogClose ref={dialogCloseButtonRef}>
              <Button type='button' variant={'outline'} className={'flex gap-2 items-center'} onClick={formik.submitForm}>
                <MoveLeft className='w-4 h-4' />
                <span>Back to login</span>
              </Button>
            </DialogClose>
            <Button
              type='submit'
              onClick={forgotLinkFormik.submitForm}
              className={'flex gap-2 items-center'}
              disabled={!forgotLinkFormik.isValid}
            >
              {forgotPassLinkIsPending ? <Spinner /> : ''}
              <span>Reset Password</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className='flex min-h-full flex-1 h-screen'>
        <Button
          type={'button'}
          onClick={() => navigate('/')}
          className={'fixed top-0 left-0 m-4 p-2 rounded-full hover:shadow-lg'}
          size={'logo'}
        >
          <ArrowUpFromDot className='-rotate-90' />
        </Button>
        <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900'>Login to your account</h2>
              <p className='mt-2 text-sm leading-6 text-gray-500'>
                Not a member?{' '}
                <Link to='/memberships' className='font-semibold text-primary hover:text-primary/85 hover:underline'>
                  Start a new membership
                </Link>
              </p>
            </div>

            <div className='mt-10'>
              <div>
                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                  <div>
                    <Label htmlFor='contact' className='block text-sm font-medium leading-6'>
                      Email or Contact Number
                    </Label>
                    <div className='mt-2'>
                      <Input
                        inputType='input'
                        id={'contact'}
                        name={'contact'}
                        placeholder='Enter your email or contact number'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        inputClassName='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        isError={formik.errors.contact && formik.touched.contact}
                        errorMessage={formik.errors.contact}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='password' className='block text-sm font-medium leading-6'>
                      Password
                    </Label>
                    <div className='mt-2'>
                      <Input
                        inputType='input'
                        id='password'
                        name='password'
                        type='password'
                        placeholder='Enter your password'
                        autoComplete='current-password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isError={formik.errors.password && formik.touched.password}
                        errorMessage={formik.errors.password}
                        inputClassName='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        required
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    {/* <div className='flex items-center'>
                      <input
                        id='remember-me'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      />
                      <label htmlFor='remember-me' className='ml-3 block text-sm leading-6 text-gray-700'>
                        Remember me
                      </label>
                    </div> */}

                    <div className='text-sm leading-6'>
                      <Button
                        type='button'
                        variant={'link'}
                        onClick={() => forgetPassDialogRef.current?.click()}
                        className='p-0 font-semibold text-primary hover:text-primary/85 hover:underline'
                      >
                        Forgot password?
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Button type='submit' className={'w-full flex items-center gap-2'} disabled={formik.isSubmitting || !formik.isValid}>
                      {formik.isSubmitting ? <Spinner /> : ''}
                      <span>Login</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='relative hidden w-0 flex-1 lg:flex lg:justify-center lg:items-center bg-primary '>
          <p className='text-white text-9xl font-bold leading-tight text-center capitalize'>Welcome back champions!</p>
        </div>
      </div>
    </>
  );
};

export default Login;
