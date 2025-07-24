import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { 
  LayoutDashboard, 
  Upload, 
  Shield, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Invoice', href: '/upload', icon: Upload },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Please sign in</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} location={location} signOut={signOut} user={user} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <SidebarContent navigation={navigation} location={location} signOut={signOut} user={user} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, location, signOut, user }) => (
  <>
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
      <div className="flex items-center">
        <Shield className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold text-white">InvoiceGuard</span>
      </div>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
    <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
      <div className="flex items-center">
        <div className="ml-3">
          <p className="text-sm font-medium text-white">{user?.email}</p>
          <button
            onClick={signOut}
            className="flex items-center text-xs text-gray-300 hover:text-white mt-1"
          >
            <LogOut className="mr-1 h-3 w-3" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </>
);

export default Layout;