import { flexRender } from '@tanstack/react-table'

import tableStyles from '@core/styles/table.module.css'

const TableGeneric = ({ table, columns }) => {
  const totalColumns = table.getVisibleFlatColumns().length
  const onRowClick = table.options?.meta?.onRowClick

  return (
    <div className='overflow-x-auto'>
      <table className={tableStyles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={totalColumns} className='text-center' style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={onRowClick ? 'cursor-pointer hover:bg-blue-50/50' : ''}
                style={onRowClick ? { transition: 'background-color 0.2s' } : {}}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableGeneric
