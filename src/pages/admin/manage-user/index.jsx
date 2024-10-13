import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormikForm } from '../../../components/ui-comp/forms';
import toast from 'react-hot-toast';

import { createPrivateApi, postRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import ManageUsersTable from '../../../tables/admin/manage-users/table';
import { getMembershipPlanHandler } from '../../../https/get';
import { queryClient } from '../../../https';
import moment from 'moment/moment';
import { phoneRegExp } from '../../../lib/utils';

export default function ManageUser() {
  const [formik, setFormik] = React.useState({});
  const [membershipOptions, setMembershipOptions] = React.useState([]);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [sendMessage, setSendMessage] = React.useState(false);
  const [sendMessageMethod, setSendMessageMethod] = React.useState({});

  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const queryId = ['get-users-detail'];

  const {
    data: membershipPlanData,
    isLoading: membershipPlanIsLoading,
    isRefetching: membershipPlanIsRefetching,
    isError: membershipPlanIsError,
    error: membershipPlanError,
  } = useQuery({
    queryKey: ['get-membership-plans'],
    queryFn: async () => getMembershipPlanHandler({ privateUrl: privateApi, url: ENDPOINTS.MEMBERSHIP.GET_ALL_PLANS }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (membershipPlanIsError) {
      toast.error(membershipPlanError.message || 'Something went wrong');
    }
  }, [membershipPlanIsError, membershipPlanError]);

  const {
    data: getCategoryData,
    isLoading: getCategoryIsLoading,
    isRefetching: getCategoryIsRefetching,
    isError: getCategoryIsError,
    error: getCategoryError,
  } = useQuery({
    queryKey: ['get-category-data'],
    queryFn: async () => getMembershipPlanHandler({ privateUrl: privateApi, url: ENDPOINTS.USERS.CATEGORY }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCategoryIsError) {
      toast.error(getCategoryError.message || 'Something went wrong');
    }
  }, [getCategoryIsError, getCategoryError]);

  const {
    isPending: createMembershipPlanIsPending,
    isError: createMembershipPlanIsError,
    error: createMembershipPlanError,
    mutate: createMembershipPlanMutate,
    reset: createMembershipPlanReset,
  } = useMutation({
    mutationKey: ['create-user'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'User created successfully');
      createMembershipPlanReset();

      queryClient.invalidateQueries(queryId);
      formik?.resetForm();
    },
  });

  React.useEffect(() => {
    if (createMembershipPlanIsError) {
      toast.error(createMembershipPlanError.message || 'Something went wrong');
      createMembershipPlanReset();
    }
  }, [createMembershipPlanIsError, createMembershipPlanError, createMembershipPlanReset]);

  const {
    isPending: sendEmailIsPending,
    isError: sendEmailIsError,
    error: sendEmailError,
    mutate: sendMessageMutate,
    reset: sendEmailReset,
  } = useMutation({
    mutationKey: ['send-email-to-user'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data.message || 'Email sended successfully to the newly created user.');
      sendEmailReset();
    },
  });

  const {
    isPending: createUserIsPending,
    isError: createUserIsError,
    error: createUserError,
    mutate: createUserMutate,
    reset: createUserReset,
  } = useMutation({
    mutationKey: ['create-user'],
    mutationFn: postRequest,
    onSuccess: data => {
      createUserReset();
      const currentDate = moment();

      const membershipPlanPayload = {
        UserId: data.userId,
        PlanId: formik.values.membershipPlanId,
        StartDate: currentDate.format('YYYY-MM-DD'),
        EndDate: currentDate.add(1, 'year').format('YYYY-MM-DD'),
      };

      createMembershipPlanMutate({
        customAxios: privateApi,
        data: membershipPlanPayload,
        url: ENDPOINTS.MEMBERSHIP.USER_DETAIL,
      });

      if (sendMessage) {
        sendMessageMutate({
          customAxios: privateApi,
          data: { [sendMessageMethod.type || '']: sendMessageMethod.value || '' },
          url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.MESSAGE.SEND_EMAIL}`,
        });
      }
    },
  });

  React.useEffect(() => {
    if (createUserIsError) {
      toast.error(createUserError.message || 'Something went wrong');
      createUserReset();
    }
  }, [createUserIsError, createUserError, createUserReset]);

  React.useEffect(() => {
    if (sendEmailIsError) {
      toast.error(sendEmailError.message || 'Something went wrong');
      sendEmailReset();
    }
  }, [sendEmailIsError, sendEmailError, sendEmailReset]);

  React.useEffect(() => {
    if (!membershipPlanIsLoading || !membershipPlanIsRefetching) {
      if (membershipPlanData?.$values) {
        const options = membershipPlanData?.$values.map(value => ({
          label: value.planName,
          value: value.planId,
        }));
        setMembershipOptions(options || []);
      }
    }
  }, [membershipPlanIsLoading, membershipPlanData, membershipPlanIsRefetching]);

  React.useEffect(() => {
    if (!getCategoryIsLoading || !getCategoryIsRefetching) {
      if (getCategoryData?.$values) {
        const options = getCategoryData?.$values.map(value => ({
          label: value.categoryName,
          value: value.categoryId,
        }));
        setCategoryOptions(options || []);
      }
    }
  }, [getCategoryIsLoading, getCategoryIsRefetching, getCategoryData]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'firstname',
      label: 'First Name',
      placeholder: 'Enter First Name',
      id: 'firstName',
      yupValidation: yup.string().min(4, 'First Name must be at least 4 characters').required('First Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Last Name',
      id: 'lastName',
      yupValidation: yup.string().required('Last Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'mobile',
      label: 'Mobile Number',
      placeholder: 'Enter a Mobile number',
      id: 'mobile',
      yupValidation: yup
        .string()
        .matches(phoneRegExp, 'Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain exactly 10 digits')
        .test('mobile-or-email', 'Either Email or Mobile Number is required', function (value) {
          const { email } = this.parent;
          return value || email;
        }),
    },
    {
      type: 'email',
      inputType: 'input',
      name: 'email',
      label: 'Email ID',
      placeholder: 'Enter a Email ID',
      id: 'email',
      yupValidation: yup
        .string()
        .email('Must be a valid email')
        .test('email-or-mobile', 'Either Email or Mobile Number is required', function (value) {
          const { mobile } = this.parent;
          return value || mobile;
        }),
    },

    {
      type: 'text',
      inputType: 'dropdown',
      name: 'membershipPlanId',
      label: 'Membership Plans',
      placeholder: 'Select Membership Plans',
      id: 'membershipPlanId',
      yupValidation: yup.string().required('membership Plan is required'),
      required: true,
      options: membershipOptions || [],
      typeOfValue: 'number',
      isLoading: membershipPlanIsLoading,
      value: '',
    },
    {
      type: 'text',
      inputType: 'dropdown',
      name: 'categoryId',
      label: 'Select User Category',
      placeholder: 'Select User Category',
      id: 'categoryId',
      yupValidation: yup.string().required('User Category is required'),
      required: true,
      options: categoryOptions || [],
      typeOfValue: 'number',
      isLoading: getCategoryIsLoading,
      value: '',
    },
    {
      type: 'password',
      inputType: 'input',
      name: 'password',
      label: 'Password',
      placeholder: 'Password',
      id: 'password',
      yupValidation: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
      required: true,
    },
    {
      type: 'password',
      inputType: 'input',
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      id: 'confirmPassword',
      yupValidation: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
      required: true,
    },
    {
      inputType: 'checkbox',
      name: 'sendMessageToggle',
      label: 'Send Message?',
      placeholder: '',
      id: 'sendMessageToggle',
      required: true,
      value: false,
    },
  ];

  function submitUserHandler(values, formik) {
    const payload = {
      FirstName: values.firstname,
      LastName: values.lastName,
      MembershipPlanId: parseInt(values.membershipPlanId),
      UserCategoryId: parseInt(values.categoryId),
      password: values.password,
    };

    if (values.email) {
      payload.Email = values.email;
    }

    if (values.mobile) {
      payload.Mobile = values.mobile;
    }

    setSendMessage(values.sendMessageToggle);
    setSendMessageMethod({
      type: values.email ? 'email' : 'mobile',
      value: values.email || values.mobile,
    });

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    createUserMutate({ customAxios: privateApi, data: payload, url: ENDPOINTS.USERS.USERS });
    // createUserMutate({ customAxios: privateApi, formData, url: ENDPOINTS.USERS.USERS });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New User'
        formDescription={`Easily manage your users by filling in the "Create New User" form with details like name, email, and mobile, and assign them a membership plan. Once added, users will appear in the list below, where you can edit or remove them as needed to keep your database up to date.`}
        isPending={createUserIsPending || createMembershipPlanIsPending || sendEmailIsPending}
        onSubmit={submitUserHandler}
      />
      <div>
        <ManageUsersTable queryId={queryId} title={'Existing Users'} privateAxios={privateApi} />
      </div>
    </section>
  );
}
