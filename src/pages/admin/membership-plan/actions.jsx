import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Edit, MoreHorizontal, Trash2, X } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui-comp/dropdown-menu';
import { Button } from '../../../components/ui-comp/button/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../../../components/ui-comp/tooltip';

import { tableActions } from '../../../store/slices/table-slice';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../https';
import React from 'react';
import Spinner from '../../../components/ui-comp/loader/spinner';
import Swal from 'sweetalert2';
import { cn } from '../../../lib/utils';

// eslint-disable-next-line react/prop-types
export default function Action({
  clipboardAccessorKey,
  additionActionOptions,
  clipboardTitle,
  row,
  edit,
  fieldMetaData,
  updateMutationFn,
  updateMutationKey,
  refetchId,
  updateUrl,
  customAxios,
  mainAccessorId,
  refetchTable,
  deleteMutationFn,
  deleteMutationKey,
  deleteUrl,
  additionalPayloadKeys,
  additionStaticPayload,
  applicationType,
}) {
  const dispatch = useDispatch();
  const isDirty = useSelector(state => state.table.isDirty);
  const isValid = useSelector(state => state.table.isValid);
  const inputValues = useSelector(state => state.table.inputValues);

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        'bg-green-500 text-white shadow-sm hover:bg-green-500/90 px-4 py-2 rounded-md ml-4 text-center flex justify-center items-center',
      cancelButton:
        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-4 py-2 rounded-md text-center flex justify-center items-center',
    },
    buttonsStyling: false,
  });

  const {
    isPending: updateItemIsPending,
    isError: updateItemIsError,
    error: updateItemError,
    mutate: updateItemMutate,
    reset: updateItemReset,
  } = useMutation({
    mutationKey: updateMutationKey,
    mutationFn: updateMutationFn,
    onSuccess: data => {
      // toast.success(data.message || 'Item updated successfully.');
      updateItemReset();
      dispatch(tableActions.manageInputValues({ type: 'view-mode', payload: false }));

      queryClient.invalidateQueries({
        queryKey: refetchId,
        exact: true,
        type: 'all',
        fetchStatus: 'fetching',
        refetchType: 'all',
      });

      swalWithTailwindButtons.fire({
        title: 'Updated!',
        text: data.message || 'Item updated Successfully',
        icon: 'success',
      });
      refetchTable();
    },
  });

  const {
    isPending: deleteItemIsPending,
    isError: deleteItemIsError,
    error: deleteItemError,
    mutate: deleteItemMutate,
    reset: deleteItemReset,
  } = useMutation({
    mutationKey: deleteMutationKey,
    mutationFn: deleteMutationFn,
    onSuccess: data => {
      // toast.success(data.message || 'Item deleted successfully.');
      deleteItemReset();
      dispatch(tableActions.manageInputValues({ type: 'view-mode', payload: false }));

      queryClient.invalidateQueries({
        queryKey: refetchId,
        exact: true,
        type: 'all',
        fetchStatus: 'fetching',
        refetchType: 'all',
      });
      refetchTable();

      swalWithTailwindButtons.fire({
        title: 'Deleted!',
        text: data.message || 'Item deleted Successfully',
        icon: 'success',
      });

      refetchTable();
    },
  });

  React.useEffect(() => {
    if (updateItemIsError) toast.error(updateItemError?.message || 'Something went wrong');
  }, [updateItemIsError, updateItemError]);

  React.useEffect(() => {
    if (deleteItemIsError) toast.error(deleteItemError?.message || 'Something went wrong');
  }, [deleteItemIsError, deleteItemError]);

  const updateDataHandler = () => {
    const inputValueResult = Object.keys(inputValues).reduce((acc, key) => {
      if (inputValues[key]?.typeOf === 'number') {
        acc[key] = parseInt(inputValues[key].value);
      } else {
        acc[key] = inputValues[key].value;
      }
      return acc;
    }, {});

    let payload = {
      ...inputValueResult,
      ...additionStaticPayload,
    };

    if (additionalPayloadKeys) {
      const additionPayload = additionalPayloadKeys.reduce((acc, key) => {
        acc[key] = row.original[key];
        return acc;
      }, {});

      payload = {
        ...payload,
        ...additionPayload,
      };
    }

    const formData = new FormData();
    if (applicationType === 'multi-part') {
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    if (!isDirty || !isValid) {
      return;
    } else {
      swalWithTailwindButtons
        .fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Update',
          cancelButtonText: 'Cancel',
          reverseButtons: true,
        })
        .then(result => {
          if (result.isConfirmed) {
            if (applicationType === 'multi-part') {
              updateItemMutate({ customAxios, formData, url: `${updateUrl}/${row.original[mainAccessorId]}` });
            } else {
              updateItemMutate({ customAxios, payload, url: `${updateUrl}/${row.original[mainAccessorId]}` });
            }
          }
        });
    }
  };
  const deleteDataHandler = () => {
    swalWithTailwindButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then(result => {
        if (result.isConfirmed) {
          deleteItemMutate({ customAxios, url: `${deleteUrl}/${row.original[mainAccessorId]}` });
        }
      });
  };

  return (
    <>
      {!edit && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(clipboardAccessorKey)}>{clipboardTitle}</DropdownMenuItem>
              <DropdownMenuSeparator />
              {!edit ? (
                <DropdownMenuItem onClick={() => deleteDataHandler()}>
                  <span className='flex flex-row gap-1 items-center'>
                    {deleteItemIsPending ? <Spinner /> : <Trash2 className={'text-red-500 w-4 h-4'} />}
                    <span>Delete</span>
                  </span>
                </DropdownMenuItem>
              ) : (
                ''
              )}

              {!edit ? (
                <DropdownMenuItem
                  onClick={() =>
                    dispatch(
                      tableActions.manageInputValues({
                        type: 'edit-mode',
                        rowData: row.original,
                        index: row.index,
                        fieldMetaData: fieldMetaData,
                      })
                    )
                  }
                >
                  <span className='flex flex-row gap-1 items-center'>
                    <Edit className={'text-green-500 w-4 h-4'} />
                    <span>Update</span>
                  </span>
                </DropdownMenuItem>
              ) : (
                ''
              )}

              {Array.isArray(additionActionOptions) && additionActionOptions.length > 0
                ? additionActionOptions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                      <span className='flex flex-row gap-1 items-center'>
                        {action.icon && <action.icon className={cn('w-4 h-4', action.iconClassName)} />}
                        <span>{action.value}</span>
                      </span>
                    </DropdownMenuItem>
                  ))
                : ''}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {edit && (
        <div className='flex items-center gap-2'>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={updateDataHandler}>
                  <Button
                    className={'bg-green-500 hover:bg-green-500/80 text-white'}
                    size='icon'
                    type='button'
                    disabled={!isDirty || !isValid}
                  >
                    {updateItemIsPending ? <Spinner className={'w-5 h-5'} /> : <Check className='w-5 h-5 font-bold' />}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent align='end' side='top'>
                <p>Update</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'destructive'}
                  size='icon'
                  type='button'
                  onClick={() => {
                    dispatch(tableActions.manageInputValues({ type: 'view-mode', payload: false }));
                  }}
                >
                  <X className='w-5 h-5 font-bold' />
                </Button>
              </TooltipTrigger>
              <TooltipContent align='end' side='top'>
                <p>Cancel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
}

Action.propTypes = {
  row: PropTypes.any.isRequired,
  fieldMetaData: PropTypes.any.isRequired,
  updateMutationFn: PropTypes.any.isRequired,
  updateMutationKey: PropTypes.string.isRequired,
  refetchId: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  clipboardAccessorKey: PropTypes.string.isRequired,
  clipboardTitle: PropTypes.string.isRequired,
  updateUrl: PropTypes.string.isRequired,
  customAxios: PropTypes.any.isRequired,
  mainAccessorId: PropTypes.string.isRequired,
  refetchTable: PropTypes.func.isRequired,
  deleteMutationFn: PropTypes.func.isRequired,
  deleteMutationKey: PropTypes.func.isRequired,
  deleteUrl: PropTypes.string.isRequired,
  additionalPayloadKeys: PropTypes.array.isRequired,
  additionStaticPayload: PropTypes.object,
  additionActionOptions: PropTypes.array,
  applicationType: PropTypes.string,
};
