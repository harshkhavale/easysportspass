import * as yup from 'yup';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

import { classNames, getInitials } from '../../lib/utils';
import { Card, CardContent, CardHeader } from './card';
import { Button } from './button/button';
import { Input } from './input';

import ProfilePicture from './upload-profile';
import Spinner from './loader/spinner';
import useImageToBase64 from '../../hooks/user-image-to-base64';

export function FormikForm({ inputs, formTitle, formDescription, onSubmit, isPending, submitButtonText }) {
  const [schemas, setSchemas] = React.useState(yup.object().shape({}));
  const [initialValues, setInitialValues] = React.useState({});

  const formik = useFormik({
    initialValues,
    validationSchema: schemas,
    onSubmit(values) {
      onSubmit(values, formik);
    },
  });

  React.useEffect(() => {
    // Prepare initial values as an object
    const newInitialValues = inputs.reduce((acc, input) => {
      acc[input.name] = input.value || '';
      return acc;
    }, {});

    // Create yup validation schema
    const yupValidations = inputs
      .filter(input => input.yupValidation !== undefined)
      .reduce((acc, input) => {
        acc[input.name] = input.yupValidation;
        return acc;
      }, {});

    const newSchema = yup.object().shape(yupValidations);

    // Update form state and reset the form
    setSchemas(newSchema);
    setInitialValues(newInitialValues);
    formik.resetForm({
      values: newInitialValues,
      validationSchema: newSchema,
    });

    // eslint-disable-next-line
  }, [inputs]);

  function onBlurHandler(e, input) {
    if (input.onBlur) {
      input.onBlur(e, formik);
    } else {
      formik.handleBlur(e);
    }
  }

  function onChangeHandler(e, input) {
    if (input.onChange) {
      input.onChange(e, formik);
    } else {
      formik.handleChange(e);
    }
  }

  function onValueChange(value, input) {
    formik.setFieldValue(input.name, value);
  }

  function resetFormHandler() {
    formik.resetForm();
  }

  function checkedOnClickHandler(input) {
    formik.setFieldValue(input.name, !formik.values[input.name]);
  }

  return (
    <>
      <div className={classNames(!formTitle && !formDescription ? 'md:grid-cols-1' : '', 'grid grid-cols-1 gap-x-8 md:grid-cols-3 w-full')}>
        <div className='px-4 sm:px-0'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>{formTitle}</h2>
          {formDescription && <p className='pt-1 text-sm leading-6 text-gray-600'>{formDescription}</p>}
        </div>

        <form onSubmit={formik.handleSubmit} className='sm:rounded-xl md:col-span-2'>
          <Card>
            <div className='px-4 py-6 sm:p-8'>
              <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                {inputs.map((input, index) => (
                  <React.Fragment key={index}>
                    <Input
                      label={input.label}
                      type={input.type || 'text'}
                      inputType={input.inputType || 'input'}
                      name={input.name}
                      placeholder={input.placeholder}
                      onClick={input.onClick}
                      onBlur={e => onBlurHandler(e, input)}
                      onChange={e => onChangeHandler(e, input)}
                      id={input.id}
                      labelClassName={input.labelClassName}
                      errorClassName={input.errorClassName}
                      inputClassName={input.inputClassName}
                      className={input.className}
                      isError={formik.errors[input.name] && formik.touched[input.name]}
                      errorMessage={formik.errors[input.name]}
                      required={input.required || false}
                      fullWidth={input.fullWidth}
                      value={formik.values[input.name]}
                      onValueChange={value => onValueChange(value, input)}
                      isLoading={input.isLoading}
                      options={input.options}
                      checked={input.checked}
                      checkedOnClickHandler={() => checkedOnClickHandler(input)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className='flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8'>
              <Button type='button' variant={'outline'} onClick={resetFormHandler}>
                Cancel
              </Button>
              <Button type='submit' className={'flex items-center gap-2'} disabled={isPending || !formik.isValid}>
                {isPending ? <Spinner /> : ''}
                <span>{submitButtonText || 'Save'}</span>
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </>
  );
}

FormikForm.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      inputType: PropTypes.oneOf(['input', 'textarea', 'dropdown']),
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      id: PropTypes.string.isRequired,
      labelClassName: PropTypes.string.isRequired,
      inputClassName: PropTypes.string.isRequired,
      errorClassName: PropTypes.string.isRequired,
      className: PropTypes.string.isRequired,
      yupValidation: PropTypes.any,
      required: PropTypes.bool,
      fullWidth: PropTypes.bool,
    })
  ).isRequired,
  formTitle: PropTypes.string.isRequired,
  formDescription: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  submitButtonText: PropTypes.string,
};

