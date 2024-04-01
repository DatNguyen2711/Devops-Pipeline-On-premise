import React, { useEffect, useState } from 'react'
import Header from './Header'
import authApi from '../../utils/authApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MedicineDisplay() {
  const [medicines, setMedicines] = useState([]);
  const [quantities, setQuantities] = useState(Array(medicines.length).fill(0));
  var userId = localStorage.getItem('userId');
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (index, amount) => {
    const newQuantities = [...quantities];
    newQuantities[index] += amount;
    if (isNaN(newQuantities[index]) || newQuantities[index] < 1) {
      newQuantities[index] = 1;
    }
    setQuantities(newQuantities);
  };

  const fetchProducts = async () => {
    try {
      const response = await authApi.get("/Medicine/GetAllMedicines");
      if (response.status === 200) {
        setMedicines(response.data);
      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  };
  const AddToCart = async (userId, medicineId, quantity) => {
    try {
      const response = await authApi.post(`/Cart/AddToCart?userId=${userId}&medicineId=${medicineId}&quantity=${quantity}`);
      if (response.status === 200) {
        toast.success("Add to cart successfully")
      } else {
        toast.error("Add to cart failed: " + response.status)

        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error while fetching medicines:", error);
    }
  }
  return (
    <>
      <Header />
      <h1 className='text-center text-xl-center font-semibold text-3xl mt-6'>Our Products</h1>
      <div className="flex flex-wrap justify-center mt-6 ">
        {medicines.filter(item => item.status === 1 && (!item.expDate || new Date(item.expDate) > new Date())).map((item, index) => (
          <div class="w-80 max-w-sm bg-white rounded-lg shadow-2xl m-10">
            <a href="#">
              <img
                className="p-8 border-spacing-x-0 rounded-xl w-[288px] h-[288px] border-gray-300"
                src={item.imageUrl}
                alt="product image"
              />
            </a>
            <div className="px-5 pb-5">
              <a href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {item.name}
                </h5>
              </a>
              <p class="text-left rtl:text-right text-gray-500 dark:text-gray-400">{item.manufacturer}</p>
              <div className="flex items-center mt-2.5 mb-5">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                  5.0
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-3">
                <button
                  className="text-gray-500 dark:text-gray-400 focus:outline-none"
                  onClick={() => handleQuantityChange(index, -1)}
                >
                  <svg
                    className="w-4 h-4 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-semibold text-gray-600 dark:text-white">{quantities[index]}</span>
                <button
                  className="text-gray-500 dark:text-gray-400 focus:outline-none"
                  onClick={() => handleQuantityChange(index, 1)}
                >
                  <svg
                    className="w-4 h-4 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg  font-semibold text-gray-600 dark:text-white">
                  ${item.unitPrice}
                </span>
                <button onClick={() => AddToCart(userId, item.id, quantities[index])} className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
        <ToastContainer />
      </div>
    </>
  )
}

export default MedicineDisplay