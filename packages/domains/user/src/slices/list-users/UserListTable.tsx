import { Table, Tag, Avatar, Input, Select, Space, Button } from 'antd';
import { SearchOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { UserListItemDTO } from '../../types/user.dto';
import type { ListUsersFilters, ListUsersPagination } from './list-users.query';
import {
  UserRole,
  UserStatus,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
} from '../../types';
import { formatDate, getUserInitials } from '../../shared';

interface UserListTableProps {
  data: UserListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  filters?: ListUsersFilters;
  onFiltersChange?: (filters: ListUsersFilters) => void;
  onPaginationChange?: (pagination: ListUsersPagination) => void;
  onRowClick?: (user: UserListItemDTO) => void;
  onRefresh?: () => void;
}

/**
 * User list table component
 */
export function UserListTable({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  filters = {},
  onFiltersChange,
  onPaginationChange,
  onRowClick,
  onRefresh,
}: UserListTableProps) {
  const columns: ColumnsType<UserListItemDTO> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.avatarUrl}
            icon={!record.avatarUrl && <UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          >
            {!record.avatarUrl && getUserInitials({ ...record, createdAt: new Date(), updatedAt: new Date(), role: record.role, status: record.status })}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: UserRole) => USER_ROLE_LABELS[role],
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: UserStatus) => (
        <Tag color={USER_STATUS_COLORS[status]}>
          {USER_STATUS_LABELS[status]}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => formatDate(date),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange?.({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <div>
      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Ara..."
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onFiltersChange?.({ ...filters, search: e.target.value })}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          placeholder="Rol"
          value={filters.role}
          onChange={(value) => onFiltersChange?.({ ...filters, role: value })}
          style={{ width: 120 }}
          allowClear
        >
          {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Durum"
          value={filters.status}
          onChange={(value) => onFiltersChange?.({ ...filters, status: value })}
          style={{ width: 120 }}
          allowClear
        >
          {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
        {onRefresh && (
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Yenile
          </Button>
        )}
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} kullanıcı`,
        }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: onRowClick ? 'pointer' : 'default' },
        })}
      />
    </div>
  );
}

