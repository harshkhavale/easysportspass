import { forwardRef } from 'react';
import { classNames, cn } from '../../lib/utils';
import { Textarea } from './text-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';
import { Checkbox } from './checkbox';

/* eslint-disable react/prop-types */

export function Label(props) {
  return (
    <label className={cn('block text-sm font-medium leading-6 text-gray-900 mb-2', props.labelClassName)} htmlFor={props.id}>
      {props.label}
    </label>
  );
}

export const Input = forwardRef(
  (
    {
      inputType,
      errorMessage,
      isError,
      label = true,
      placeholder,
      type,
      name,
      onClick,
      onChange,
      onBlur,
      id,
      inputClassName,
      labelClassName,
      errorClassName,
      className,
      required,
      value,
      defaultValue,
      fullWidth,
      options,
      onValueChange,
      isLoading,
      checkedOnClickHandler,
      showLabel = true,
      disabled,
      autoComplete,
    },
    ref // Forwarded ref here
  ) => {
    return (
      <div className={classNames(fullWidth ? 'col-span-full' : cn('sm:col-span-3', className), cn(className))}>
        {inputType !== 'checkbox' && showLabel && label && <Label label={label} id={id} labelClassName={labelClassName} />}
        {inputType === 'input' && (
          <input
            ref={ref} // Attach the ref here
            type={type || 'text'}
            id={id}
            name={name}
            onChange={onChange}
            onClick={onClick}
            onBlur={onBlur}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
              isError ? 'border-red-500 ring-red-500 placeholder:text-red-500 focus-visible:ring-red-500 ' : '',
              inputClassName
            )}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
          />
        )}
        {inputType === 'textarea' && (
          <Textarea
            ref={ref}
            id={id}
            defaultValue={defaultValue}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            onClick={onClick}
            value={value}
            placeholder={placeholder}
          />
        )}
        {inputType === 'dropdown' &&
          (isLoading ? (
            <Skeleton className={'w-full h-[2.5rem]'} />
          ) : (
            <Select
              value={typeof value === 'string' ? value.toString() : value}
              onValueChange={value => onValueChange(value)}
              required={required}
            >
              <SelectTrigger className='w-full' defaultValue={value}>
                <SelectValue placeholder={placeholder} defaultValue={value} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options?.length > 0
                    ? options.map((option, index) => (
                        <SelectItem key={index} value={option?.value?.toString()}>
                          {option?.label}
                        </SelectItem>
                      ))
                    : ''}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        {inputType === 'checkbox' && (
          <div className='flex items-center gap-3'>
            <Checkbox id={id} checked={value} onClick={checkedOnClickHandler} />
            <Label label={label} id={id} labelClassName={classNames(labelClassName, 'mb-0')} />
          </div>
        )}

        {isError && <p className={cn(`text-red-500 font-semibold text-xs mt-1`, errorClassName)}>{errorMessage}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
