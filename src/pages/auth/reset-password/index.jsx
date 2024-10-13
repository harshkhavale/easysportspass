import * as yup from 'yup';
import React from 'react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { postRequest, publicApi } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { Input } from '../../../components/ui-comp/input';
import { Button } from '../../../components/ui-comp/button/button';
import Spinner from '../../../components/ui-comp/loader/spinner';
import { ArrowUpFromDot, Key } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();

  // eslint-disable-next-line
  const [searchParam, _setSearchParam] = useSearchParams();
  const token = searchParam.get('token');
  const email = searchParam.get('email');

  const {
    isPending: forgotPasswordIsPending,
    isError: forgotPasswordIsError,
    error: forgotPasswordError,
    mutate: forgotPasswordMutate,
    reset: forgotPasswordReset,
  } = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: postRequest,
    onSuccess: () => {
      forgotPasswordReset();
      navigate('success');
    },
  });

  React.useEffect(() => {
    if (forgotPasswordIsError) {
      toast.error(forgotPasswordError.message || 'Something went wrong while resetting password');
      forgotPasswordReset();
    }
  });

  const schema = yup.object().shape({
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit(values) {
      const payload = {
        EmailOrMobile: email,
        Token: token,
        NewPassword: values.password,
      };
      forgotPasswordMutate({
        customAxios: publicApi,
        data: payload,
        url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.FORGOT_PASSWORD}`,
      });
    },
  });

  React.useEffect(() => {
    if (!token & (typeof token !== 'string')) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, [searchParam]);

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-2 items-center'>
        <div className='p-4 bg-primary/90 rounded-full'>
          <Key className='text-white' />
        </div>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Set New Password</h2>
        <p className='text-sm text-muted-foreground text-center'>Your password must be different to previously used passwords.</p>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          <div className='mt-2'>
            <Input
              inputType={'input'}
              label='Password'
              id='password'
              name='password'
              type='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              inputClassName='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              isError={formik.errors.password && formik.touched.password}
              errorMessage={formik.errors.password}
            />
          </div>

          <div className='mt-2'>
            <Input
              inputType={'input'}
              label='Confirm Password'
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              required
              inputClassName='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={formik.errors.confirmPassword && formik.touched.confirmPassword}
              errorMessage={formik.errors.confirmPassword}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <Button type='submit' className={'flex gap-2 items-center w-full'} disabled={!formik.isValid || forgotPasswordIsPending}>
              {forgotPasswordIsPending && <Spinner />}
              <span>Reset Password</span>
            </Button>
            <Button type='button' className={'flex gap-2 items-center w-full'} variant={'link'} onClick={() => navigate('/login')}>
              <ArrowUpFromDot className='-rotate-90 w-4 h-4' />
              <span>Back to log in</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
