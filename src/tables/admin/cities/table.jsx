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
export default function CitiesTable({ title, privateAxios, queryId }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updateCityKey = ['update-city'];
  const deleteCityKey = ['delete-city'];

  const {
    data: getCitiesData,
    isLoading: getCitiesIsLoading,
    isError: getCitiesIsError,
    error: getCitiesError,
    refetch: getCitiesRefetch,
  } = useQuery({
    queryKey: ['get-city-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.CITY.CITY }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCitiesIsError) {
      toast.error(getCitiesError.message || 'Something went wrong');
    }
  }, [getCitiesIsError, getCitiesError]);

  const fieldMetaData = [
    {
      accessorKey: 'cityId',
      header: 'ID',
      title: 'ID',
      cell: ({ row }) => <p>{row.getValue('cityId')}</p>,
      editField: false,
    },
    {
      accessorKey: 'cityName',
      cell: ({ row }) => <p>{row.getValue('cityName')}</p>,
      header: 'City Name',
      title: 'City Name',
      editField: true,
      yupValidation: yup.string().required('City Name is required'),
    },
    {
      accessorKey: 'stateId',
      header: 'STATE ID',
      editField: true,
      title: 'State ID',
      yupValidation: yup.string().required('STATE ID is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'cityName',
        clipboardTitle: 'Copy City Name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateCityKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.CITY.CITY,
        mainAccessorId: 'cityId',
        refetchTable: getCitiesRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteCityKey,
        deleteUrl: ENDPOINTS.CITY.CITY,
        additionalPayloadKeys: ['cityId'],
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
      {getCitiesIsLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='cityName'
          filterPlaceholder='Filter city name...'
          title={title}
          data={getCitiesData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
