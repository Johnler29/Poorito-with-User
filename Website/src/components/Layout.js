import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;

