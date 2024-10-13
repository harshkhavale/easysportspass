import * as yup from 'yup';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../../components/ui-comp/card';
import { DataTable } from '../../data-table';
import { ENDPOINTS } from '../../../constants/endpoints';
import DataTableSkeletonLoading from '../../../components/ui-comp/loader/skeleton-loader/data-table';
import toast from 'react-hot-toast';
import { getMembershipPlanHandler } from '../../../https/get';
import { Button } from '../../../components/ui-comp/button/button';
import { ArrowUpDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createPrivateApi } from '../../../api';
import { updateMemberPlanHandler } from '../../../https/put';
import { deleteMemberPlanHandler } from '../../../https/delete';
import columns from '../../columns';

// eslint-disable-next-line react/prop-types
export default function MembershipPlanTable({ title, privateUrl, queryId }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const updateMemberPlanKey = ['update-membership-plan'];
  const deleteMemberPlanKey = ['delete-membership-plan'];

  const {
    data: membershipPlanData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryId,
    queryFn: async () => getMembershipPlanHandler({ privateUrl, url: ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS }),
    staleTime: Infinity,
  });

  const fieldMetaData = [
    { accessorKey: '$id', header: 'ID', editField: false },
    {
      accessorKey: 'planName',
      header: 'Plan Name',
      editField: true,
      title: 'Plan Name',
      yupValidation: yup.string().required('Plan name is required'),
    },
    {
      accessorKey: 'description',
      title: 'Description',
      header: 'Description',
      yupValidation: yup.string().required('Description is required'),
      editField: true,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button className={'p-0 rounded-none'} variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Price
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      title: 'Price',
      editField: true,
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
        clipboardAccessorKey: 'planName',
        clipboardTitle: 'Copy Plan name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: updateMemberPlanHandler,
        updateMutationKey: updateMemberPlanKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS,
        mainAccessorId: 'planId',
        refetchTable: refetch,
        deleteMutationFn: deleteMemberPlanHandler,
        deleteMutationKey: deleteMemberPlanKey,
        deleteUrl: ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS,
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
      {isLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='planName'
          filterPlaceholder='Filter Plan Name...'
          title={title}
          data={membershipPlanData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
