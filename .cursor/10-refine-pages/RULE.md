---
description: 'Page creation pattern: List, Show, Create, Edit views.'
alwaysApply: false
globs: ['apps/**/pages/**/*']
---

# App Pages Pattern

**Trigger:** Creating pages in `apps/*/src/pages/`

> ⛔ Pages = COMPOSITION ONLY. All business logic in domain hooks.

## Structure

```
pages/
├── DashboardPage.tsx
├── [domain]/
│   ├── [Domain]ListPage.tsx    # /[domains]
│   ├── [Domain]ShowPage.tsx    # /[domains]/:id
│   ├── [Domain]CreatePage.tsx  # /[domains]/create
│   └── [Domain]EditPage.tsx    # /[domains]/:id/edit
```

## Page Template

```typescript
function [Domain][Type]Page() {
  // 1. ROUTER
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 2. UI STATE
  const [modalOpen, setModalOpen] = useState(false);

  // 3. DOMAIN HOOKS
  const { data, isLoading, error } = useGet[Entity](id!);
  const mutation = use[Action]({ onSuccess: () => navigate('...') });

  // 4. HANDLERS
  const handleAction = () => { ... };

  // 5. LOADING STATE
  if (isLoading) return <PageLayout><Spin /></PageLayout>;

  // 6. ERROR STATE
  if (error || !data) return <PageLayout><Result status="404" /></PageLayout>;

  // 7. RENDER
  return (
    <PageLayout>
      <PageHeader title="..." backPath="..." actions={...} breadcrumbs={...} />
      <PageContent>
        {/* Domain components */}
      </PageContent>
      {/* Modals */}
    </PageLayout>
  );
}
```

---

## List Page

```typescript
function OrderListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>();
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const { data, isLoading } = useListOrders({ page, search, status: statusFilter });
  const deleteOrder = useDeleteOrder({ onSuccess: () => setDeleteTarget(null) });

  const columns: DataTableColumn<Order>[] = [
    { key: 'id', title: 'ID', render: id => <code>{id.slice(0, 8)}</code> },
    { key: 'status', title: 'Status', render: status => <StatusBadge status={status} /> },
    { key: 'total', title: 'Total', render: total => formatCurrency(total) },
    { key: 'createdAt', title: 'Created', render: date => formatDate(date) },
  ];

  return (
    <PageLayout>
      <PageHeader title="Orders" actions={<Button onClick={() => navigate('/orders/create')}>New</Button>} />
      <PageContent>
        {/* Filters */}
        <Space className="mb-4">
          <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} />
        </Space>

        {/* Table */}
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          pagination={{ current: page, total: data?.pagination.total, onChange: setPage }}
          onRowClick={record => navigate(`/orders/${record.id}`)}
          renderActions={record => (
            <DataTableActions actions={[
              createViewAction(() => navigate(`/orders/${record.id}`)),
              createEditAction(() => navigate(`/orders/${record.id}/edit`)),
              createDeleteAction(() => setDeleteTarget(record)),
            ]} />
          )}
        />
      </PageContent>

      <ConfirmModal open={!!deleteTarget} onConfirm={() => deleteOrder.mutate(deleteTarget!.id)} onClose={() => setDeleteTarget(null)} danger />
    </PageLayout>
  );
}
```

---

## Show Page

```typescript
function OrderShowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: order, isLoading, error } = useGetOrder(id!);

  if (isLoading) return <Spin />;
  if (error || !order) return <Result status="404" />;

  const canEdit = ['DRAFT', 'PENDING'].includes(order.status);

  return (
    <PageLayout>
      <PageHeader
        title={`Order #${order.id.slice(0, 8)}`}
        backPath="/orders"
        actions={canEdit && <Button onClick={() => navigate(`/orders/${id}/edit`)}>Edit</Button>}
      />
      <PageContent>
        <Descriptions>
          <Descriptions.Item label="Status"><StatusBadge status={order.status} /></Descriptions.Item>
          <Descriptions.Item label="Total">{formatCurrency(order.total)}</Descriptions.Item>
        </Descriptions>
        <OrderItemsTable items={order.items} />
      </PageContent>
    </PageLayout>
  );
}
```

---

## Create Page

```typescript
function OrderCreatePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageHeader title="Create Order" backPath="/orders" />
      <PageContent maxWidth={800}>
        <CreateOrderForm
          onSuccess={id => navigate(`/orders/${id}`)}
          onCancel={() => navigate('/orders')}
        />
      </PageContent>
    </PageLayout>
  );
}
```

---

## Edit Page

```typescript
function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrder(id!);

  if (isLoading) return <Spin />;
  if (error || !order) return <Result status="404" />;

  const canEdit = ['DRAFT', 'PENDING'].includes(order.status);
  if (!canEdit) return <Result status="warning" title="Cannot Edit" />;

  return (
    <PageLayout>
      <PageHeader title={`Edit Order #${order.id.slice(0, 8)}`} backPath={`/orders/${id}`} />
      <PageContent maxWidth={800}>
        <UpdateOrderForm order={order} onSuccess={() => navigate(`/orders/${id}`)} />
      </PageContent>
    </PageLayout>
  );
}
```

---

## Route Configuration

```typescript
<Route path="/orders" element={<OrderListPage />} />
<Route path="/orders/create" element={<OrderCreatePage />} />
<Route path="/orders/:id" element={<OrderShowPage />} />
<Route path="/orders/:id/edit" element={<OrderEditPage />} />
```

---

## Rules

| Page Does                | Page Does NOT           |
| ------------------------ | ----------------------- |
| Compose UI components    | Contain business logic  |
| Wire up domain hooks     | Make direct API calls   |
| Handle navigation        | Validate business rules |
| Manage UI state (modals) | Transform data          |

## Imports

| Source                | What                                            |
| --------------------- | ----------------------------------------------- |
| `@workspace/ui`       | PageLayout, PageHeader, DataTable, ConfirmModal |
| `@workspace/domain-*` | Hooks, Forms, Badges, Types                     |
| `@workspace/shared`   | formatCurrency, formatDate                      |
| `react-router-dom`    | useParams, useNavigate                          |
| `antd`                | Button, Space, Spin, Result                     |

## States

| State          | When               | Component                     |
| -------------- | ------------------ | ----------------------------- |
| Loading        | `isLoading`        | `<Spin />`                    |
| Error/NotFound | `error \|\| !data` | `<Result status="404" />`     |
| Not Allowed    | Business rule      | `<Result status="warning" />` |
