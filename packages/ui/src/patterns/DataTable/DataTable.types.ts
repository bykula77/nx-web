import type { TableProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * DataTable column configuration
 */
export interface DataTableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex: keyof T | string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T, index: number) => ReactNode;
  fixed?: 'left' | 'right';
}

/**
 * DataTable pagination config
 */
export interface DataTablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * DataTable component props
 */
export interface DataTableProps<T extends object>
  extends Omit<TableProps<T>, 'columns' | 'pagination'> {
  /**
   * Table columns configuration
   */
  columns: DataTableColumn<T>[];

  /**
   * Table data
   */
  data: T[];

  /**
   * Pagination configuration
   */
  pagination?: DataTablePagination | false;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Row key extractor
   */
  rowKey?: keyof T | ((record: T) => string);

  /**
   * On sort change callback
   */
  onSortChange?: (field: string, order: 'ascend' | 'descend' | null) => void;

  /**
   * Empty state message
   */
  emptyMessage?: string;
}

