import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { createPrivateApi, getRequest, putMultipartRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { ManageProfileForm } from '../../../components/ui-comp/forms';
import { base64UrlToBlob, blobToFile } from '../../../lib/utils';

export default function CorporateManageProfile() {
  const [formik, setFormik] = useState({});

  const userProfile = useSelector(state => state.auth.user.profilePic);
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const corporateId = useSelector(state => state.auth?.user.corporateId);
  const userDetails = useSelector(state => state.auth?.user);

  const imageUrl = `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${userProfile}`;

  const {
    data: getImageData,
    isLoading: getImageDataIsLoading,
    isRefetching: getImageDataIsRefetching,
    isError: getImageDataIsError,
    error: getImageDataError,
  } = useQuery({
    queryKey: ['get-profile-pic'],
    queryFn: () => getRequest({ url: imageUrl, customAxios: privateAxios }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getImageDataIsError) {
      toast.error(getImageDataError.message || 'Something went wrong');
    }
  }, [getImageDataIsError, getImageDataError]);

  const {
    isPending: updateCorporateIsPending,
    isError: updateCorporateIsError,
    error: updateCorporateError,
    mutate: updateCorporateMutate,
    reset: updateCorporateReset,
  } = useMutation({
    mutationKey: ['update-corporate-date'],
    mutationFn: putMultipartRequest,
    onSuccess: data => {
      toast.success(data.message || 'Your profile updated successfully.');
      updateCorporateReset();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (updateCorporateIsError) {
      toast.error(updateCorporateError.message || 'Something went wrong');
    }
  }, [updateCorporateIsError, updateCorporateError]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'corporateName',
      label: 'Corporate Name',
      placeholder: 'Enter Corporate Name',
      id: 'corporateName',
      yupValidation: yup.string().min(4, 'Corporate Name must be at least 4 characters'),
      required: true,
      value: userDetails.corporateName,
    },
    {
      type: 'email',
      inputType: 'input',
      name: 'contactPersonEmail',
      label: 'Contact Person Email',
      placeholder: 'Enter a Contact Person Email',
      id: 'ContactPersonEmail',
      yupValidation: yup.string().email(),
      required: true,
      value: userDetails.contactPersonEmail,
    },
    {
      type: 'date',
      inputType: 'input',
      name: 'contactPersonName',
      label: 'Contact Person Name',
      placeholder: 'Enter a Contact Person Name',
      id: 'contactPersonName',
      yupValidation: yup.string(),
      value: userDetails?.contactPersonName || '',
      className: 'sm:col-span-2',
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonDetail',
      label: 'Contact Person Details',
      placeholder: 'Enter a Contact Person Details',
      id: 'contactPersonDetail',
      yupValidation: yup.string(),
      value: userDetails.contactPersonDetail,
      className: 'sm:col-span-2',
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contactPersonMobileNo',
      label: 'Contact Person Mobile No.',
      placeholder: 'Enter a Contact Person Mobile No.',
      id: 'contactPersonMobileNo',
      yupValidation: yup.string(),
      value: userDetails?.contactPersonMobileNo,
      className: 'sm:col-span-2',
    },
  ];

  function registerCorporateHandler(values, formik) {
    const payload = {
      corporateName: values.corporateName,
      contactPersonEmail: values.contactPersonEmail,
      contactPersonName: values.contactPersonName,
      contactPersonDetail: values.contactPersonDetail,
      contactPersonMobileNo: values.contactPersonMobileNo,
    };

    const { blob, fileName } = base64UrlToBlob(values.imageUrl, `${values.firstName}_${values.lastName}`);
    const file = blobToFile(blob, fileName);

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('profilePic', file);

    updateCorporateMutate({ customAxios: privateAxios, formData, url: `${ENDPOINTS.CORPORATE.CORPORATE}/${corporateId}` });

    setFormik(formik);
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col space-y-5'>
        <ManageProfileForm
          imageLoadingState={getImageDataIsRefetching || getImageDataIsLoading}
          imageUrl={getImageData}
          formTitle='Update Personal Information'
          formDescription={`You can update your profile here by filling in your supplier details. Modify your name, contact information, website, and other relevant fields to ensure your information is accurate and up-to-date. Simply complete the form and click "Save" to apply changes to your profile.`}
          inputs={inputs}
          isPending={updateCorporateIsPending}
          onSubmit={registerCorporateHandler}
          submitButtonText={'Update'}
        />
      </div>
    </section>
  );
}
