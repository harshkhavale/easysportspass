import * as yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { LogIn } from 'lucide-react';

import { DataTable } from '../../data-table';
import { ENDPOINTS } from '../../../constants/endpoints';

import { Card } from '../../../components/ui-comp/card';

import columns from '../../columns';
import DataTableSkeletonLoading from '../../../components/ui-comp/loader/skeleton-loader/data-table';
import { deleteRequest, getRequest, putMultipartRequest } from '../../../api';
import Status from '../../../components/ui-comp/status';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui-comp/dialog';
import { Button } from '../../../components/ui-comp/button/button';
import { Label } from '../../../components/ui-comp/label';
import { Input } from '../../../components/ui-comp/input';
import Spinner from '../../../components/ui-comp/loader/spinner';
import { tableActions } from '../../../store/slices/table-slice';

// eslint-disable-next-line react/prop-types
export default function ManageUsersTable({ title, privateAxios, queryId }) {
  const dispatch = useDispatch();
  const tableState = useSelector(state => state.table);
  const [userCategoryOptions, setUserCategoryOptions] = useState([]);
  const [resetForm, setResetForm] = useState(false);

  const categoryDialogRef = useRef(null);
  const dialogCloseButtonRef = useRef(null);

  const categoryId = tableState.inputValues?.['userCategoryId'];
  const updateUserKey = ['update-user'];
  const deleteUserKey = ['delete-user'];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryId,
    queryFn: async () => await getRequest({ customAxios: privateAxios, url: ENDPOINTS.USERS.USERS }),
    staleTime: 0,
  });

  const {
    isPending: manageUserIsPending,
    isError: manageUserIsError,
    error: manageUserError,
    mutate: manageUserMutate,
    reset: manageUserReset,
  } = useMutation({
    mutationKey: ['manage-user-category-detail'],
    mutationFn: putMultipartRequest,
    onSuccess: data => {
      toast.success(data.message || 'User Category Successfully');
      dialogCloseButtonRef.current?.click();
      refetch();
      manageUserReset();
      setResetForm(true);
      dispatch(tableActions.reset());
    },
  });

  const formik = useFormik({
    initialValues: {
      corporateId: '',
      supplierId: '',
    },
    onSubmit(values) {
      let payload = { supplierId: parseInt(values.supplierId), ModifiedDateTime: new Date().toISOString(), ModifiedBy: 'Admin' };

      if (categoryId?.value === '3') {
        payload.supplierId = parseInt(values.supplierId);
        payload.userCategoryId = parseInt(categoryId?.value);
        payload.userId = tableState.inputValues?.['userId']?.value;
      } else if (categoryId?.value === '2') {
        payload.corporateId = parseInt(values.corporateId);
        payload.userCategoryId = parseInt(categoryId?.value);
        payload.userId = tableState.inputValues?.['userId']?.value;
      }

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      manageUserMutate({
        formData,
        customAxios: privateAxios,
        url: `${ENDPOINTS.USERS.USERS}/${tableState.inputValues?.['userId']?.value}`,
      });
    },
  });

  useEffect(() => {
    if (resetForm) {
      formik.resetForm();
    }

    // eslint-disable-next-line
  }, [resetForm]);

  useEffect(() => {
    if (manageUserIsError) {
      toast.error(manageUserError.message || 'Something went wrong');
    }
  }, [manageUserIsError, manageUserError]);

  useEffect(() => {
    if (categoryId) {
      if (categoryId?.value === '3') {
        categoryDialogRef.current?.click();
      } else if (categoryId?.value === '2') {
        categoryDialogRef.current?.click();
      }
    }
  }, [tableState.inputValues, categoryId]);

  const {
    data: userCategoryData,
    isLoading: userCategoryIsLoading,
    isRefetching: userCategoryIsRefetching,
    isError: userCategoryIsError,
    error: userCategoryError,
  } = useQuery({
    queryKey: ['get-user-category'],
    queryFn: () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.USERS.CATEGORY }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (userCategoryIsError) {
      toast.error(userCategoryError.message || 'Unable to get user categories');
    }
  }, [userCategoryIsError, userCategoryError]);

  useEffect(() => {
    if (!userCategoryIsLoading || !userCategoryIsRefetching) {
      if (userCategoryData?.$values && Array.isArray(userCategoryData.$values) && userCategoryData.$values.length > 0) {
        const userCategoryOptions = userCategoryData.$values.map(value => ({
          label: value.categoryName,
          value: value.categoryId,
        }));

        setUserCategoryOptions(userCategoryOptions);
      }
    }
  }, [userCategoryData, userCategoryIsLoading, userCategoryIsRefetching]);

  const fieldMetaData = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      title: 'First Name',
      cell: ({ row }) => <p>{row.getValue('firstName')}</p>,
      yupValidation: yup.string().required('First Name is required'),
      editField: true,
      addField: true,
    },
    {
      accessorKey: 'userId',
      header: '',
      title: 'userId',
      cell: () => null,
      editField: true,
      addField: false,
      notShowInput: true,
    },
    {
      accessorKey: 'userType',
      header: '',
      title: 'userType',
      cell: () => null,
      editField: false,
      addField: false,
    },
    {
      accessorKey: 'lastName',
      cell: ({ row }) => <p>{row.getValue('lastName')}</p>,
      header: 'Last Name',
      title: 'Last Name',
      editField: true,
      yupValidation: yup.string().required('Last Name is required'),
      addField: true,
    },
    {
      accessorKey: 'email',
      header: 'Email ID',
      editField: true,
      title: 'Email ID',
      yupValidation: yup.string().email().required('Email ID is required'),
      addField: true,
    },
    {
      accessorKey: 'userCategoryId',
      header: () => <p className='flex justify-center items-center'>Category</p>,
      title: 'Category',
      yupValidation: yup.string().required('Category is required'),
      addField: true,
      editField: true,
      cell: ({ row }) => {
        const userType = row.original.userType || '';

        if (userType.toLowerCase() === 'normal') {
          return (
            <>
              <div className='flex justify-center items-center'>
                <Status type='slate' text={userType} />
              </div>
            </>
          );
        }
        if (userType.toLowerCase() === 'corporate') {
          return (
            <>
              <div className='flex justify-center items-center'>
                <Status type='green' text={userType} />
              </div>
            </>
          );
        }
        if (userType.toLowerCase() === 'supplier') {
          return (
            <>
              <div className='flex justify-center items-center'>
                <Status type='blue' text={userType} />
              </div>
            </>
          );
        }
        if (userType.toLowerCase() === 'administrator') {
          return (
            <>
              <div className='flex justify-center items-center'>
                <Status type='red' text={userType} />
              </div>
            </>
          );
        }
        return (
          <>
            <div className='flex justify-center items-center'>
              <Status type='slate' text={userType} />
            </div>
          </>
        );
      },
      inputType: 'dropdown',
      value: '',
      options: userCategoryOptions,
      isLoading: userCategoryIsLoading,
      typeOf: 'string',
    },
    {
      accessorKey: 'mobile',
      title: 'Mobile Number',
      header: () => <p className='text-center'>Mobile Number</p>,
      cell: ({ row }) => {
        const rowData = row.getValue('mobile');
        const inValidRowData = typeof rowData === 'undefined' || rowData === null;

        return <p className='text-center'>{inValidRowData ? '---' : rowData}</p>;
      },
      yupValidation: yup
        .string()
        .matches(/^[6-9]\d{9}$/, 'Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain exactly 10 digits')
        .required('Mobile number is required'),
      editField: true,
      addField: true,
    },
    {
      accessorKey: 'planName',
      header: () => <p className='text-center'>Plan</p>,
      cell: ({ row }) => {
        const rowData = row.getValue('planName');
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
        updateMutationFn: putMultipartRequest,
        updateMutationKey: updateUserKey,
        refetchId: queryId,
        mainAccessorId: 'userId',
        refetchTable: refetch,
        deleteMutationFn: deleteRequest,
        deleteMutationKey: deleteUserKey,
        deleteUrl: ENDPOINTS.USERS.USERS,
        updateUrl: ENDPOINTS.USERS.USERS,
        applicationType: 'multi-part',
        additionStaticPayload: {
          ModifiedDateTime: new Date().toISOString(),
          ModifiedBy: 'Admin',
        },
        additionActionOptions: [
          {
            onClick: () => {},
            iconClassName: '',
            icon: LogIn,
            value: 'Login',
          },
        ],
      }),
    // eslint-disable-next-line
    [tableState.edit, tableState.currentRowIndex]
  );

  return (
    <Card className='p-4 sm:p-8'>
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={categoryDialogRef} variant='outline' className={'hidden'}>
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Category ID</DialogTitle>
            <DialogDescription>{`Make changes to your category ID here. Click save when you're done.`}</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor='name' className='text-right'>
              {categoryId?.value === '3' ? 'Supplier ID' : categoryId?.value === '2' ? 'Corporate ID' : ''}
            </Label>
            {categoryId?.value === '3' && (
              <Input
                id='supplierId'
                name='supplierId'
                inputType='input'
                type='text'
                className='col-span-3'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.supplierId}
              />
            )}
            {categoryId?.value === '2' && (
              <Input
                id='corporateId'
                name='corporateId'
                inputType='input'
                type='text'
                className='col-span-3'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.corporateId}
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose ref={dialogCloseButtonRef} />
            <Button type='button' className={'flex gap-2 items-center'} onClick={formik.submitForm}>
              {manageUserIsPending ? <Spinner /> : ''}
              <span>Save changes</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <DataTableSkeletonLoading />
      ) : (
        <DataTable
          filterAccessorKey={['userType', 'planName']}
          filterPlaceholder={['Filter by category...', 'Filter by plan name...']}
          title={title}
          data={data?.$values || []}
          columns={memoizedColumns}
        />
      )}
    </Card>
  );
}
