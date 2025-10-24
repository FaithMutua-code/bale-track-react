// complaints.jsx
import React, { useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const Complaints = () => {
  const [complaints] = useState([
    {
      id: 1,
      customer: "Liam Johnston",
      email: "liam@example.com",
      complaint: "Product arrived damaged",
      status: "Open",
      priority: "Open",
    },
    {
      id: 2,
      customer: "Olivia Smith",
      email: "olivia@example.com",
      complaint: "Incorrect item shipped",
      status: "Open",
      priority: "Medium",
    },
    {
      id: 3,
      customer: "Noah Williams",
      email: "noah@example.com",
      complaint: "Subscription not working",
      status: "Open",
      priority: "High",
    },
  ]);

  const [activeTab, setActiveTab] = useState("Open");

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Complaints
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage all customer complaints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Create New Complaint Button */}
        <div className="lg:col-span-2">
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2 w-full lg:w-auto justify-center">
            <PlusIcon className="w-5 h-5" />
            Create New Complaint
          </button>
        </div>

        {/* This Week Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              This Week
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              25
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +90% from last week
            </p>
          </div>
        </div>

        {/* This Month Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              This Month
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              105
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +5% from last month
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        {/* Tabs with Filter and Export on the right */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {/* Left side: Tabs */}
          <div className="flex space-x-4">
            {["Open", "Resolved", "Escalated"].map((tab) => (
              <button
                key={tab}
                className={`pb-4 px-1 font-medium text-sm ${
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right side: Filter and Export */}
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Open Complaints Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Open Complaints
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              View and manage open customer complaints.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Complaint
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Priority
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {complaint.customer}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {complaint.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                    {complaint.complaint}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                      Actions
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
