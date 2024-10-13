import * as yup from 'yup';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '../../../tables/data-table';
import { ENDPOINTS } from '../../../constants/endpoints';

import columns from '../../../tables/columns';
import DataTableSkeletonLoading from '../../../components/ui-comp/loader/skeleton-loader/data-table';
import { deleteRequest, putRequest } from '../../../api';
import { Card } from '../../../components/ui-comp/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui-comp/avatar';
import { getInitials } from '../../../lib/utils';
import { Skeleton } from '../../../components/ui-comp/skeleton';

// eslint-disable-next-line
function GetProfilePicture({ imageUrl, fullName }) {
  const token = useSelector(state => state.auth?.token);

  const {
    data: getImageData,
    isLoading: getImageDataIsLoading,
    isRefetching: getImageDataIsRefetching,
  } = useQuery({
    queryKey: ['get-check-user-profile-image', [imageUrl]],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.USERS}${ENDPOINTS.USERS.PROFILE_PIC}/${imageUrl}`, {
        method: 'GET',
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.title || 'Something went wrong');
        error.status = response.status;
        error.info = errorData;
      }

      return response.json();
    },
    enabled: typeof imageUrl === 'string',
    gcTime: 0,
    staleTime: Infinity,
  });

  return (
    <>
      {getImageDataIsLoading || getImageDataIsRefetching ? (
        <Skeleton className={'w-10 h-10'} />
      ) : (
        <Avatar>
          <AvatarImage src={getImageData} alt={fullName} />
          <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
        </Avatar>
      )}
    </>
  );
}

// eslint-disable-next-line react/prop-types
export default function SupplierCheckIn({ title, privateAxios, queryId }) {
  const tableState = useSelector(state => state.table);
  const userSupplierId = useSelector(state => state.auth?.user?.supplierId);
  const token = useSelector(state => state.auth?.token);

  const dispatch = useDispatch();

  const updateCheckInKey = ['update-checkIns'];
  const deleteCheckInKey = ['delete-checkIns'];

  const {
    data: getCheckInData,
    isLoading: getCheckInIsLoading,
    isRefetching: getCheckInIsRefetching,
    isError: getCheckInIsError,
    error: getCheckInError,
    refetch: getCheckInRefetch,
  } = useQuery({
    queryKey: ['get-checkIn-user-data'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.CHECK_IN.GET_CHECK_IN_USERS}/${userSupplierId}`, {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.title || 'Something went wrong');
        error.status = response.status;
        error.info = errorData;
      }

      return response.json();
    },
    gcTime: 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (getCheckInIsError) {
      toast.error(getCheckInError.message || 'Something went wrong');
    }
  }, [getCheckInIsError, getCheckInError]);

  const fieldMetaData = [
    {
      accessorKey: 'profilePic',
      header: 'Profile',
      title: 'Profile',
      cell: ({ row }) => (
        <GetProfilePicture
          fullName={`${row.original.user.firstName} ${row.original.user.lastName}`}
          imageUrl={row.original.user.profilePic}
        />
      ),
      editField: false,
    },
    {
      accessorKey: 'firstName',
      header: '',
      title: '',
      editField: false,
    },
    {
      accessorKey: 'fullName',
      cell: ({ row }) => {
        const user = row.original.user;

        return <p>{`${user?.firstName} ${user?.lastName}`}</p>;
      },
      header: 'Full Name',
      title: 'Full Name',
      editField: true,
      yupValidation: yup.string().required('Full Name is required'),
    },
    {
      accessorKey: 'email',
      cell: ({ row }) => {
        const user = row.original.user;
        return <p>{`${user?.email}`}</p>;
      },
      header: 'Email',
      editField: true,
      title: 'Email',
      yupValidation: yup.string().email().required('Email is required'),
    },
    {
      accessorKey: 'mobile',
      cell: ({ row }) => {
        const user = row.original.user;
        return <p>{`${user?.mobile}`}</p>;
      },
      header: 'Mobile Number',
      editField: true,
      title: 'Mobile Number',
      yupValidation: yup.string().email().required('Mobile Number is required'),
    },
  ];

  const memoizedColumns = React.useMemo(
    () =>
      columns({
        dispatch,
        fieldMetaData,
        clipboardAccessorKey: 'Copy UserId',
        clipboardTitle: 'UserId',
        tableState,
        customAxios: privateAxios,
        updateMutationFn: putRequest,
        updateMutationKey: updateCheckInKey,
        refetchId: queryId,
        updateUrl: ENDPOINTS.STATE.STATE,
        mainAccessorId: 'stateId',
        refetchTable: getCheckInRefetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteCheckInKey,
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
      {getCheckInIsLoading || getCheckInIsRefetching ? (
        <DataTableSkeletonLoading />
      ) : (
        <div>
          <h3 className='text-lg font-bold'>Check Ins</h3>
          <DataTable
            filterAccessorKey={['firstName', 'email', 'mobile']}
            filterPlaceholder={['Filter by full name', 'Filter by email', 'Filter by mobile']}
            title={title}
            data={getCheckInData?.$values || []}
            columns={memoizedColumns}
          />
        </div>
      )}
    </Card>
  );
}
