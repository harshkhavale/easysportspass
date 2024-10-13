import * as yup from 'yup';

import { FormikForm } from '../../../components/ui-comp/forms';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPrivateApi, getRequest, postRequest } from '../../../api';
import { useSelector } from 'react-redux';
import { ENDPOINTS } from '../../../constants/endpoints';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { queryClient } from '../../../https';
import CitiesTable from '../../../tables/admin/cities/table';

export default function City() {
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const [statesOption, setStatesOption] = useState([]);
  const [formik, setFormik] = useState([]);
  const queryId = ['get-all-states'];

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
        const countriesOption = getStatesData?.$values?.map(value => ({
          label: value.stateName,
          value: value.stateId,
        }));

        setStatesOption(countriesOption);
      }
    }
  }, [getStatesIsLoading, getStatesData, getStatesIsRefetching]);

  const {
    isPending: createStateIsPending,
    isError: createStateIsError,
    error: createStateError,
    mutate: createStateMutate,
    reset: createStateReset,
  } = useMutation({
    mutationKey: ['create-city'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'City created successfully');
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
      name: 'cityName',
      label: 'City Name',
      placeholder: 'Enter City Name',
      id: 'cityName',
      yupValidation: yup.string().required('City Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'dropdown',
      name: 'stateId',
      label: 'Select State',
      placeholder: 'Select State',
      id: 'stateId',
      yupValidation: yup.string().required('State is required'),
      required: true,
      options: statesOption || [],
      typeOfValue: 'number',
      isLoading: getStatesIsLoading,
      value: '',
    },
  ];

  function submitStateHandler(values, formik) {
    // eslint-disable-next-line
    const payload = { CityName: values.cityName, StateId: parseInt(values.stateId) };

    createStateMutate({ customAxios: privateAxios, data: payload, url: ENDPOINTS.STATE.STATE });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New City'
        formDescription={`The Create New City form allows users to add a city by entering its name and selecting the state it belongs to from a dropdown menu. With just two fields—City Name and Select State—the form ensures quick and easy city creation, streamlining the process of adding new locations.`}
        isPending={createStateIsPending}
        onSubmit={submitStateHandler}
      />
      <div>
        <CitiesTable queryId={queryId} title={'Existing Cities'} privateAxios={privateAxios} />
      </div>
    </section>
  );
}
