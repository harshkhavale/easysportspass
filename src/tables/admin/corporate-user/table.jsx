import * as yup from 'yup';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { DataTable } from '../../data-table';
import { ENDPOINTS } from '../../../constants/endpoints';

import { Card } from '../../../components/ui-comp/card';

import columns from '../../columns';
import DataTableSkeletonLoading from '../../../components/ui-comp/loader/skeleton-loader/data-table';
import { deleteRequest, getRequest, putRequest } from '../../../api';

// eslint-disable-next-line react/prop-types
export default function CorporateUsers({ title, privateAxios, queryId }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updateCorporateUserKey = ['update-country'];
  const deleteCorporateUserKey = ['delete-country'];

  const {
    data: getCorporateUsersData,
    isLoading: getCorporateUserIsLoading,
    isError: getCorporateUsersIsError,
    error: getCorporateUsersError,
    refetch: getCorporateUsersRefetch,
  } = useQuery({
    queryKey: ['get-corporate-users'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.CORPORATE.CORPORATE }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCorporateUsersIsError) {
      toast.error(getCorporateUsersError.message || 'Something went wrong');
    }
  }, [getCorporateUsersIsError, getCorporateUsersError]);

  const fieldMetaData = [
    {
      accessorKey: 'corporateId',
      header: 'ID',
      title: 'ID',
      cell: ({ row }) => <p>{row.getValue('corporateId')}</p>,
      editField: false,
    },
    {
      accessorKey: 'corporateName',
      cell: ({ row }) => <p>{row.getValue('corporateName')}</p>,
      header: 'Corporate Name',
      title: 'Corporate Name',
      editField: true,
      yupValidation: yup.string().required('Corporate Name is required'),
    },
    {
      accessorKey: 'contactPersonName',
      header: 'Contact Person Name',
      editField: true,
      title: 'Contact Person Name',
      yupValidation: yup.string().required('Contact Person Name is required'),
    },
    {
      accessorKey: 'contactPersonMobileNo',
      header: 'Contact Person Mobile No',
      editField: true,
      title: 'Contact Person Mobile No',
      yupValidation: yup.string().required('Contact Person Mobile No is required'),
    },
    {
      accessorKey: 'contactPersonEmail',
      header: 'Contact Person Email',
      editField: true,
      title: 'Contact Person Email',
      yupValidation: yup.string().required('Contact Person Email is required'),
    },
    {
      accessorKey: 'emailIdentifier',
      header: 'Email Identifier',
      editField: true,
      title: 'Email Identifier',
      yupValidation: yup.string().required('Email Identifier is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'corporateName',
        clipboardTitle: 'Copy corporate name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateCorporateUserKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.CORPORATE.CORPORATE,
        mainAccessorId: 'corporateId',
        refetchTable: getCorporateUsersRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteCorporateUserKey,
        deleteUrl: ENDPOINTS.CORPORATE.CORPORATE,
        additionalPayloadKeys: ['corporateId'],
        additionStaticPayload: {
          ModifiedDateTime: new Date().toISOString(),
          ModifiedBy: 'Admin',
        },
      }),
    // eslint-disable-next-line
    [tableState.edit, tableState.currentRowIndex]
  );

  return (
    <Card className='p-4 sm:p-8'>
      {getCorporateUserIsLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='corporateName'
          filterPlaceholder='Filter corporate name...'
          title={title}
          data={getCorporateUsersData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
