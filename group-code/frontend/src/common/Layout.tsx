import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}

export function LayoutNoPadding() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
