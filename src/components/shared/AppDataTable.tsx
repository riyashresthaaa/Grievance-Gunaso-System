'use client';

import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  Pagination,
} from '@carbon/react';
import StatusTag from '@/components/shared/StatusTag';
import PriorityTag from '@/components/shared/PriorityTag';
import { useMemo } from 'react';

export type GrievanceRow = {
  id: string;
  title?: string;
  ward?: string;
  category?: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Rejected' | string;
  priority: 'Low' | 'Medium' | 'High' | string;
  /** allow either key; we’ll normalize when rendering */
  created?: string;
  createdAt?: string;
};

type Props = {
  rows: GrievanceRow[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number, pageSize: number) => void;
};

export default function AppDataTable({
  rows,
  loading,
  error,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: Props) {
  // Headers are stable to avoid hydration diff
  const headers = useMemo(
    () => [
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Title' },
      { key: 'ward', header: 'Ward' },
      { key: 'category', header: 'Category' },
      { key: 'status', header: 'Status' },
      { key: 'priority', header: 'Priority' },
      { key: 'created', header: 'Created' },
    ],
    []
  );

  // Normalize incoming rows so keys match headers
  const normRows = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        title: r.title ?? '',
        ward: r.ward ?? '',
        category: r.category ?? '',
        status: r.status,
        priority: r.priority,
        created: r.created ?? r.createdAt ?? '',
      })),
    [rows]
  );

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <DataTable rows={normRows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent className="cds--type-body-01" />
            </TableToolbar>

            <Table size="sm" useZebraStyles>
              <TableHead>
                <TableRow>
                  {headers.map((h) => {
                    // Avoid “key inside spread” warning by splitting it out
                    const headerProps = getHeaderProps({ header: h }) as any;
                    const { key, ...rest } = headerProps;
                    return (
                      <TableHeader key={key} {...rest}>
                        {h.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => {
                  const rowProps = getRowProps({ row }) as any;
                  const { key, ...rest } = rowProps;

                  return (
                    <TableRow key={key} {...rest}>
                      {row.cells.map((cell: any) => {
                        const colKey = cell.info.header as string;

                        if (colKey === 'status') {
                          return (
                            <TableCell key={cell.id}>
                              <StatusTag value={String(cell.value)} />
                            </TableCell>
                          );
                        }
                        if (colKey === 'priority') {
                          return (
                            <TableCell key={cell.id}>
                              <PriorityTag value={String(cell.value)} />
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value as any}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div style={{ padding: 'var(--cds-spacing-04)' }}>
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 50]}
                totalItems={totalItems}
                onChange={({ page, pageSize }) => onPageChange(page, pageSize)}
              />
            </div>
          </TableContainer>
        )}
      </DataTable>

      {/* Inline messages beneath the table container keeps DOM shape stable */}
      {loading && <div className="cds--type-body-01">Loading…</div>}
      {error && (
        <div role="alert" className="cds--type-body-01">
          {error}
        </div>
      )}
    </div>
  );
}
