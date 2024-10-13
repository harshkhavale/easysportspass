import * as yup from 'yup';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

import { FormikForm } from '../../../components/ui-comp/forms';
import { ENDPOINTS } from '../../../constants/endpoints';
import { createPrivateApi } from '../../../api';
import { createMemberShipPlan } from '../../../https/post';

import MembershipPlanTable from '../../../tables/admin/membership-plan/table';
import { queryClient } from '../../../https';

export default function MembershipPlan() {
  const [formik, setFormik] = React.useState({});

  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const queryId = ['get-membership-plans'];

  const {
    isPending: createPlanIsPending,
    isError: createPlanIsError,
    error: createPlanError,
    mutate: createPlanMutate,
    reset: createPlanReset,
  } = useMutation({
    mutationKey: ['create-membership-plan'],
    mutationFn: createMemberShipPlan,
    onSuccess: data => {
      toast.success(data?.message || 'Membership plan created successfully');
      queryClient.invalidateQueries(queryId);
      formik?.resetForm();
    },
  });

  useEffect(() => {
    if (createPlanIsError) {
      toast.error(createPlanError.message || 'Something went wrong');
      createPlanReset();
    }
  }, [createPlanIsError, createPlanError, createPlanReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'plan_name',
      label: 'Plan Name',
      placeholder: 'Enter Plan Name',
      id: 'plan_name',
      yupValidation: yup.string().min(4, 'Plan name must be at least 4 characters').required('Plan name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'Price',
      label: 'Price',
      placeholder: 'Price',
      id: 'Price',
      yupValidation: yup.string().required(),
      required: true,
    },
    {
      type: 'text',
      inputType: 'textarea',
      name: 'Description',
      label: 'Description',
      placeholder: 'Enter Description',
      id: 'description',
      yupValidation: yup.string().required('Description is required'),
      required: true,
      fullWidth: true,
    },
  ];

  function SubmitPlanHandler(values, formik) {
    const payload = {
      PlanName: values.plan_name,
      Description: values.Description,
      Price: parseInt(values.Price),
      CreatedDateTime: new Date().toISOString(),
      ModifiedDateTime: new Date().toISOString(),
      CreatedBy: 'Admin',
      ModifiedBy: 'Admin',
    };

    createPlanMutate({ payload, privateAxios: privateApi, url: ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS });
    setFormik(formik);
  }

  return (
    <div className='flex flex-col space-y-5'>
      <FormikForm
        inputs={inputs}
        formTitle='Create New Membership Plan'
        formDescription={
          'Use the form to add a new membership plan, including the plan name, price, and description to provide details about the benefits and access levels of the plan.'
        }
        onSubmit={SubmitPlanHandler}
        isPending={createPlanIsPending}
      />
      <div>
        <MembershipPlanTable queryId={queryId} title={'Existing Plans'} privateUrl={privateApi} />
      </div>
    </div>
  );
}
