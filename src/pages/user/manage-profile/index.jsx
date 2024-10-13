import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createPrivateApi, getRequest, publicApi, putMultipartRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { ManageProfileForm } from '../../../components/ui-comp/forms';
import { Button } from '../../../components/ui-comp/button/button';
import { base64UrlToBlob, blobToFile, phoneRegExp } from '../../../lib/utils';

// eslint-disable-next-line
export default function ManageUserProfile({ type }) {
  const [formik, setFormik] = useState({});
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth?.user.userId);
  const userDetails = useSelector(state => state.auth?.user);
  const token = useSelector(state => state.auth?.token);

  const [userData, setUserData] = useState(userDetails);
  const [imageUrl, setImageUrl] = useState(
    `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${userData?.profilePic}`
  );

  const privateAxios = createPrivateApi(token);

  const genderOption = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ];

  const {
    data: getImageData,
    isLoading: getImageDataIsLoading,
    isRefetching: getImageDataIsRefetching,
    refetch: getImageDataRefetch,
  } = useQuery({
    queryKey: ['get-user-profile-pic', [imageUrl, userData]],
    queryFn: () => getRequest({ url: imageUrl, customAxios: privateAxios }),
    gcTime: 0,
    staleTime: Infinity,
  });

  const {
    data: getUserData,
    isLoading: getUserIsLoading,
    isRefetching: getUserIsRefetching,
    isError: getUserIsError,
    error: getUserError,
    refetch: getUserRefetch,
  } = useQuery({
    queryKey: ['get-user-by-id'],
    queryFn: () =>
      getRequest({
        customAxios: privateAxios,
        url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}/${userDetails?.userId}`,
      }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!getUserIsLoading || !getUserIsRefetching) {
      setUserData(getUserData);
      setImageUrl(`${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${getUserData?.profilePic}`);
    }
  }, [getUserData, getUserIsLoading, getUserIsRefetching]);

  useEffect(() => {
    if (getUserIsError) {
      toast.error(getUserError.message || 'Something went wrong');
    }
  }, [getUserIsError, getUserError]);

  const {
    isPending: updateUserIsPending,
    isError: updateUserIsError,
    error: updateUserError,
    mutate: updateUserMutate,
    reset: updateUserReset,
  } = useMutation({
    mutationKey: ['Update-User-Profile'],
    mutationFn: putMultipartRequest,
    onSuccess: data => {
      toast.success(data.message || 'Your personal information update successfully.');
      updateUserReset();
      setImageUrl(`${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${data.profilePic}`);
      getImageDataRefetch();
      getUserRefetch();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (updateUserIsError) {
      toast.error(updateUserError.message || 'Something went wrong');
    }
  }, [updateUserIsError, updateUserError]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter First Name',
      id: 'firstName',
      yupValidation: yup.string().min(4, 'First Name must be at least 4 characters'),
      required: true,
      value: userData?.firstName,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter Last Name',
      id: 'lastName',
      yupValidation: yup.string().min(4, 'Last Name must be at least 4 characters'),
      required: true,
      value: userData?.lastName,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contact',
      label: 'Contact Number',
      placeholder: 'Enter a Contact Number',
      id: 'contact',
      yupValidation: yup
        .string()
        .matches(phoneRegExp, 'Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain exactly 10 digits')
        .test('mobile-or-email', 'Either Email or Mobile Number is required', function (value) {
          const { Email } = this.parent;
          return value || Email;
        }),
      value: userData?.mobile,
      className: 'sm:col-span-2',
    },
    {
      type: 'email',
      inputType: 'input',
      name: 'Email',
      label: 'Email ID',
      placeholder: 'Enter a Email ID',
      id: 'Email',
      yupValidation: yup
        .string()
        .email('Must be a valid email')
        .test('email-or-mobile', 'Either Email or Mobile Number is required', function (value) {
          const { contact } = this.parent;
          return value || contact;
        }),
      required: true,
      value: userData?.email,
      className: 'sm:col-span-2',
    },
    {
      type: 'date',
      inputType: 'input',
      name: 'dob',
      label: 'DOB',
      placeholder: 'Enter a DOB',
      id: 'dob',
      yupValidation: yup.string(),
      value: userData?.dob || '',
      className: 'sm:col-span-2',
    },
    {
      inputType: 'dropdown',
      name: 'Gender',
      label: 'Gender',
      placeholder: 'Enter your Gender',
      id: 'Gender',
      yupValidation: yup.string(),
      value: userData?.gender,
      options: genderOption || [],
      typeOfValue: 'string',
      isLoading: false,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'postalCode',
      label: 'Postal Code',
      placeholder: 'Enter a Postal Code',
      id: 'postalCode',
      yupValidation: yup.string(),
      value: userData?.postalCode,
    },

    {
      type: 'text',
      inputType: 'textarea',
      name: 'aboutMe',
      label: 'About Me',
      placeholder: 'Enter a About Me',
      id: 'aboutMe',
      yupValidation: yup.string(),
      value: userData?.aboutMe,
      fullWidth: true,
    },
    {
      inputType: 'checkbox',
      name: 'mobileNotification',
      label: 'Mobile Notification',
      placeholder: 'Enter a Mobile Notification',
      id: 'mobileNotification',
      yupValidation: yup.string(),
      value: userData?.mobileNotification === 1 ? true : false,
    },
    {
      inputType: 'checkbox',
      name: 'emailNotification',
      label: 'Email Notification',
      placeholder: 'Enter a Email Notification',
      id: 'emailNotification',
      yupValidation: yup.string(),
      value: userData?.mobileNotification === 1 ? true : false,
    },
  ];

  function registerSupplierHandler(values, formik) {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.Email,
      dob: values.dob,
      mobile: values.contact,
      gender: values.Gender,
      postalCode: values.postalCode,
      aboutMe: values.aboutMe,
      mobileNotification: values.mobileNotification,
      emailNotification: values.emailNotification,
    };

    const { blob, fileName } = base64UrlToBlob(values.imageUrl, `${values.firstName}_${values.lastName}`);
    const file = blobToFile(blob, fileName);

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('profilePic', file);
    updateUserMutate({ customAxios: publicApi, formData, url: `${ENDPOINTS.USERS.USERS}/${userId}` });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col gap-4'>
      <div>
        <Button size='logo' variant='ghost' type='button' className='p-0' onClick={() => navigate(-1)}>
          <ArrowLeftCircle className='text-slate-600 hover:text-slate-500 transition ease-in-out duration-300 w-8 h-8' />
        </Button>
      </div>
      <div className='flex flex-col space-y-5'>
        <ManageProfileForm
          type={type}
          formTitle='Update Personal Information'
          formDescription={`You can update your profile here by filling in your supplier details. Modify your name, contact information, website, and other relevant fields to ensure your information is accurate and up-to-date. Simply complete the form and click "Save" to apply changes to your profile.`}
          inputs={inputs}
          isPending={updateUserIsPending}
          onSubmit={registerSupplierHandler}
          submitButtonText={'Update'}
          imageUrl={getImageData}
          imageLoadingState={getImageDataIsLoading || getImageDataIsRefetching}
        />
      </div>
    </section>
  );
}
