import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { createPrivateApi, postRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { FormikForm } from '../../../components/ui-comp/forms';
import { queryClient } from '../../../https';
import ActivitiesTable from '../../../tables/supplier/activities-table';

export default function Activities() {
  const [formik, setFormik] = useState({});

  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);
  const queryId = ['get-supplier-activities'];

  const {
    isPending: createActivityIsPending,
    isError: createActivityIsError,
    error: createActivityError,
    mutate: createActivityMutate,
    reset: createActivityReset,
  } = useMutation({
    mutationKey: ['create-supplier-activities'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data.message || 'Activities created successfully.');
      createActivityReset();
      queryClient.invalidateQueries(queryId);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (createActivityIsError) {
      toast.error(createActivityError.message || 'Something while creating activity');
      createActivityReset();
    }
  }, [createActivityIsError, createActivityError, createActivityReset]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'activityName',
      label: 'Activity Name',
      placeholder: 'Enter Activity Name',
      id: 'activityName',
      yupValidation: yup.string().required('Activity Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'activityDescription',
      label: 'Activity Description',
      placeholder: 'Activity Description',
      id: 'Activity Description',
      yupValidation: yup.string().required('Activity Description is required'),
      required: true,
    },
  ];

  function registerSupplierHandler(values, formik) {
    const payload = {
      activityName: values.activityName,
      activityDescription: values.activityDescription,
    };

    createActivityMutate({ customAxios: privateAxios, data: payload, url: ENDPOINTS.ACTIVITIES.ACTIVITIES });

    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        formTitle='Create Activity'
        formDescription={`In the "Create Activity" form, you can add a new activity by entering the activity name and a brief description. Once you've filled in these details, click "Save" to create the activity. This allows you to easily manage and track activities within your profile.`}
        inputs={inputs}
        isPending={createActivityIsPending}
        onSubmit={registerSupplierHandler}
      />

      <div>
        <ActivitiesTable queryId={queryId} title={'Suppliers'} privateAxios={privateAxios} ModifiedBy={'Supplier'} />
      </div>
    </section>
  );
}
