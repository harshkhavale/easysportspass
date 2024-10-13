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
export default function ActivitiesTable({ title, privateAxios, queryId, ModifiedBy }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updateActivityKey = ['update-activity'];
  const deleteActivityKey = ['delete-activity'];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryId,
    queryFn: async () => await getRequest({ customAxios: privateAxios, url: ENDPOINTS.ACTIVITIES.ACTIVITIES }),
    staleTime: Infinity,
  });

  const fieldMetaData = [
    {
      accessorKey: 'activityId',
      cell: ({ row }) => <p>{row.getValue('activityId')}</p>,
      header: 'ID',
      title: 'ID',
      yupValidation: yup.string().required('Activity Name is required'),
      editField: false,
      addField: false,
    },
    {
      accessorKey: 'activityName',
      cell: ({ row }) => <p>{row.getValue('activityName')}</p>,
      header: 'Activity Name',
      title: 'Activity Name',
      yupValidation: yup.string().required('Activity Name is required'),
      editField: true,
      addField: true,
    },
    {
      accessorKey: 'activityDescription',
      cell: ({ row }) => <p>{row.getValue('activityDescription')}</p>,
      header: 'Activity Description',
      title: 'Activity Description',
      editField: true,
      yupValidation: yup.string().email().required('Activity Description is required'),
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
        clipboardAccessorKey: 'activityName',
        clipboardTitle: 'Copy Activity Name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateActivityKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.ACTIVITIES.ACTIVITIES,
        mainAccessorId: 'activityId',
        refetchTable: refetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteActivityKey,
        deleteUrl: ENDPOINTS.ACTIVITIES.ACTIVITIES,
        additionalPayloadKeys: ['activityId'],
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
          filterAccessorKey='activityName'
          filterPlaceholder='Filter by activity name...'
          title={title}
          data={data?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
