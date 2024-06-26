import { css } from '@emotion/react';
import { ArrowDown, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react';
import { flexRender, type Header, type Table } from '@tanstack/react-table';
import clsx from 'clsx';
import { Alert, Spinner } from 'react-bootstrap';

interface Props<TData> {
  table: Table<TData>;
  hasError: boolean;
  isLoading: boolean;
  hasData: boolean;
  refetch: VoidFunction;
}

function renderSortIcon(header: Header<any, unknown>) {
  if (!header.column.getCanSort()) return null;

  const sortStatus = header.column.getIsSorted();
  switch (sortStatus) {
    case 'desc':
      return <ArrowDown />;
    case 'asc':
      return <ArrowUp />;
    default:
      return <ArrowsDownUp />;
  }
}

export function Table<TData>({ table, hasError, isLoading, hasData, refetch }: Props<TData>) {
  const isDataReady = !(hasError || isLoading)


  return (
    <>
      <table className="table table-zebra">
        {hasData && (
          <thead className="bg-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className={clsx('select-none text-nowrap', { 'cursor-pointer': header.column.getCanSort() })}
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span className="text-dark ms-1">{renderSortIcon(header)}</span>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        )}

        {isDataReady && (
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="align-middle text-nowrap" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {isLoading && (
        <div className="h-100 w-100 my-3 d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {hasError && (
        <div className="h-100 w-100 my-3 d-flex align-items-center justify-content-center">
          <Alert css={errorAlertContainer} variant="danger">
            <span>
              <i className="icon-exclamation-circle ms-2" />
              دریافت اطلاعات با خطا مواجه شد!
            </span>
            <button className='btn btn-sm btn-error' onClick={refetch}>
              دوباره تلاش کنید
            </button>
          </Alert>
        </div>
      )}
    </>
  );
}

const errorAlertContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.875rem;
  border: none;
`;
