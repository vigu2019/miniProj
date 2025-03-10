import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urls } from '@/utils/urls';
export function CompletedPrints() {
  const [allPrints, setAllPrints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPrints = async () => {
      try {
        setLoading(true);
        const response = await axios.get(urls.getUserPrints, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  // Filter completed prints based on the status column
  const completedPrints = allPrints.filter(print => print.status === 'completed');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Completed Prints</h3>
      
      {loading ? (
        <p className="text-gray-500">Loading completed prints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : completedPrints.length === 0 ? (
        <p className="text-gray-500">No completed prints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedPrints.map((print) => (
                <tr key={print.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{print.description || 'No description'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{print.print_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{print.copies}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(print.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {print.status}
                    </span>
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