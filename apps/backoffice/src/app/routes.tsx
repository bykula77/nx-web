import { Routes, Route, Outlet } from 'react-router-dom';
import { Authenticated } from '@refinedev/core';
import { NavigateToResource, CatchAllNavigate } from '@refinedev/react-router';

import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/**
 * Application routes
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Authenticated routes */}
      <Route
        element={
          <Authenticated
            key="authenticated-routes"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <Outlet />
          </Authenticated>
        }
      >
        <Route index element={<NavigateToResource resource="dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Resource routes will be added here as domains are created */}
        {/* Example:
        <Route path="/users">
          <Route index element={<UserList />} />
          <Route path="create" element={<UserCreate />} />
          <Route path=":id/edit" element={<UserEdit />} />
          <Route path=":id" element={<UserShow />} />
        </Route>
        */}
      </Route>

      {/* Guest routes */}
      <Route
        element={
          <Authenticated
            key="auth-pages"
            fallback={<Outlet />}
          >
            <NavigateToResource />
          </Authenticated>
        }
      >
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

