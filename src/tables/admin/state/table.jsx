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
export default function StateTable({ title, privateAxios, queryId }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updateStateKey = ['update-state'];
  const deleteStateKey = ['delete-state'];

  const {
    data: getStatesData,
    isLoading: getStatesIsLoading,
    isError: getStatesIsError,
    error: getStatesError,
    refetch: getStateRefetch,
  } = useQuery({
    queryKey: ['get-states-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.STATE.STATE }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getStatesIsError) {
      toast.error(getStatesError.message || 'Something went wrong');
    }
  }, [getStatesIsError, getStatesError]);

  const fieldMetaData = [
    {
      accessorKey: 'stateId',
      header: 'ID',
      title: 'ID',
      cell: ({ row }) => <p>{row.getValue('stateId')}</p>,
      editField: false,
    },
    {
      accessorKey: 'stateName',
      cell: ({ row }) => <p>{row.getValue('stateName')}</p>,
      header: 'State Name',
      title: 'State Name',
      editField: true,
      yupValidation: yup.string().required('State Name is required'),
    },
    {
      accessorKey: 'countryId',
      header: 'Country ID',
      editField: true,
      title: 'countryId',
      yupValidation: yup.string().required('Country ID is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'stateName',
        clipboardTitle: 'Copy State Name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateStateKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.STATE.STATE,
        mainAccessorId: 'stateId',
        refetchTable: getStateRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteStateKey,
        deleteUrl: ENDPOINTS.STATE.STATE,
        additionalPayloadKeys: ['stateId'],
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
      {getStatesIsLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='countryName'
          filterPlaceholder='Filter country name...'
          title={title}
          data={getStatesData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
