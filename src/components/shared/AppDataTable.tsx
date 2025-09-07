'use client';

import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  TableContainer, TableToolbar, TableToolbarContent, Pagination, InlineLoading, InlineNotification
} from '@carbon/react';
import EmptyState from './EmptyState';
import StatusTag from './StatusTag';
import PriorityTag from './PriorityTag';

export type GrievanceRow = {
  id: string;
  title: string;
  ward: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
};

type Props = {
  rows: GrievanceRow[] | null;
  loading?: boolean;
  error?: string | null;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number, pageSize: number) => void;
};

const headers = [
  { key: 'id', header: 'ID' },
  { key: 'title', header: 'Title' },
  { key: 'ward', header: 'Ward' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status' },
  { key: 'priority', header: 'Priority' },
  { key: 'createdAt', header: 'Created' },
];

export default function AppDataTable({
  rows,
  loading,
  error,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div aria-busy="true">
        <InlineLoading description="Loading table…" />
      </div>
    );
  }

  if (error) {
    return <InlineNotification kind="error" title="Failed to load" subtitle={error} role="alert" />;
  }

  if (!rows || rows.length === 0) {
    return <EmptyState title="No results" description="Try adjusting filters or date range." />;
  }

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent className="cds--type-body-01" />
            </TableToolbar>
            <Table size="md" useZebraStyles aria-label="Results">
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const headerProps = getHeaderProps({ header });
                    const { key: headerKey, ...restHeaderProps } = headerProps;
                    return (
                      <TableHeader key={headerKey} {...restHeaderProps}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const rowProps = getRowProps({ row });
                  const { key: rowKey, ...restRowProps } = rowProps;
                  return (
                    <TableRow key={rowKey} {...restRowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'status') {
                          return (
                            <TableCell key={cell.id}>
                              <StatusTag value={String(cell.value)} />
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'priority') {
                          return (
                            <TableCell key={cell.id}>
                              <PriorityTag value={String(cell.value)} />
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value as React.ReactNode}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <div style={{ marginTop: 'var(--cds-spacing-03)' }}>
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizes={[10, 20, 50]}
          onChange={({ page, pageSize }) => onPageChange(page, pageSize)}
          backwardText="Previous page"
          forwardText="Next page"
          itemsPerPageText="Items per page:"
        />
      </div>
    </>
  );
}
