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
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
export default function PlanAttributeTable({ membershipPlanDetails, title, privateAxios, queryId, options }) {
  const tableState = useSelector(state => state.table);
  const dispatch = useDispatch();

  const updatePlanAttributeKey = ['update-plan-attribute'];
  const deletePlanAttributeKey = ['delete-plan-attribute'];

  const {
    data: getPlanAttributeData,
    isLoading: getPlanAttributeIsLoading,
    isError: getPlanAttributeIsError,
    error: getPlanAttributeError,
    refetch: getPlanAttributeRefetch,
  } = useQuery({
    queryKey: ['get-plan-attribute-data'],
    queryFn: async () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.MEMBERSHIP.ATTRIBUTES }),
    gcTime: 0,
    staleTime: 5000,
  });

  useEffect(() => {
    if (getPlanAttributeIsError) {
      toast.error(getPlanAttributeError.message || 'Something went wrong');
    }
  }, [getPlanAttributeIsError, getPlanAttributeError]);

  const fieldMetaData = [
    {
      accessorKey: 'attributeId',
      header: 'ID',
      title: 'ID',
      cell: ({ row }) => <p>{row.getValue('attributeId')}</p>,
      editField: false,
    },
    {
      accessorKey: 'attributename',
      cell: ({ row }) => <p>{row.getValue('attributename')}</p>,
      header: 'Attribute Name',
      title: 'Attribute Name',
      editField: true,
      yupValidation: yup.string().required('Attribute Name is required'),
    },
    {
      inputType: 'dropdown',
      options: options,
      accessorKey: 'planId',
      header: 'Membership Plan',
      editField: true,
      title: 'Membership Plan',
      cell: ({ row }) => {
        const planId = row.getValue('planId');
        const findPlan = membershipPlanDetails.find(plan => plan.planId === planId);

        return <p>{findPlan?.planName || '---'}</p>;
      },
      yupValidation: yup.string().required('Membership Plan is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'attributename',
        clipboardTitle: 'Copy Attribute Name',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updatePlanAttributeKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.MEMBERSHIP.ATTRIBUTES,
        mainAccessorId: 'attributeId',
        refetchTable: getPlanAttributeRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deletePlanAttributeKey,
        deleteUrl: ENDPOINTS.MEMBERSHIP.ATTRIBUTES,
        additionalPayloadKeys: ['attributeId'],
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
      {getPlanAttributeIsLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey='attributeName'
          filterPlaceholder='Filter Attribute Name...'
          title={title}
          data={getPlanAttributeData?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}

PlanAttributeTable.propTypes = {
  membershipPlanDetails: PropTypes.any.isRequired,
};
