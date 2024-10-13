import React from 'react';
import * as yup from 'yup';
import { FormikForm } from '../../../components/ui-comp/forms';
import { createPrivateApi, getRequest, postRequest } from '../../../api';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryClient } from '../../../https';
import { ENDPOINTS } from '../../../constants/endpoints';
import PlanAttributeTable from '../../../tables/admin/plan-attributes/table';

export default function PlanAttributes() {
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const [membershipPlanOptions, setMembershipPlanOptions] = React.useState([]);
  const [formik, setFormik] = React.useState([]);
  const queryId = ['get-all-countries'];

  const {
    data: membershipPlanData,
    isLoading: membershipPlanIsLoading,
    isRefetching: membershipPlanIsRefetching,
    isError: membershipPlanIsError,
    error: membershipPlanError,
  } = useQuery({
    queryKey: ['get-membership-plans'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.MEMBERSHIP.GET_ALL_PLANS }),
    gcTime: 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (!membershipPlanIsLoading || !membershipPlanIsRefetching) {
      if (membershipPlanData?.$values) {
        const options = membershipPlanData?.$values.map(value => ({
          label: value.planName,
          value: value.planId,
        }));
        setMembershipPlanOptions(options || []);
      }
    }
  }, [membershipPlanIsLoading, membershipPlanData, membershipPlanIsRefetching]);

  React.useEffect(() => {
    if (membershipPlanIsError) {
      toast.error(membershipPlanError.message || 'Something went wrong');
    }
  }, [membershipPlanIsError, membershipPlanError]);

  const {
    isPending: createPlanAttributeIsPending,
    isError: createPlanAttributeIsError,
    error: createPlanAttributeError,
    mutate: createPlanAttributeMutate,
    reset: createPlanAttributeReset,
  } = useMutation({
    mutationKey: ['create-plan-attribute'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data?.message || 'Plan Attribute created successfully');
      queryClient.invalidateQueries(queryId);
      createPlanAttributeReset();
      formik?.resetForm();
    },
  });

  React.useEffect(() => {
    if (createPlanAttributeIsError) {
      toast.error(createPlanAttributeError.message || 'Something went wrong');
      createPlanAttributeReset();
    }
  }, [createPlanAttributeIsError, createPlanAttributeError, createPlanAttributeReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'attributeName',
      label: 'Attribute Name',
      placeholder: 'Enter Attribute Name',
      id: 'stateName',
      yupValidation: yup.string().required('Attribute Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'attributeDetails',
      label: 'Attribute Details',
      placeholder: 'Enter Attribute Name',
      id: 'stateName',
      yupValidation: yup.string().required('Attribute Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'dropdown',
      name: 'memberShipId',
      label: 'Select Membership Plan',
      placeholder: 'Select Membership Plan',
      id: 'memberShipId',
      yupValidation: yup.string().required('Membership plan is required'),
      required: true,
      options: membershipPlanOptions || [],
      typeOfValue: 'number',
      isLoading: membershipPlanIsLoading,
      value: '',
    },
  ];

  function submitPlanAttributeHandler(values, formik) {
    // eslint-disable-next-line
    const payload = { CityName: values.cityName, StateId: parseInt(values.stateId) };

    createPlanAttributeMutate({ customAxios: privateAxios, data: payload, url: ENDPOINTS.STATE.STATE });
    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create Plan Attribute'
        formDescription={`Manage and customize plan attributes for your membership offerings. Add, view, and edit attributes to enhance the flexibility and organization of your plans.`}
        isPending={createPlanAttributeIsPending}
        onSubmit={submitPlanAttributeHandler}
      />
      <div>
        <PlanAttributeTable
          membershipPlanDetails={membershipPlanData?.$values || []}
          queryId={queryId}
          title={'Plan Attributes'}
          privateAxios={privateAxios}
          options={membershipPlanOptions}
        />
      </div>
    </section>
  );
}
