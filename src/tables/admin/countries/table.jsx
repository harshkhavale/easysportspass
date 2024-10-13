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
import { createPrivateApi, deleteRequest, getRequest, putRequest } from '../../../api';

// eslint-disable-next-line react/prop-types
export default function CountryTable({ title, privateAxios, queryId }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);

  const updateCountryKey = ['update-country'];
  const deleteCountryKey = ['delete-country'];

  const {
    data: getCountriesData,
    isLoading: getCountriesIsLoading,
    isError: getCountriesIsError,
    error: getCountriesError,
    refetch: getCountriesRefetch,
  } = useQuery({
    queryKey: ['get-countries-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.COUNTRY.COUNTRY }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCountriesIsError) {
      toast.error(getCountriesError.message || 'Something went wrong');
    }
  }, [getCountriesIsError, getCountriesError]);

  const fieldMetaData = [
    {
      accessorKey: '$id',
      header: 'ID',
      title: 'ID',
      cell: ({ row }) => <p>{row.getValue('$id')}</p>,
      editField: false,
    },
    {
      accessorKey: 'countryName',
      cell: ({ row }) => <p>{row.getValue('countryName')}</p>,
      header: 'Country Name',
      title: 'Country Name',
      editField: true,
      yupValidation: yup.string().required('Country Name is required'),
    },
    {
      accessorKey: 'isocode',
      header: 'ISO code',
      editField: true,
      title: 'ISO code',
      yupValidation: yup.string().required('ISO code is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'countryName',
        clipboardTitle: 'Copy Country Name',
        tableState,
        customAxios: privateApi,
        updateMutationFn: putRequest,
        updateMutationKey: updateCountryKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.COUNTRY.COUNTRY,
        mainAccessorId: 'countryId',
        refetchTable: getCountriesRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteCountryKey,
        deleteUrl: ENDPOINTS.COUNTRY.COUNTRY,
        additionalPayloadKeys: ['countryId'],
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
      {getCountriesIsLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='countryName'
          filterPlaceholder='Filter country name...'
          title={title}
          data={getCountriesData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
