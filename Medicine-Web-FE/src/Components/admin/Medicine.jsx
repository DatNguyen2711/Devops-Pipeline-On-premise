import React, { useEffect, useState } from 'react'
import AdminHeader from './AdminHeader'
import authApi from '../../utils/authApi';
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Medicine() {

  // chỗ này để edit add + data trả về
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [name, setMedicineName] = useState('')
  const [manufacturer, setManufacture] = useState('')
  const [unitPrice, setUnitPrice] = useState(null)
  const [discount, setDiscount] = useState(null)
  const [quantity, setQuantity] = useState(null)
  const [expDate, setExpDate] = useState('')
  const [imageUrl, setImage] = useState('')
  const [fileName, setFileName] = useState("");


  // chỗ này chứa mấy cái thuộc tính để edit trong modal
  const [nameEdit, setMedicineNameEdit] = useState('')
  const [manufacturerEdit, setManufactureEdit] = useState('')
  const [unitPriceEdit, setUnitPriceEdit] = useState(0)
  const [discountEdit, setDiscountEdit] = useState(0)
  const [quantityEdit, setQuantityEdit] = useState(0)
  const [expDateEdit, setExpDateEdit] = useState('')
  const [imageUrlEdit, setImageEdit] = useState('')

  const [nameSearch, setNameSearch] = useState('')
  useEffect(() => {
    fetchMedicines();
  }, []);


  const handleImageUpload = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  const fetchMedicines = async () => {
    try {
      const response = await authApi.get("/Medicine/GetAllMedicines");
      if (response.status === 200) {
        setMedicines(response.data);
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  const AddNewMedicine = async () => {
    if (!name || !manufacturer || !unitPrice || !quantity || !expDate || !imageUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isNaN(parseFloat(unitPrice)) || isNaN(parseFloat(quantity)) || isNaN(parseFloat(discount))) {
      toast.error("Please enter valid numbers for Unit Price, Quantity, and Discount");
      return;
    }

    const currentDate = new Date();
    const inputDate = new Date(expDate);

    // Kiểm tra xem ngày hết hạn có nhỏ hơn hoặc bằng ngày hiện tại không
    if (inputDate <= currentDate) {
      toast.error("Expiration date must be later than today");
      return;
    }

    await authApi.post("/Medicine/CreateNewMedicine", {
      name: name,
      manufacturer: manufacturer,
      unitPrice: unitPrice,
      discount: discount,
      quantity: quantity,
      expDate: expDate,
      imageUrl: imageUrl
    })
      .then(res => {
        console.log(res);
        toast.success("Add Successful")
        fetchMedicines();
        setFileName('')
        setImage('')
        setExpDate('')
        setManufacture('')
        setMedicineName('')
        setQuantity('')
        setUnitPrice('')
        setDiscount('')
      }).catch(err => {
        console.log(err);
        toast.error("Add failed")
      });
  }


  const setEditMedicine = (medicineId) => {
    const editMedicine = medicines.find(medicine => medicine.id === medicineId);
    setMedicineNameEdit(editMedicine.name)
    setManufactureEdit(editMedicine.manufacturer)
    setExpDateEdit(editMedicine.expDate)
    setQuantityEdit(editMedicine.quantity)
    setDiscountEdit(editMedicine.discount)
    setUnitPriceEdit(editMedicine.unitPrice)
    setImageEdit(editMedicine.imageUrl)
  }
  const handEditMedicine = async (medicineId) => {
    if (!nameEdit || !manufacturerEdit || !unitPriceEdit || !quantityEdit || !expDateEdit || !imageUrlEdit) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isNaN(parseFloat(unitPriceEdit)) || isNaN(parseFloat(quantityEdit)) || isNaN(parseFloat(discountEdit))) {
      toast.error("Please enter valid numbers for Unit Price, Quantity, and Discount");
      return;
    }

    const currentDate = new Date();
    const inputDate = new Date(expDateEdit);

    // Kiểm tra xem ngày hết hạn có nhỏ hơn hoặc bằng ngày hiện tại không
    if (inputDate <= currentDate) {
      toast.error("Expiration date must be later than today");
      return;
    }

    await authApi.put("/Medicine/UpdateMedicine/" + medicineId, {
      name: medicineNameEdit,
      manufacturer: manufactureEdit,
      unitPrice: unitPriceEdit,
      discount: discountEdit,
      quantity: quantityEdit,
      expDate: expDateEdit,
      imageUrl: imageUrlEdit
    })
      .then(res => {
        console.log(res);
        toast.success("Update Successful");
        setShowModal(false);
        fetchMedicines();
        setFileName('');
        setImage('');
        setExpDate('');
        setManufacture('');
        setMedicineName('');
        setQuantity('');
        setUnitPrice('');
        setDiscount('');

        setMedicineNameEdit('');
        setManufactureEdit('');
        setExpDateEdit('');
        setQuantityEdit('');
        setDiscountEdit('');
        setUnitPriceEdit('');
        setImageEdit('');
      }).catch(err => {
        console.log(err);
      });
  };

  const handleDeleteMedicine = async (medicineId) => {
    await authApi.put("/Medicine/DeleteMedicine/" + medicineId)
      .then(res => {
        console.log(res);
        toast.success("Delete Successful")
        fetchMedicines();
      }).catch(err => {
        console.log(err);
      });
  };
  return (
    <>
      <AdminHeader />
      <h1 className='text-center font-semibold text-3xl mt-9'>
        Medicine Management
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

        <div class="grid gap-6 mb-6 md:grid-cols-3">


          <input value={name} onChange={(e) => setMedicineName(e.target.value)} type="text" id="product_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Product name" required />

          <input value={manufacturer} onChange={(e) => setManufacture(e.target.value)} type="text" id="manufacture" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Manufacture" required />

          <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} type="number" id="unitPrice" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Unit Price" required />

          <input value={discount} onChange={(e) => setDiscount(e.target.value)} type="number" id="discount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Discount" required />

          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" id="quantity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Quantity" required />

          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              id="expdate"
              datepicker=""
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              datepicker-title="Flowbite datepicker"
              type="date"
              className="bg-gray-50 border w-[520px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
            />
          </div>
          <input
            onChange={handleImageUpload}
            className="block w-full py-2 px-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:placeholder-gray-400"
            id="file_input"
            type="file"
          />

          <button onClick={AddNewMedicine} type="button" class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>

          <div className="relative">
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
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-[520px] block p-2 ps-10 text-sm text-gray-900 border border-blue-700 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for medicines"
            />
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
              <th scope="col" className="px-6 py-3 text-base">
                Product name
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Manufacturer
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Discount
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Expire Date
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-base">
                Image
              </th>

            </tr>

          </thead>
          <tbody>
            {medicines.filter(medicine => {
              if (!nameSearch || nameSearch.trim() === '') {
                return medicine.status === 1;
              } else {
                return medicine.status === 1 && medicine.name.toLowerCase().includes(nameSearch.trim().toLowerCase());
              }
            }).map((medicine, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                <th scope="row" className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="ps-3">
                    <div className="text-base font-semibold">{medicine.name}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{medicine.manufacturer}</td>
                <td className="px-6 py-4">{medicine.unitPrice}</td>
                <td className="px-6 py-4">{medicine.discount}</td>
                <td className="px-6 py-4">{medicine.quantity}</td>
                <td className="px-6 py-4">{medicine.expDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${medicine.quantity === 0 ? 'bg-red-500' : 'bg-green-500'} me-2`} />
                    {medicine.quantity === 0 ? 'Out of stock' : 'In Stock'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {medicine.imageUrl && (
                    <img
                      src={medicine.imageUrl}
                      className="w-16 md:w-32 max-w-full max-h-full"
                      alt="Apple iMac"
                    />
                  )}
                </td>
                <td className="px-6 py-4">{medicine.createdOn}</td>
                <td className="px-6 py-4">

                  <button
                    onClick={(e) => handleDeleteMedicine(medicine.id)}
                    className="font-semibold text-red-600 dark:text-blue-500 hover:underline">
                    Delete
                  </button>

                  <button
                    className="ml-10 font-semibold text-green-600 dark:text-blue-500 hover:underline">
                    <div>
                      <TERipple rippleColor="white">
                        <button
                          type="button"
                          className="inline-block rounded bg-green-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          onClick={() => {
                            setShowModal(true);
                            setEditMedicine(medicine.id)
                          }}
                        >
                          Edit
                        </button>
                      </TERipple>
                      {/* <!-- Modal --> */}
                      <TEModal show={showModal} setShow={setShowModal}>
                        <TEModalDialog>
                          <TEModalContent>
                            <TEModalHeader>
                              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                                Edit Medicine
                              </h5>
                              <button
                                type="button"
                                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </TEModalHeader>
                            <TEModalBody>
                              <div className="grid grid-cols-2 gap-4">
                                {/* Text input */}
                                <label htmlFor="medicineNameInput">Medicine Name:</label>
                                <input
                                value={name}
                                  id="medicineNameInput"
                                  type="text"
                                  onChange={(e) => setMedicineName(e.target.value)}
                                  placeholder="Medicine Name"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />
                                {/* Text input */}
                                <label htmlFor="manufacturerInput">Manufacturer:</label>
                                <input
                                  id="manufacturerInput"
                                  type="text"
                                  value={manufacturer}
                                  onChange={(e) => setManufacture(e.target.value)}
                                  placeholder="Manufacture"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />
                                {/* Number input */}
                                <label htmlFor="unitPriceInput">Unit Price:</label>
                                <input
                                  id="unitPriceInput"
                                  type="number"
                                  value={unitPrice}
                                  onChange={(e) => setUnitPrice(e.target.value)}
                                  placeholder="Unit Price"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />
                                {/* Number input */}
                                <label htmlFor="discountInput">Discount:</label>
                                <input
                                  id="discountInput"
                                  type="number"
                                  value={discount}
                                  onChange={(e) => setDiscount(e.target.value)}
                                  placeholder="Discount"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />
                                {/* Number input */}
                                <label htmlFor="quantityInput">Quantity:</label>
                                <input
                                  id="quantityInput"
                                  type="number"
                                  onChange={(e) => setQuantity(e.target.value)}
                                  placeholder="Quantity"
                                  value={quantity}
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />
                                {/* Datepicker */}
                                <label htmlFor="expDateInput">Expire Date:</label>
                                <input
                                  id="expDateInput"
                                  type="date"
                                  value={expDate}
                                  onChange={(e) => setExpDate(new Date(e.target.value).toISOString().split('T')[0])}
                                  placeholder="Expire Date"
                                  className="border text-gray-400 font-light border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-primary-500"
                                />

                                {/* File input */}
                                <label htmlFor="expDateInput">Image upload: </label>
                                <input
                                  id="fileInput"
                                  onChange={handleImageUpload}
                                  type="file"
                                  className="block p-2 text-sm text-gray-900 border border-blue-700 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                                  accept="image/*, .pdf, .doc, .docx"
                                />
                                <p className='text-gray-600'>
                                  {fileName && <p>Selected file: {fileName}</p>}
                                </p>
                              </div>
                            </TEModalBody>

                            <TEModalFooter>
                              <TERipple rippleColor="light">
                                <button
                                  type="button"
                                  className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                  onClick={() => setShowModal(false)}
                                >
                                  Close
                                </button>
                              </TERipple>
                              <TERipple rippleColor="light">
                                <button
                                  onClick={() => handEditMedicine(medicine.id)}
                                  className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                >
                                  Save changes
                                </button>
                              </TERipple>
                            </TEModalFooter>
                          </TEModalContent>
                        </TEModalDialog>
                      </TEModal>
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </>
  )
}

export default Medicine