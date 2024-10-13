import * as yup from 'yup';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { createPrivateApi, getRequest, putMultipartRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { ManageProfileForm } from '../../../components/ui-comp/forms';
import { base64UrlToBlob, blobToFile, phoneRegExp } from '../../../lib/utils';

export default function SupplierManageProfile() {
  const [formik, setFormik] = useState({});
  const [citiesOption, setCitiesOption] = useState([]);
  const [statesOption, setStatesOption] = useState([]);
  const [countriesOption, setCountriesOption] = useState([]);

  const token = useSelector(state => state.auth?.token);
  const userProfile = useSelector(state => state.auth.user.profilePic);

  const privateAxios = createPrivateApi(token);

  const userId = useSelector(state => state.auth?.user.userId);
  const userDetails = useSelector(state => state.auth?.user);

  const imageUrl = `${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${userProfile}`;

  const {
    data: getCitiesData,
    isLoading: getCitiesIsLoading,
    isRefetching: getCitiesIsRefetching,
    isError: getCitiesIsError,
    error: getCitiesError,
  } = useQuery({
    queryKey: ['get-city-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.CITY.CITY }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCitiesIsError) {
      toast.error(getCitiesError.message || 'Something went wrong');
    }
  }, [getCitiesIsError, getCitiesError]);

  useEffect(() => {
    if (!getCitiesIsLoading || !getCitiesIsRefetching) {
      const values = getCitiesData?.$values;
      if (values && Array.isArray(values)) {
        const cityOptions = values.map(value => ({
          label: value.cityName,
          value: value.cityId,
        }));

        setCitiesOption(cityOptions);
      }
    }
  }, [getCitiesData, getCitiesIsLoading, getCitiesIsRefetching]);

  const {
    data: getStatesData,
    isLoading: getStatesIsLoading,
    isRefetching: getStatesIsRefetching,
    isError: getStatesIsError,
    error: getStatesError,
  } = useQuery({
    queryKey: ['get-states-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.STATE.STATE }),
    gcTime: 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (getStatesIsError) {
      toast.error(getStatesError.message || 'Something went wrong');
    }
  }, [getStatesIsError, getStatesError]);

  React.useEffect(() => {
    if (!getStatesIsLoading || !getStatesIsRefetching) {
      if (getStatesData?.$values && getStatesData?.$values?.length > 0) {
        const stateOPtions = getStatesData?.$values?.map(value => ({
          label: value.stateName,
          value: value.stateId,
        }));

        setStatesOption(stateOPtions);
      }
    }
  }, [getStatesIsLoading, getStatesData, getStatesIsRefetching]);

  const {
    data: getCountriesData,
    isLoading: getCountriesIsLoading,
    isRefetching: getCountriesIsRefetching,
    isError: getCountriesIsError,
    error: getCountriesError,
  } = useQuery({
    queryKey: ['get-countries-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.COUNTRY.COUNTRY }),
    gcTime: 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (getCountriesIsError) {
      toast.error(getCountriesError.message || 'Something went wrong');
    }
  }, [getCountriesIsError, getCountriesError]);

  React.useEffect(() => {
    if (!getCountriesIsLoading || !getCountriesIsRefetching) {
      if (getCountriesData?.$values && getCountriesData?.$values?.length > 0) {
        const countriesOption = getCountriesData?.$values?.map(value => ({
          label: value.countryName,
          value: value.countryId,
        }));

        setCountriesOption(countriesOption);
      }
    }
  }, [getCountriesIsLoading, getCountriesData, getCountriesIsRefetching]);

  const { data: getImageData, isLoading: getImageDataIsLoading } = useQuery({
    queryKey: ['get-profile-pic'],
    queryFn: () => getRequest({ url: imageUrl, customAxios: privateAxios }),
    gcTime: 0,
    staleTime: Infinity,
  });

  const {
    isPending: updateSupplierIsPending,
    isError: updateSupplierIsError,
    error: updateSupplierError,
    mutate: updateSupplierMutate,
    reset: updateSupplierReset,
  } = useMutation({
    mutationKey: ['update-supplier-supplier'],
    mutationFn: putMultipartRequest,
    onSuccess: data => {
      toast.success(data.message || 'Your profile updated successfully.');
      updateSupplierReset();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (updateSupplierIsError) {
      toast.error(updateSupplierError.message || 'Something went wrong');
    }
  }, [updateSupplierIsError, updateSupplierError]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'supplierName',
      label: 'Supplier Name',
      placeholder: 'Enter Supplier Name',
      id: 'supplierName',
      yupValidation: yup.string().min(4, 'Supplier Name must be at least 4 characters'),
      value: userDetails.supplierName,
    },
    {
      type: 'email',
      inputType: 'input',
      name: 'website',
      label: 'Website',
      placeholder: 'Enter a Website',
      id: 'website',
      yupValidation: yup.string().url(),
      value: userDetails.website,
    },
    {
      type: 'text',
      inputType: 'textarea',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter Description',
      id: 'description',
      yupValidation: yup.string().min(4, 'Description must be at least 4 characters'),
      value: userDetails.description,
      fullWidth: true,
    },
    {
      type: 'text',
      inputType: 'textarea',
      name: 'address',
      label: 'Address',
      placeholder: 'Enter a Address',
      id: 'address',
      yupValidation: yup.string(),
      value: userDetails.address,
      fullWidth: true,
    },
    {
      type: 'time',
      inputType: 'input',
      name: 'openingTime',
      label: 'Opening Time',
      placeholder: 'Enter a opening time',
      id: 'openingTime',
      yupValidation: yup.string(),
      value: userDetails?.openingTime || '',
      className: 'sm:col-span-2',
    },
    {
      type: 'time',
      inputType: 'input',
      name: 'closingTime',
      label: 'Enter a closing time',
      placeholder: 'Enter a Closing Time',
      id: 'closingTime',
      yupValidation: yup.string(),
      value: userDetails?.closingTime,
      className: 'sm:col-span-2',
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contact',
      label: 'Contact',
      placeholder: 'Enter a Contact',
      id: 'contact',
      yupValidation: yup
        .string()
        .matches(phoneRegExp, 'Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain exactly 10 digits')
        .test('mobile-or-email', 'Either Email or Mobile Number is required', function (value) {
          const { email } = this.parent;
          return value || email;
        }),
      value: userDetails?.contact,
      className: 'sm:col-span-2',
    },
    {
      inputType: 'dropdown',
      name: 'cityId',
      label: 'Select a City',
      placeholder: 'Select a City',
      id: 'City',
      yupValidation: yup.string(),
      value: userDetails?.city,
      options: citiesOption || [],
      typeOfValue: 'string',
      isLoading: getCitiesIsLoading || getCitiesIsRefetching,
      className: 'sm:col-span-2',
    },
    {
      inputType: 'dropdown',
      name: 'stateId',
      label: 'Select a State',
      placeholder: 'Select a State',
      id: 'stateId',
      yupValidation: yup.string(),
      value: userDetails?.stateId,
      options: statesOption || [],
      typeOfValue: 'string',
      isLoading: getStatesIsLoading || getStatesIsRefetching,
      className: 'sm:col-span-2',
    },
    {
      inputType: 'dropdown',
      name: 'countryId',
      label: 'Select a Country',
      placeholder: 'Select a Country',
      id: 'countryId',
      yupValidation: yup.string(),
      value: userDetails?.countryId,
      options: countriesOption || [],
      typeOfValue: 'string',
      isLoading: getCountriesIsLoading || getCountriesIsRefetching,
      className: 'sm:col-span-2',
    },

    {
      type: 'text',
      inputType: 'input',
      name: 'postalCode',
      label: 'Postal Code',
      placeholder: 'Enter a Postal Code',
      id: 'postalCode',
      yupValidation: yup.string(),
      value: userDetails?.postalCode,
      className: 'sm:col-span-2',
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'maxMemberPrice',
      label: 'Max Member Price',
      placeholder: 'Enter a Max Member Price',
      id: 'maxMemberPrice',
      yupValidation: yup.string(),
      value: userDetails?.maxMemberPrice,
      className: 'sm:col-span-2',
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'location',
      label: 'Location',
      placeholder: 'Enter a Location',
      id: 'location',
      yupValidation: yup.string(),
      value: userDetails?.location,
      className: 'sm:col-span-2',
    },

    {
      type: 'text',
      inputType: 'input',
      name: 'email',
      label: 'Email ID',
      placeholder: 'Enter a Email ID',
      id: 'email',
      yupValidation: yup
        .string()
        .email('Must be a valid email')
        .test('email-or-mobile', 'Either Email or Mobile Number is required', function (value) {
          const { contact } = this.parent;
          return value || contact;
        }),

      value: userDetails?.email,
      className: 'sm:col-span-2',
    },
  ];

  function registerSupplierHandler(values, formik) {
    const payload = {
      supplierName: values.supplierName,
      description: values.description,
      email: values.email,
      website: values.website,
      openingTime: values.openingTime,
      closingTime: values.closingTime,
      address: values.address,
      cityId: values.cityId,
      stateId: values.stateId,
      countryId: values.countryId,
      postalCode: values.postalCode,
      maxMemberPrice: values.maxMemberPrice,
      location: values.location,
      contact: values.contact,
    };

    const { blob, fileName } = base64UrlToBlob(values.imageUrl, `${values.firstName}_${values.lastName}`);
    const file = blobToFile(blob, fileName);

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('profilePic', file);

    updateSupplierMutate({ customAxios: privateAxios, payload: payload, url: `${ENDPOINTS.USERS.USERS}/${userId}` });

    setFormik(formik);
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col space-y-5'>
        <ManageProfileForm
          imageLoadingState={getImageDataIsLoading}
          imageUrl={getImageData}
          formTitle='Update Personal Information'
          formDescription={`You can update your profile here by filling in your supplier details. Modify your name, contact information, website, and other relevant fields to ensure your information is accurate and up-to-date. Simply complete the form and click "Save" to apply changes to your profile.`}
          inputs={inputs}
          isPending={updateSupplierIsPending}
          onSubmit={registerSupplierHandler}
          submitButtonText={'Update'}
        />
      </div>
    </section>
  );
}
