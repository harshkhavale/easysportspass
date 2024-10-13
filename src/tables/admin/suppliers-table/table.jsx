import * as yup from 'yup';
import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { deleteRequest, getRequest, putRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';

import DataTableSkeletonLoading from '../../../components/ui-comp/loader/skeleton-loader/data-table';
import columns from '../../columns';
import { DataTable } from '../../data-table';
import { Card } from '../../../components/ui-comp/card';

// eslint-disable-next-line react/prop-types
export default function SuppliersTable({ title, privateAxios, queryId, ModifiedBy }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updateSupplierKey = ['update-supplier'];
  const deleteSupplierKey = ['delete-supplier'];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryId,
    queryFn: async () => await getRequest({ customAxios: privateAxios, url: ENDPOINTS.SUPPLIER.SUPPLIER }),
    staleTime: Infinity,
  });

  const fieldMetaData = [
    {
      accessorKey: 'supplierId',
      cell: ({ row }) => <p>{row.getValue('supplierId')}</p>,
      header: 'ID',
      title: 'ID',
      yupValidation: yup.string().required('Supplier Name is required'),
      editField: false,
      addField: false,
    },
    {
      accessorKey: 'supplierName',
      cell: ({ row }) => <p>{row.getValue('supplierName')}</p>,
      header: 'Supplier Name',
      title: 'Supplier Name',
      yupValidation: yup.string().required('Supplier Name is required'),
      editField: true,
      addField: true,
    },
    {
      accessorKey: 'email',
      cell: ({ row }) => <p>{row.getValue('email')}</p>,
      header: 'Email ID',
      title: 'Email ID',
      editField: true,
      yupValidation: yup.string().email().required('Email ID is required'),
      addField: true,
    },
    {
      accessorKey: 'contact',
      header: 'Contact Number',
      title: 'Contact Number',
      editField: true,
      yupValidation: yup.string().required('Contact Number ID is required'),
      addField: true,
    },
    {
      accessorKey: 'postalcode',
      title: 'Postal Code',
      header: () => <p className='text-center'>Postal Code</p>,
      cell: ({ row }) => {
        const rowData = row.getValue('postalcode');
        const inValidRowData = typeof rowData === 'undefined' || rowData === null;

        return <p className='text-center'>{inValidRowData ? '---' : rowData}</p>;
      },
      yupValidation: yup.string().required('Mobile Number is required'),
      editField: true,
      addField: true,
    },
    {
      accessorKey: 'maxMemberPrice',
      header: () => <p className='text-center'>Max Member Price</p>,
      cell: ({ row }) => {
        const rowData = row.getValue('maxMemberPrice');
        const inValidRowData = typeof rowData === 'undefined' || rowData === null;

        return <p className='text-center'>{inValidRowData ? '---' : rowData}</p>;
      },
      editField: false,
      addField: false,
    },
    {
      id: 'userId',
      editField: false,
      addField: true,
    },
  ];

  useEffect(() => {
    if (isError) {
      toast.error(error.message || 'Something went wrong');
    }
  }, [isError, error]);

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'email',
        clipboardTitle: 'Copy Email ID',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateSupplierKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.SUPPLIER.SUPPLIER,
        mainAccessorId: 'supplierId',
        refetchTable: refetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteSupplierKey,
        deleteUrl: ENDPOINTS.SUPPLIER.SUPPLIER,
        additionalPayloadKeys: ['supplierId'],
        additionStaticPayload: {
          ModifiedDateTime: new Date().toISOString(),
          ModifiedBy: ModifiedBy,
        },
      }),
    // eslint-disable-next-line
    [tableState.edit, tableState.currentRowIndex]
  );

  return (
    <Card className='p-4 sm:p-8'>
      {isLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='email'
          filterPlaceholder='Filter Email ID...'
          title={title}
          data={data?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
