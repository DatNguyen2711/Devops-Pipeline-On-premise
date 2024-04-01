import React, { useEffect, useState } from 'react'
import Header from './Header'
import authApi from '../../utils/authApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Order() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  var firstName = localStorage.getItem("firstName");
  var lastName = localStorage.getItem("lastName");
  var userId = localStorage.getItem('userId');
  var fullName = firstName + '  ' + lastName;
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    filterOrders();
  }, [filterStatus, orders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const fetchOrders = async () => {
    try {
      const response = await authApi.get("/Order/ViewOrder/" + userId);
      if (response.status === 200) {
        const formattedOrders = response.data.map(order => ({
          ...order,
          orderDate: formatDate(order.orderDate)
        }));
        setOrders(formattedOrders);
      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  };
  const handleCancelOrder = async (orderID) => {
    try {
      await authApi.put("/Order/CancelOrder/" + orderID);
      toast.success("Order cancelled")
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  const filterOrders = () => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.orderStatus === filterStatus);
      setFilteredOrders(filtered);
    }
  };

  const handleFilterByDate = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const fromDateTime = fromDate ? new Date(fromDate) : null;
      const toDateTime = toDate ? new Date(toDate) : null;

      if (fromDate && toDate) {
        return orderDate >= fromDateTime && orderDate <= toDateTime;
      } else if (fromDate) {
        return orderDate >= fromDateTime;
      } else if (toDate) {
        return orderDate <= toDateTime;
      } else {
        return true;
      }
    });
    setFilteredOrders(filtered);
  };

  return (
    <>
      <Header />
      <h1 className='text-center text-xl-center font-semibold text-3xl mt-6 mb-10'>My Orders</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-between items-center mb-4 mr-10">
          <div className="flex items-center ml-5">
            <label htmlFor="orderStatus" className="mr-2 text-gray-700">Filter by Status:</label>
            <select
              id="orderStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all" className="text-gray-600">All</option>
              <option value="Pending" className="text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200 h-12">Pending</option>
              <option value="Confirmed" className="text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-200 h-12">Confirmed</option>
              <option value="Canceled" className="text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-200 h-12">Canceled</option>
            </select>
          </div>
          <div className='flex items-center'>
            <label htmlFor='fromDate' className='mr-2 text-gray-700'>From:</label>
            <input
              type='date'
              id='fromDate'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mr-4'
            />
            <label htmlFor='toDate' className='mr-2 text-gray-700'>To:</label>
            <input
              type='date'
              id='toDate'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
            />
            <button onClick={handleFilterByDate} className='ml-4 px-4 py-2 rounded-md bg-blue-500 text-white focus:outline-none hover:bg-blue-600'>
              Filter
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-blue-200 dark:bg-blue-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                Order code
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600" : "bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"}
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{order.orderNo}</td>
                <td className="px-6 py-4">{order.orderDate}</td>

                <td className="px-6 py-4">{order.orderTotal}</td>

                <td className={`px-6 py-4 font-semibold text-lg ${order.orderStatus === "Pending" ? "text-blue-500" : order.orderStatus === "Confirmed" ? "text-green-500" : order.orderStatus === "Canceled" ? "text-orange-500" : ""}`}>
                  {order.orderStatus}
                </td>
                {order.orderStatus === "Canceled" && (
                  <td className="px-6 py-4">
                    <button
                      className="flex items-center justify-center font-semibold text-green-500 dark:text-blue-500 hover:underline bg-green-100 dark:bg-green-700 text-green-500 dark:text-green-100 px-4 py-2 rounded hover:bg-green-200 dark:hover:bg-green-600 w-full"
                    >
                      <span className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                        <Link to={`/order/${order.id}`}>View Detail</Link>
                      </span>
                    </button>
                  </td>
                )}
                {order.orderStatus === "Pending" && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center justify-center font-semibold text-red-500 dark:text-blue-500 hover:underline bg-red-100 dark:bg-red-700 text-red-500 dark:text-red-100 px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-red-600 w-full"
                    >
                      <span className="bg-red-500 text-white px-2 py-1 rounded mr-2">Cancel</span>
                    </button>
                  </td>
                )}
                {order.orderStatus === "Confirmed" && (
                  <td className="px-6 py-4">
                    <button
                      className="flex items-center justify-center font-semibold text-green-500 dark:text-blue-500 hover:underline bg-green-100 dark:bg-green-700 text-green-500 dark:text-green-100 px-4 py-2 rounded hover:bg-green-200 dark:hover:bg-green-600 w-full"
                    >
                      <span className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                        <Link to={`/order/${order.id}`}>View Detail</Link>
                      </span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>;
      </div>
      <ToastContainer />
    </>
  )
}

export default Order