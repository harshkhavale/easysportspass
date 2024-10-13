import React from 'react';
import PropTypes from 'prop-types';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Input } from '../components/ui-comp/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../components/ui-comp/dropdown-menu';
import { Button } from '../components/ui-comp/button/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui-comp/tables/tables';

export function DataTable({ data, columns, title, filterAccessorKey, filterPlaceholder }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between lg:items-center w-full'>
        <div className='sm:flex-auto'>
          <h1 className='text-base font-semibold leading-6 text-gray-900'>{title}</h1>
        </div>
        <div className='flex items-center py-4 gap-4'>
          {Array.isArray(filterAccessorKey) ? (
            filterAccessorKey.map((item, index) => (
              <React.Fragment key={index}>
                <Input
                  inputType={'input'}
                  placeholder={filterPlaceholder[index]}
                  value={table.getColumn(item)?.getFilterValue() ?? ''}
                  onChange={event => table.getColumn(item)?.setFilterValue(event.target.value)}
                  className='max-w-sm'
                />
              </React.Fragment>
            ))
          ) : (
            <Input
              inputType={'input'}
              placeholder={filterPlaceholder}
              value={table.getColumn(filterAccessorKey)?.getFilterValue() ?? ''}
              onChange={event => table.getColumn(filterAccessorKey)?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='rounded-md border overflow-auto'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.any.isRequired,
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  filterAccessorKey: PropTypes.string.isRequired,
  filterPlaceholder: PropTypes.string.isRequired,
  editFunc: PropTypes.func.isRequired,
  updateFunc: PropTypes.func.isRequired,
};
