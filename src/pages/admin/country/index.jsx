import React from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { FormikForm } from '../../../components/ui-comp/forms';
import toast from 'react-hot-toast';

import { createPrivateApi, postRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import CountryTable from '../../../tables/admin/countries/table';
import { queryClient } from '../../../https';

export default function Country() {
  const [formik, setFormik] = React.useState({});

  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);
  const queryId = ['get-country-detail'];

  const {
    isPending: createCountryIsPending,
    isError: createCountryIsError,
    error: createCountryError,
    mutate: createCountryMutate,
    reset: createCountryReset,
  } = useMutation({
    mutationKey: ['create-country'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'country created successfully');
      queryClient.invalidateQueries(queryId);
      createCountryReset();
      formik?.resetForm();
    },
  });

  React.useEffect(() => {
    if (createCountryIsError) {
      toast.error(createCountryError.message || 'Something went wrong');
      createCountryReset();
    }
  }, [createCountryIsError, createCountryError, createCountryReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'countryName',
      label: 'Country Name',
      placeholder: 'Enter Country Name',
      id: 'countryName',
      yupValidation: yup.string().required('Country Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'isocode',
      label: 'ISO CODE',
      placeholder: 'ISO CODE',
      id: 'isocode',
      yupValidation: yup.string().required('ISO code is required'),
      required: true,
    },
  ];

  function submitCountryHandler(values, formik) {
    // eslint-disable-next-line
    const payload = { countryName: values.countryName, isocode: values.isocode };

    createCountryMutate({ data: payload, customAxios: privateAxios, url: ENDPOINTS.COUNTRY.COUNTRY });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New Country'
        formDescription={`The "Add a Country" feature provides a simple form for users to input essential details about a new country, specifically its name and ISO code. This streamlined process ensures quick integration of new countries into your database, facilitating efficient data management and enhancing the geographical accuracy of your application.`}
        isPending={createCountryIsPending}
        onSubmit={submitCountryHandler}
      />
      <div>
        <CountryTable queryId={queryId} title={'Existing Countries'} privateAxios={privateAxios} />
      </div>
    </section>
  );
}
