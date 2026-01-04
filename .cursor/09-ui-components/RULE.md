---
description: 'UI component patterns: primitives, patterns, layouts.'
alwaysApply: false
globs: ['packages/ui/**/*']
---

# UI Components Pattern

**Trigger:** Creating components in `packages/ui/`

> ⛔ UI = Domain-agnostic. No business logic, no data fetching.

## Structure

```
packages/ui/src/
├── primitives/     # Button, Input, Modal, Select
├── patterns/       # DataTable, FormBuilder, StatusBadge
├── layouts/        # PageLayout, DashboardLayout
└── index.ts
```

## File Structure

**Primitive (single):**

```
Button/
├── Button.tsx
├── Button.types.ts
└── index.ts
```

**Pattern (composite):**

```
DataTable/
├── DataTable.tsx
├── DataTable.types.ts
├── DataTablePagination.tsx
├── DataTableEmpty.tsx
├── DataTableActions.tsx
└── index.ts
```

---

## Primitive Pattern

```typescript
// Button.types.ts
interface ButtonProps extends Omit<AntButtonProps, 'type'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  loadingText?: string;
}

// Button.tsx
const variantMap = {
  primary: { type: 'primary', danger: false },
  secondary: { type: 'default', danger: false },
  danger: { type: 'primary', danger: true },
};

function Button({ variant = 'secondary', fullWidth, loadingText, loading, children, ...props }: ButtonProps) {
  const { type, danger } = variantMap[variant];
  return (
    <AntButton type={type} danger={danger} loading={loading} style={{ width: fullWidth ? '100%' : undefined }} {...props}>
      {loading && loadingText ? loadingText : children}
    </AntButton>
  );
}
```

**Input with label/error:**

```typescript
interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

function Input({ label, error, helperText, required, ...props }: InputProps) {
  return (
    <div>
      {label && <label>{label}{required && <span className="text-red-500">*</span>}</label>}
      <AntInput status={error ? 'error' : undefined} {...props} />
      {error && <Text type="danger">{error}</Text>}
      {helperText && <Text type="secondary">{helperText}</Text>}
    </div>
  );
}
```

**Modal with simplified API:**

```typescript
interface ModalProps extends Omit<AntModalProps, 'onOk' | 'onCancel'> {
  onConfirm?: () => void | Promise<void>;
  onClose: () => void;
  confirmText?: string;
  loading?: boolean;
  danger?: boolean;
}
```

---

## Pattern: DataTable

```typescript
// DataTable.types.ts
interface DataTableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T) => ReactNode;
  sortable?: boolean;
  width?: number;
  hidden?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: { current: number; pageSize: number; total: number; onChange: (page, size) => void };
  selection?: { selectedIds: string[]; onChange: (ids: string[]) => void };
  onRowClick?: (record: T) => void;
  renderActions?: (record: T) => ReactNode;
  emptyContent?: ReactNode;
}

// DataTable.tsx
function DataTable<T extends { id: string }>({ data, columns, pagination, selection, renderActions, ... }: DataTableProps<T>) {
  const finalColumns = renderActions
    ? [...columns.filter(c => !c.hidden), { key: 'actions', title: 'Actions', render: (_, r) => renderActions(r) }]
    : columns.filter(c => !c.hidden);

  return (
    <>
      {selection?.selectedIds.length > 0 && <BulkActionsBar count={selection.selectedIds.length} />}
      <Table dataSource={data} columns={finalColumns} rowKey="id" pagination={false} />
      {pagination && <DataTablePagination {...pagination} />}
    </>
  );
}
```

**Sub-components:**

- `DataTablePagination` - Page info + Ant Pagination
- `DataTableEmpty` - Empty state with optional action
- `DataTableActions` - Action buttons with overflow dropdown

---

## Pattern: StatusBadge

```typescript
interface StatusConfig { color: string; label: string; icon?: ReactNode; }

function StatusBadge<T extends string>({ status, config }: { status: T; config: Record<T, StatusConfig> }) {
  const { color, label, icon } = config[status];
  return <Tag color={color} icon={icon}>{label}</Tag>;
}

// Factory for pre-configured badge
function createStatusBadge<T extends string>(config: Record<T, StatusConfig>) {
  return ({ status }: { status: T }) => <StatusBadge status={status} config={config} />;
}
```

---

## Layout: PageLayout

```typescript
function PageLayout({ children }: { children: ReactNode }) {
  return <Layout.Content className="p-6 min-h-screen bg-gray-100">{children}</Layout.Content>;
}

function PageHeader({ title, subtitle, backPath, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex justify-between">
        <div>
          {backPath && <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backPath)} />}
          <Title level={4}>{title}</Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
        {actions}
      </div>
    </div>
  );
}

function PageContent({ children, padding = true }: { children: ReactNode; padding?: boolean }) {
  return <div className="bg-white rounded-lg" style={{ padding: padding ? 24 : 0 }}>{children}</div>;
}
```

---

## Component Rules

| UI Does                      | UI Does NOT             |
| ---------------------------- | ----------------------- |
| Render content               | Fetch data              |
| Handle UI state (open/close) | Manage server state     |
| Forward events               | Validate business rules |
| Display loading/error states | Know about domains      |

---

## Props Design Patterns

| Pattern       | Example                                    | Use              |
| ------------- | ------------------------------------------ | ---------------- |
| Variant       | `variant: 'primary' \| 'danger'`           | Visual states    |
| Callback      | `onClose: () => void`                      | User interaction |
| Render prop   | `renderActions: (item) => ReactNode`       | Custom rendering |
| Config object | `pagination: { current, total, onChange }` | Related props    |
| Factory       | `createStatusBadge(config)`                | Pre-configured   |

---

## Naming

| Type          | Pattern          |
| ------------- | ---------------- |
| Component     | `PascalCase.tsx` |
| Props         | `ComponentProps` |
| Sub-component | `ParentChild`    |
| Factory       | `createXxx`      |
