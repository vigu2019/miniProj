import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-green-500 px-4 py-8 text-center">
          <CheckCircle className="h-16 w-16 text-white mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-white">Payment Successful!</h1>
        </div>
        
        <div className="px-6 py-8 text-center">
          <p className="text-gray-700 mb-6">Your order has been confirmed</p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Reference ID</p>
              <p className="text-lg font-medium text-gray-900">{orderId}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;