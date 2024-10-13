import * as yup from 'yup';

import { FormikForm } from '../../../components/ui-comp/forms';
import StateTable from '../../../tables/admin/state/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPrivateApi, getRequest, postRequest } from '../../../api';
import { useSelector } from 'react-redux';
import { ENDPOINTS } from '../../../constants/endpoints';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { queryClient } from '../../../https';

export default function State() {
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const [countriesOption, setCountriesOption] = useState([]);
  const [formik, setFormik] = useState([]);
  const queryId = ['get-all-countries'];

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

  const {
    isPending: createStateIsPending,
    isError: createStateIsError,
    error: createStateError,
    mutate: createStateMutate,
    reset: createStateReset,
  } = useMutation({
    mutationKey: ['create-country'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'State created successfully');
      queryClient.invalidateQueries(queryId);
      createStateReset();
      formik?.resetForm();
    },
  });

  React.useEffect(() => {
    if (createStateIsError) {
      toast.error(createStateError.message || 'Something went wrong');
      createStateReset();
    }
  }, [createStateIsError, createStateError, createStateReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'stateName',
      label: 'State Name',
      placeholder: 'Enter State Name',
      id: 'stateName',
      yupValidation: yup.string().required('State Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'dropdown',
      name: 'countryId',
      label: 'Select Country',
      placeholder: 'Select Country',
      id: 'countryId',
      yupValidation: yup.string().required('Country is required'),
      required: true,
      options: countriesOption || [],
      typeOfValue: 'number',
      isLoading: getCountriesIsLoading,
      value: '',
    },
  ];
  function submitStateHandler(values, formik) {
    // eslint-disable-next-line
    const payload = { stateName: values.stateName, countryId: parseInt(values.countryId) };

    createStateMutate({ customAxios: privateAxios, data: payload, url: ENDPOINTS.STATE.STATE });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New State'
        formDescription={`The "Create a State" form allows users to easily add a new state by providing the state name and selecting the associated country. This simple two-field input ensures efficient state management within your application.`}
        isPending={createStateIsPending}
        onSubmit={submitStateHandler}
      />
      <div>
        <StateTable queryId={queryId} title={'Existing States'} privateAxios={privateAxios} />
      </div>
    </section>
  );
}