export function ManageProfileForm({
  type,
  inputs,
  formTitle,
  formDescription,
  onSubmit,
  isPending,
  submitButtonText,
  imageUrl,
  imageLoadingState,
}) {
  const firstName = useSelector(state => state.auth.user.firstName);
  const lastName = useSelector(state => state.auth.user.lastName);
  const currentUserPlan = useSelector(state => state.auth.user.plan);

  const fullName = `${firstName} ${lastName}`;

  const [schemas, setSchemas] = React.useState(yup.object().shape({}));
  const [initialValues, setInitialValues] = React.useState({});

  const { base64Image, error, loading } = useImageToBase64(imageUrl || '');

  const formik = useFormik({
    initialValues,
    validationSchema: schemas,
    onSubmit(values) {
      onSubmit(values, formik);
    },
  });

  React.useEffect(() => {
    // Prepare initial values as an object
    const newInitialValues = inputs.reduce((acc, input) => {
      acc[input.name] = input.value || '';
      return acc;
    }, {});

    if (!loading) {
      if (error) {
        console.log('error:', error);
        return;
      }

      newInitialValues.imageUrl = base64Image || '';
    }

    // Create yup validation schema
    const yupValidations = inputs
      .filter(input => input.yupValidation !== undefined)
      .reduce((acc, input) => {
        acc[input.name] = input.yupValidation;
        return acc;
      }, {});

    const newSchema = yup.object().shape(yupValidations);

    // Update form state and reset the form
    setSchemas(newSchema);
    setInitialValues(newInitialValues);
    formik.resetForm({
      values: newInitialValues,
      validationSchema: newSchema,
    });

    // eslint-disable-next-line
  }, [inputs, base64Image, loading, error]);

  function onBlurHandler(e, input) {
    if (input.onBlur) {
      input.onBlur(e, formik);
    } else {
      formik.handleBlur(e);
    }
  }

  function onChangeHandler(e, input) {
    if (input.onChange) {
      input.onChange(e, formik);
    } else {
      formik.handleChange(e);
    }
  }

  function onValueChange(value, input) {
    formik.setFieldValue(input.name, value);
  }

  function resetFormHandler() {
    formik.resetForm();
  }

  function checkedOnClickHandler(input) {
    formik.setFieldValue(input.name, !formik.values[input.name]);
  }

  const handleUpdateProfileImage = useCallback(imageUrl => {
    formik.setFieldValue('imageUrl', imageUrl);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={classNames(!formTitle && !formDescription ? 'md:grid-cols-1' : '', 'grid grid-cols-1 gap-x-8 md:grid-cols-3 w-full')}>
        <div className='px-4 sm:px-0'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>{formTitle}</h2>
          {formDescription && <p className='pt-1 text-sm leading-6 text-gray-600'>{formDescription}</p>}

          {type === 'Normal' && currentUserPlan && (
            <div className='mt-5'>
              <Card>
                <CardHeader className={'text-primary text-2xl font-semibold'}>Active Plan</CardHeader>
                <CardContent className={'text-slate-600'}>
                  <div className='flex flex-col gap-10'>
                    <div>
                      <h3 className='font-semibold text-xl'>{currentUserPlan.planName}</h3>
                      <p>{currentUserPlan.description}</p>
                    </div>
                    <div>
                      <Link to={'/memberships'}>
                        <Button>Upgrade Plan</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <form onSubmit={formik.handleSubmit} className='sm:rounded-xl md:col-span-2'>
          <Card>
            <div className='px-4 py-6 sm:p-8'>
              <div className='flex flex-col gap-2'>
                <ProfilePicture
                  userName={getInitials(fullName)}
                  updateProfileImage={handleUpdateProfileImage}
                  imageUrl={formik.values.imageUrl}
                  imageLoadingState={imageLoadingState}
                />
              </div>

              <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10'>
                {inputs.map((input, index) => (
                  <React.Fragment key={index}>
                    <Input
                      label={input.label}
                      type={input.type || 'text'}
                      inputType={input.inputType || 'input'}
                      name={input.name}
                      placeholder={input.placeholder}
                      onClick={input.onClick}
                      onBlur={e => onBlurHandler(e, input)}
                      onChange={e => onChangeHandler(e, input)}
                      id={input.id}
                      labelClassName={input.labelClassName}
                      errorClassName={input.errorClassName}
                      inputClassName={input.inputClassName}
                      className={input.className}
                      isError={formik.errors[input.name] && formik.touched[input.name]}
                      errorMessage={formik.errors[input.name]}
                      required={input.required || false}
                      fullWidth={input.fullWidth}
                      value={formik.values[input.name]}
                      onValueChange={value => onValueChange(value, input)}
                      isLoading={input.isLoading}
                      options={input.options}
                      checked={input.checked}
                      checkedOnClickHandler={() => checkedOnClickHandler(input)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className='flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8'>
              <Button type='button' variant={'outline'} onClick={resetFormHandler}>
                Cancel
              </Button>
              <Button type='submit' className={'flex items-center gap-2'} disabled={isPending || !formik.isValid}>
                {isPending ? <Spinner /> : ''}
                <span>{submitButtonText || 'Save'}</span>
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </>
  );
}

ManageProfileForm.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      inputType: PropTypes.oneOf(['input', 'textarea', 'dropdown']),
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      id: PropTypes.string.isRequired,
      labelClassName: PropTypes.string.isRequired,
      inputClassName: PropTypes.string.isRequired,
      errorClassName: PropTypes.string.isRequired,
      className: PropTypes.string.isRequired,
      yupValidation: PropTypes.any,
      required: PropTypes.bool,
      fullWidth: PropTypes.bool,
    })
  ).isRequired,
  formTitle: PropTypes.string.isRequired,
  formDescription: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  submitButtonText: PropTypes.string,
  imageUrl: PropTypes.string,
  imageLoadingState: PropTypes.bool,
  type: PropTypes.string,
};
