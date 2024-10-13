import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { createPrivateApi, postRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import { FormikForm } from '../../../components/ui-comp/forms';
import SuppliersTable from '../../../tables/admin/suppliers-table/table';
import { queryClient } from '../../../https';

export default function Suppliers() {
  const [formik, setFormik] = useState({});

  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);
  const queryId = ['get-supplier-details'];

  const {
    isPending: createSupplierIsPending,
    isError: createSupplierIsError,
    error: createSupplierError,
    mutate: createSupplierMutate,
    reset: createSupplierReset,
  } = useMutation({
    mutationKey: ['register-supplier'],
    mutationFn: postRequest,
    onSuccess: data => {
      toast.success(data.message || 'Supplier registered successfully.');
      createSupplierReset();
      queryClient.invalidateQueries(queryId);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (createSupplierIsError) {
      toast.error(createSupplierError.message || 'Something went wrong');
    }
  }, [createSupplierIsError, createSupplierError]);

  const inputs = [
    {
      type: 'text',
      inputType: 'input',
      name: 'SupplierName',
      label: 'Supplier Name',
      placeholder: 'Enter Supplier Name',
      id: 'SupplierName',
      yupValidation: yup.string().required('Supplier Name is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'Description',
      label: 'Description',
      placeholder: 'Description',
      id: 'Description',
      yupValidation: yup.string().required('Description is required'),
      required: true,
    },
    {
      type: 'email',
      inputType: 'input',
      name: 'Email',
      label: 'Email ID',
      placeholder: 'Enter a Email ID',
      id: 'Email',
      yupValidation: yup.string().email().required('Email ID is required'),
      required: true,
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'contact',
      label: 'Contact Number',
      placeholder: 'Enter a Contact Number',
      id: 'contact',
      yupValidation: yup.string().required('Contact Number is required'),
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'Website',
      label: 'Website url',
      placeholder: 'Enter a Website url',
      id: 'Website',
      yupValidation: yup.string().required('Website url is required'),
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'Address',
      label: 'Address',
      placeholder: 'Enter a Address',
      id: 'Address',
      yupValidation: yup.string().required('Address is required'),
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'Postalcode',
      label: 'Postal Code',
      placeholder: 'Enter a Postal Code',
      id: 'Postalcode',
      yupValidation: yup.string().required('Postal Code is required'),
    },
    {
      type: 'text',
      inputType: 'input',
      name: 'MaxMemberPrice',
      label: 'Max member price',
      placeholder: 'Enter a Max member price',
      id: 'MaxMemberPrice',
      yupValidation: yup.string().required('Max member price is required'),
    },
  ];

  function registerSupplierHandler(values, formik) {
    const payload = {
      SupplierName: values.SupplierName,
      Description: values.Description,
      Email: values.Email,
      Contact: values.Contact,
      Website: values.Website,
      Address: values.Address,
      Postalcode: values.Postalcode,
      MaxMemberPrice: values.MaxMemberPrice,

      //   "Cityid": 1,
      //   "Stateid": 2,
      //   "Countryid": 3,
      //   "Location": "Sample Location",
      //   "Latitude": 12.34567,
    };

    createSupplierMutate({ customAxios: privateAxios, data: payload, url: ENDPOINTS.SUPPLIER.SUPPLIER });

    setFormik(formik);
  }

  return (
    <section className='flex flex-col space-y-5'>
      <FormikForm
        formTitle='Register New Suppliers'
        formDescription={`Easily add and manage your supplier details to streamline your procurement process. Fill out the form below to register new suppliers, ensuring seamless communication and efficient inventory management. Keep your supply chain organized by providing accurate information about your partners, making your business operations more reliable and scalable.`}
        inputs={inputs}
        isPending={createSupplierIsPending}
        onSubmit={registerSupplierHandler}
      />

      <div>
        <SuppliersTable queryId={queryId} title={'Suppliers'} privateAxios={privateAxios} ModifiedBy={'Supplier'} />
      </div>
    </section>
  );
}
