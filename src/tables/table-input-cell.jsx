import * as yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { tableActions } from '../store/slices/table-slice';
import { Input } from '../components/ui-comp/input';

export default function TableInputCell({ isLoading = false, item, row, fieldMetaData, inputType, options }) {
  const inputRef = React.useRef(null);
  const inputValues = useSelector(state => state.table.inputValues);
  const inputErrors = useSelector(state => state.table.inputErrors);
  const currentRowIndex = useSelector(state => state.table.currentRowIndex);
  const touched = inputValues[item.accessorKey]?.touched;
  const error = inputErrors[item.accessorKey];

  const dispatch = useDispatch();
  const value = inputValues[item.accessorKey]?.value;

  // Create yup validation schema
  const yupValidations = fieldMetaData
    .filter(input => input.yupValidation !== undefined)
    .reduce((acc, input) => {
      acc[input.accessorKey] = input.yupValidation;
      return acc;
    }, {});

  const schema = yup.object().shape(yupValidations);

  const inputChangeHandler = async e => {
    const { name: targetName, value: targetValue } = e.target;

    if (item.typeOf) {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-change-value',
          name: item.accessorKey,
          value: e.target.value,
          typeOf: item.typeOf,
        })
      );
    } else {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-change-value',
          name: item.accessorKey,
          value: e.target.value,
        })
      );
    }

    if (item.yupValidation) {
      try {
        await schema.validateAt(targetName, { [targetName]: targetValue });

        dispatch(
          tableActions.manageInputErrors({
            value: null,
            name: targetName,
            type: 'set-validation-error',
            isValid: true,
          })
        );
      } catch (validationError) {
        dispatch(
          tableActions.manageInputErrors({
            name: targetName,
            value: validationError.message,
            type: 'set-validation-error',
            isValid: false,
          })
        );
      }
    }
  };
  const inputBlurHandler = async e => {
    if (item.typeOf) {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-blur-value',
          name: item.accessorKey,
          value: e.target.value,
          touched: true,
          typeOf: item.typeOf,
        })
      );
    } else {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-blur-value',
          name: item.accessorKey,
          value: e.target.value,
          touched: true,
        })
      );
    }
  };

  async function onValueChange(value) {
    if (item.typeOf) {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-blur-value',
          name: item.accessorKey,
          value: value,
          touched: true,
          typeOf: item.typeOf,
        })
      );
    } else {
      dispatch(
        tableActions.manageInputValues({
          type: 'update-blur-value',
          name: item.accessorKey,
          value: value,
          touched: true,
        })
      );
    }

    if (item.yupValidation) {
      try {
        await schema.validateAt(item.accessorKey, { [item.accessorKey]: value });

        dispatch(
          tableActions.manageInputErrors({
            value: null,
            name: item.accessorKey,
            type: 'set-validation-error',
            isValid: true,
          })
        );
      } catch (validationError) {
        dispatch(
          tableActions.manageInputErrors({
            name: item.accessorKey,
            value: validationError.message,
            type: 'set-validation-error',
            isValid: false,
          })
        );
      }
    }
  }

  const rowData = row.getValue(item.accessorKey);
  const inValidRowData = typeof rowData === 'undefined' || rowData === null;

  return (
    <>
      {row.index === currentRowIndex ? (
        <Input
          ref={inputRef}
          type={'text'}
          inputType={inputType || 'input'}
          name={item.accessorKey}
          id={item.accessorKey}
          value={value}
          onChange={e => inputChangeHandler(e)}
          onBlur={inputBlurHandler}
          errorMessage={error}
          isError={error && touched}
          fullWidth={true}
          placeholder={`Update ${item.title}`}
          onValueChange={onValueChange}
          options={options || []}
          label={`Update ${item.title}`}
          showLabel={false}
          isLoading={isLoading}
        />
      ) : !inValidRowData ? (
        rowData
      ) : (
        '---'
      )}
    </>
  );
}

TableInputCell.propTypes = {
  row: PropTypes.any.isRequired,
  item: PropTypes.any.isRequired,
  formik: PropTypes.any.isRequired,
  state: PropTypes.any.isRequired,
  fieldMetaData: PropTypes.any.isRequired,
  inputType: PropTypes.string,
  options: PropTypes.array,
  isLoading: PropTypes.bool,
  value: PropTypes.string,
};
