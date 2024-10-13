import React from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { FormikForm } from '../../../components/ui-comp/forms';
import toast from 'react-hot-toast';

import { createPrivateApi, postRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { queryClient } from '../../../https';
import CorporateUsers from '../../../tables/admin/corporate-user/table';

export default function CorporateUser() {
  const [formik, setFormik] = React.useState({});

  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);
  const queryId = ['get-corporate-users'];

  const {
    isPending: createCorporateUserIsPending,
    isError: createCorporateUserIsError,
    error: createCorporateUserError,
    mutate: createCorporateUserMutate,
    reset: createCorporateUserReset,
  } = useMutation({
    mutationKey: ['create-corporate-user'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'create corporate user created successfully');
      queryClient.invalidateQueries(queryId);
      createCorporateUserReset();
      formik?.resetForm();
    },
  });

  React.useEffect(() => {
    if (createCorporateUserIsError) {
      toast.error(createCorporateUserError.message || 'Something went wrong');
      createCorporateUserReset();
    }
  }, [createCorporateUserIsError, createCorporateUserError, createCorporateUserReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'corporateName',
      label: 'Corporate Name',
      placeholder: 'Enter corporate name',
      id: 'corporateName',
      yupValidation: yup.string().required('Corporate Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonName',
      label: 'Contact person name',
      placeholder: 'Contact person name',
      id: 'contactPersonName',
      yupValidation: yup.string().required('Contact person name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonDetail',
      label: 'Contact person detail',
      placeholder: 'Contact person detail',
      id: 'contactPersonDetail',
      yupValidation: yup.string().required('Contact person detail is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonMobileNo',
      label: 'Contact person mobile No',
      placeholder: 'Contact person mobile No',
      id: 'contactPersonMobileNo',
      yupValidation: yup.string().required('Contact person mobile No is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonEmail',
      label: 'Contact Person Email',
      placeholder: 'Contact Person Email',
      id: 'contactPersonEmail',
      yupValidation: yup.string().email().required('Contact Person Email is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'emailIdentifier',
      label: 'Email Identifier',
      placeholder: 'Email Identifier',
      id: 'emailIdentifier',
      yupValidation: yup.string().required('Email Identifier is required'),
      required: true,
    },
  ];

  function submitCorporateUserHandler(values, formik) {
    // eslint-disable-next-line
    const payload = {
      corporateName: values.corporateName,
      contactPersonName: values.contactPersonName,
      contactPersonDetail: values.contactPersonDetail,
      contactPersonMobileNo: values.contactPersonMobileNo,
      contactPersonEmail: values.contactPersonEmail,
      emailIdentifier: values.emailIdentifier,
      createdBy: 'admin',
      updatedBy: 'admin',
    };

    createCorporateUserMutate({ data: payload, customAxios: privateAxios, url: ENDPOINTS.CORPORATE.CORPORATE });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New Country'
        formDescription={`The "Add a Country" feature provides a simple form for users to input essential details about a new country, specifically its name and ISO code. This streamlined process ensures quick integration of new countries into your database, facilitating efficient data management and enhancing the geographical accuracy of your application.`}
        isPending={createCorporateUserIsPending}
        onSubmit={submitCorporateUserHandler}
      />
      <div>
        <CorporateUsers queryId={queryId} title={'Existing Countries'} privateAxios={privateAxios} />
      </div>
    </section>
  );
}
