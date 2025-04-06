import React, { useState, useEffect } from "react";
import axios from "axios";
import { urls } from "@/utils/urls";
export function PendingPrints() {
  const [allPrints, setAllPrints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewError, setViewError] = useState(null);

  useEffect(() => {
    const fetchUserPrints = async () => {
      try {
        setLoading(true);
        const response = await axios.get(urls.getUserPrints, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllPrints(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load prints');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserPrints();
  }, []);
  //
  // Filter pending prints based on the status column
  const pendingPrints = allPrints.filter(print => print.status === 'pending' && print.payment_status === 'paid');

  // Function to handle file viewing
  const handleViewFile = (fileUrl, printId) => {
    // Check if URL is valid
    if (!fileUrl) {
      setViewError(`Unable to view file for print #${printId}. URL is missing.`);
      return;
    }

    // Open in new tab
    window.open(fileUrl, '_blank');
    
    // You could also implement a preview modal instead of opening in a new tab
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Pending Prints</h3>
      
      {viewError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{viewError}</p>
          <button 
            className="text-sm underline" 
            onClick={() => setViewError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {loading ? (
        <p className="text-gray-500">Loading pending prints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pendingPrints.length === 0 ? (
        <p className="text-gray-500">No pending prints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPrints.map((print) => (
                <tr key={print.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{print.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{print.description || 'No description'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{print.print_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{print.copies}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(print.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewFile(print.file_url, print.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}