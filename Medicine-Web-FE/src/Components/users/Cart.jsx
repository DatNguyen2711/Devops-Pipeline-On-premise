import React, { useEffect, useState } from 'react'
import Header from './Header'
import authApi from '../../utils/authApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Cart() {
  const [carts, setCarts] = useState([])
  const [nameSearch, setNameSearch] = useState('')
  const [totalPrice, setTotalPrice] = useState(0);

  var userId = localStorage.getItem('userId');
  var userFund = localStorage.getItem('userFund');
  useEffect(() => {
    fetchCarts();
  }, []);
  useEffect(() => {
    calculateTotalPrice();
  }, [carts]);
  const fetchCarts = async () => {
    try {
      const response = await authApi.get("Cart/GetAllCartItemOfUser/" + userId);
      if (response.status === 200) {
        setCarts(response.data);
      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  };
  const handleRemoveCartItem = async (cartId) => {
    try {
      const response = await authApi.delete("Cart/RemoveItemFromCart/" + cartId);
      if (response.status === 200) {
        fetchCarts();
        toast.success("Item removed from cart !");
      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  }
  const handlePlaceOrder = async (userId) => {
    try {
      const response = await authApi.post("Order/PlaceOrder/" + userId)
      if (response.status === 200) {
        fetchCarts();
        toast.success("Order placed successfully");
      } else if (userFund < totalPrice) {
        toast.error("Not enough money to purchase !");

      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  }
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    carts.forEach(cart => {
      totalPrice += cart.totalPrice;
    });
    setTotalPrice(totalPrice);
  }

  return (
    <>
      <Header />
      <h1 className='text-center text-xl-center font-semibold text-3xl mt-6'>My Cart</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative ml-3">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              onChange={(e) => setNameSearch(e.target.value)}
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-blue-700 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for product name"
            />
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
                Medicine Name
              </th>
              <th scope="col" className="px-6 py-3">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {carts.filter((user) => {
              if (!nameSearch || nameSearch.trim() === "") {
                return true;
              } else {
                return user.medicineName
                  .toLowerCase()
                  .includes(nameSearch.trim().toLowerCase());
              }
            }).map((cart, index) => (
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
                <td className="px-6 py-4">{cart.medicineName}</td>
                <td className="px-6 py-4">{cart.unitPrice}</td>
                <td className="px-6 py-4">{cart.discount}</td>
                <td className="px-6 py-4">{cart.quantity}</td>
                <td className="px-6 py-4">{cart.totalPrice}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRemoveCartItem(cart.id)}
                    className="font-semibold text-red-500 dark:text-blue-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>;



      </div>
      <div className="flex justify-end items-center mt-4 mr-20">
        <div className="mr-4">
          <p className="text-2xl font-medium">Total Price: <span className="text-blue-600 font-semibold">{totalPrice} USD</span></p>
        </div>
        <button
          onClick={() => handlePlaceOrder(userId)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
          Checkout
        </button>
      </div>
      <ToastContainer />
    </>

  )
}

export default Cart