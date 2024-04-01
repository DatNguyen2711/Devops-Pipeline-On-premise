import React, { useEffect, useState } from 'react'
import AdminHeader from './AdminHeader'
import authApi from '../../utils/authApi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [CustomerName, setCustomerName] = useState('')
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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
      const response = await authApi.get("/Order/GetAllOrders");
      if (response.status === 200) {
        const filteredOrders = response.data.filter(order => order.orderStatus !== "Canceled");
        const formattedOrders = filteredOrders.map(order => ({
          ...order,
          orderDate: formatDate(order.orderDate)
        }));
        setOrders(formattedOrders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error while fetching orders:", error);
    }
  };
  const getTopSellingProducts = async () => {
    try {
      const response = await authApi.get("/Order/GetTopProducts");
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch top selling products");
        return [];
      }
    } catch (error) {
      console.error("Error while fetching top selling products:", error);
      return [];
    }
  };
  const handleDeletedOrder = async (orderID) => {
    try {
      await authApi.put("/Order/DeleteOrder/" + orderID);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleConfirmOrder = async (orderID) => {
    try {
      await authApi.put("/Order/ConfirmOrder/" + orderID);
      fetchOrders();
    } catch (error) {
      console.error('Error confirm  order:', error);
    }
  };
  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Order Code", "Customer Name", "Order Date", "Total Price"]
    ];

    let totalPrice = 0;
    orders.forEach(order => {
      totalPrice += order.orderTotal;
      wsData.push([order.orderNo, order.customerName, order.orderDate, order.orderTotal]);
    });

    wsData.push(["", "", "", `Total Price of Confirmed Orders: ${totalPrice}`]);

    const fromDateFormatted = format(new Date(fromDate), 'yyyy-MM-dd');
    const toDateFormatted = format(new Date(toDate), 'yyyy-MM-dd');
    wsData.push(["", "", "", `From: ${fromDateFormatted} - To: ${toDateFormatted}`]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Confirmed Orders");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, 'confirmed_orders.xlsx');
  };

  const handleExportToExcelBestSeller = async () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Name", "Manufacturer", "Unit Price", "Discount", "Quantity"]
    ];

    // Lấy danh sách các sản phẩm bán chạy nhất
    const topProducts = await getTopSellingProducts();

    // Kiểm tra nếu danh sách có dữ liệu
    if (topProducts.length > 0) {
      // Lặp qua danh sách các sản phẩm bán chạy nhất và lấy các thông tin cần thiết
      topProducts.forEach(product => {
        const { name, manufacturer, unitPrice, discount, quantity } = product;
        wsData.push([name, manufacturer, unitPrice, discount, quantity]);
      });
    }

    // Tạo sheet Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Top Selling Products");

    // Xuất file Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, 'top_selling_products.xlsx');
  };



  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
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
      <AdminHeader />
      <h1 className='text-center font-semibold text-3xl mt-9'>
        Order Management
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="mt-9 mb-4 flex flex-wrap justify-between items-center pb-4">
          <div className="flex flex-column sm:flex-row space-y-4 sm:space-y-0 items-center">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative ml-3">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-[300px] block p-2 ps-10 text-sm text-gray-900 border border-blue-700 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for customer's name"
              />
            </div>
          </div>
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
              <option value="Deleted" className="text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-200 h-12">Deleted</option>
            </select>
          </div>
          <div className='mr-10 flex items-center justify-end'>
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
          <div className='flex justify-center mt-[-2px] mr-20 '>
            <button onClick={handleExportToExcel} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none">
              Export Orders
            </button>
          </div>
          <div className='ml-4 flex justify-center mt-[-2px] mr-20 '>
            <button onClick={handleExportToExcelBestSeller} className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              Get Top Seller
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                Customer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Order Code
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Total price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>

            </tr>
          </thead>
          <tbody>
            {filteredOrders.filter(order => {
              if (!CustomerName || CustomerName.trim() === '') {
                return true;
              } else {

                return order.customerName.toLowerCase().includes(CustomerName.trim().toLowerCase());
              }
            }).map((item, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-3"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-3" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.id}
                </th>
                <td className="px-6 py-4">{item.customerName}</td>
                <td className="px-6 py-4">{item.orderNo}</td>
                <td className="px-6 py-4">{item.orderDate}</td>
                <td className="px-6 py-4">{item.orderTotal}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${item.orderStatus === "Pending" ? 'bg-blue-500' : item.orderStatus === "Deleted" ? 'bg-red-500' : 'bg-green-500'} me-2`} />
                    {item.orderStatus}
                  </div>
                </td>
                {item.orderStatus === "Pending" ? (<><td className="px-6 py-4">
                  <button
                    onClick={(e) => handleDeletedOrder(item.id)}

                    className="font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleConfirmOrder(item.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Confirm
                    </button>
                  </td> </>) : (<></>)}

              </tr>))}
          </tbody>
        </table>
      </div>

    </>
  )
}

export default AdminOrder