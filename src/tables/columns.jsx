import { Checkbox } from '../components/ui-comp/checkbox';
import Action from '../pages/admin/membership-plan/actions';
import TableInputCell from './table-input-cell';

export default function columns({
  clipboardTitle,
  clipboardAccessorKey,
  fieldMetaData,
  dispatch,
  tableState,
  customAxios,
  updateMutationFn,
  updateMutationKey,
  updateUrl,
  refetchId,
  mainAccessorId,
  refetchTable,
  deleteMutationFn,
  deleteMutationKey,
  deleteUrl,
  additionalPayloadKeys,
  additionStaticPayload,
  additionActionOptions,
  applicationType,
}) {
  const action = {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      if (row.index === tableState.currentRowIndex) {
        return (
          <Action
            applicationType={applicationType}
            additionActionOptions={additionActionOptions}
            additionalPayloadKeys={additionalPayloadKeys}
            clipboardAccessorKey={clipboardAccessorKey}
            clipboardTitle={clipboardTitle}
            row={row}
            dispatch={dispatch}
            edit={true}
            fieldMetaData={fieldMetaData}
            customAxios={customAxios}
            updateMutationFn={updateMutationFn}
            updateUrl={updateUrl}
            updateMutationKey={updateMutationKey}
            refetchId={refetchId}
            mainAccessorId={mainAccessorId}
            refetchTable={refetchTable}
            deleteMutationFn={deleteMutationFn}
            deleteMutationKey={deleteMutationKey}
            deleteUrl={deleteUrl}
            additionStaticPayload={additionStaticPayload}
          />
        );
      } else {
        return (
          <Action
            applicationType={applicationType}
            additionActionOptions={additionActionOptions}
            additionalPayloadKeys={additionalPayloadKeys}
            additionStaticPayload={additionStaticPayload}
            clipboardAccessorKey={clipboardAccessorKey}
            clipboardTitle={clipboardTitle}
            row={row}
            dispatch={dispatch}
            edit={false}
            fieldMetaData={fieldMetaData}
            customAxios={customAxios}
            updateMutationFn={updateMutationFn}
            updateUrl={updateUrl}
            updateMutationKey={updateMutationKey}
            refetchId={refetchId}
            mainAccessorId={mainAccessorId}
            refetchTable={refetchTable}
            deleteMutationFn={deleteMutationFn}
            deleteMutationKey={deleteMutationKey}
            deleteUrl={deleteUrl}
          />
        );
      }
    },
  };

  const checkBoxSection = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => {
      return <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />;
    },
    enableSorting: false,
    enableHiding: false,
  };

  const columnsData = fieldMetaData.map(item => {
    if (item.editField === true && tableState.edit === true) {
      const newCell = ({ row }) => {
        return item.notShowInput ? null : (
          <TableInputCell
            options={item.options || []}
            inputType={item.inputType || 'input'}
            item={item}
            row={row}
            dispatch={dispatch}
            fieldMetaData={fieldMetaData}
            isLoading={item.isLoading}
          />
        );
      };

      if (item.cell) {
        item.cell = newCell;
        return item;
      } else {
        return { ...item, cell: newCell };
      }
    } else {
      return { ...item };
    }
  });

  return [checkBoxSection, ...columnsData, action];
}
