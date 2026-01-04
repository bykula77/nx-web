import { Table, Empty } from 'antd';
import type { TableProps } from 'antd';
import type { DataTableProps } from './DataTable.types';

/**
 * DataTable component - wraps Ant Design Table with enhanced features
 */
export function DataTable<T extends object>({
  columns,
  data,
  pagination,
  loading,
  rowKey = 'id' as keyof T,
  onSortChange,
  emptyMessage = 'Veri bulunamadı',
  ...props
}: DataTableProps<T>) {
  const antColumns = columns.map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex as string,
    width: col.width,
    align: col.align,
    fixed: col.fixed,
    render: col.render,
    sorter: col.sortable ? true : undefined,
  }));

  const handleTableChange: TableProps<T>['onChange'] = (
    _pagination,
    _filters,
    sorter
  ) => {
    if (onSortChange && !Array.isArray(sorter)) {
      onSortChange(
        sorter.field as string,
        sorter.order as 'ascend' | 'descend' | null
      );
    }
  };

  return (
    <Table<T>
      {...props}
      columns={antColumns}
      dataSource={data}
      loading={loading}
      rowKey={rowKey as string}
      onChange={handleTableChange}
      pagination={
        pagination
          ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: true,
              showTotal: (total) => `Toplam ${total} kayıt`,
            }
          : false
      }
      locale={{
        emptyText: <Empty description={emptyMessage} />,
      }}
    />
  );
}

