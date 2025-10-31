import React from 'react'
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-lg border-b border-gray-700">
      <h1 className="text-2xl font-bold text-indigo-400">Project Manager</h1>
      <ul className="flex space-x-6 text-gray-300">
        <li className="hover:text-indigo-400 cursor-pointer">Home</li>
        <li className="hover:text-indigo-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-indigo-400 cursor-pointer">About</li>
      </ul>
    </nav>
  );
}
