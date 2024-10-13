import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRowIndex: undefined,
  edit: false,
  inputValues: undefined,
  initialValues: undefined,
  inputErrors: {},
  isValid: true,
  isDirty: false,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    storeData: (state, action) => {
      state.inputValues = action.payload.value;
      state.initialValues = action.payload.value;
    },
    manageInputValues: (state, action) => {
      switch (action.payload.type) {
        case 'update-change-value': {
          let updatedInputValue = state.inputValues;

          if (action.payload.typeOf) {
            updatedInputValue = {
              ...state.inputValues,
              [action.payload.name]: {
                ...state.inputValues[action.payload.name],
                value: action.payload.value,
                typeOf: action.payload.typeOf,
              },
            };
          } else {
            updatedInputValue = {
              ...state.inputValues,
              [action.payload.name]: {
                ...state.inputValues[action.payload.name],
                value: action.payload.value,
              },
            };
          }

          const isDirty = Object.keys(updatedInputValue).some(key => updatedInputValue[key].value !== state.initialValues[key]?.value);

          return {
            ...state,
            inputValues: updatedInputValue,
            isDirty,
          };
        }

        case 'update-blur-value': {
          let updatedInputValue = state.inputValues;

          if (action.payload.typeOf) {
            updatedInputValue = {
              ...state.inputValues,
              [action.payload.name]: {
                ...state.inputValues[action.payload.name],
                value: action.payload.value,
                typeOf: action.payload.typeOf,
                touched: action.payload.touched,
              },
            };
          } else {
            updatedInputValue = {
              ...state.inputValues,
              [action.payload.name]: {
                ...state.inputValues[action.payload.name],
                value: action.payload.value,
                touched: action.payload.touched,
              },
            };
          }

          const isDirty = Object.keys(updatedInputValue).some(key => updatedInputValue[key].value !== state.initialValues[key]?.value);

          return {
            ...state,
            inputValues: updatedInputValue,
            isDirty,
          };
        }
        case 'edit-mode': {
          const selectedRowData = action.payload.rowData;

          const inputValues = action.payload.fieldMetaData.reduce((acc, input) => {
            if (input.editField) {
              const foundValue = Object.keys(selectedRowData).find(value => value === input.accessorKey);
              acc[input.accessorKey] = {
                value: foundValue ? selectedRowData[foundValue] : '',
                touched: false,
              };
            }
            return acc;
          }, {});

          return {
            ...state,
            edit: true,
            inputValues,
            initialValues: inputValues,
            currentRowIndex: action.payload.index,
            isDirty: false,
          };
        }
        case 'view-mode': {
          return {
            ...state,
            edit: action.payload,
            currentRowIndex: undefined,
          };
        }
        default:
          return state;
      }
    },
    manageInputErrors: (state, action) => {
      switch (action.payload.type) {
        case 'set-validation-error': {
          const updatedErrors = {
            ...state.inputErrors,
            [action.payload.name]: action.payload.value,
          };

          return {
            ...state,
            inputErrors: updatedErrors,
            isValid: action.payload.isValid,
          };
        }
        default:
          return state;
      }
    },
    reset() {
      return initialState;
    },
  },
});

export const tableActions = tableSlice.actions;
const tableReducer = tableSlice.reducer;

export default tableReducer;
