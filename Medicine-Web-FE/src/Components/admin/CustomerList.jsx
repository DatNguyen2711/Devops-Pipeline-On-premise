import React, { useEffect, useState } from 'react'
import AdminHeader from './AdminHeader'
import authApi from '../../utils/authApi'

function CustomerList() {
  const [users, setUsers] = useState([]);
  const [nameSearch, setNameSearch] = useState('')

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authApi.get("/Admin/ViewUsers");
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await authApi.put("/Admin/BlockUser/" + userId);
      fetchUsers(); // Cập nhật danh sách người dùng sau khi block
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnBlockUser = async (userId) => {
    try {
      await authApi.put("/Admin/UnBlockUser/" + userId);
      fetchUsers(); // Cập nhật danh sách người dùng sau khi unblock
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };
  return (
    <>
      <AdminHeader />
      <h1 className='text-center font-semibold text-3xl mt-9'>
        Customer  Management
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">

          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
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
              placeholder="Search for users"
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
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email Address
              </th>
              <th scope="col" className="px-6 py-3">
                Fund
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Registration date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.filter(user => {
              if (!nameSearch || nameSearch.trim() === '') {
                return true;
              } else {
                return user.firstName.toLowerCase().includes(nameSearch.trim().toLowerCase());
              }
            }).map((user, index) => (
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
                    <div className="text-base font-semibold">{user.firstName}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.fund}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.status === 0 ? 'bg-red-500' : 'bg-green-500'} me-2`} />
                    {user.status === 0 ? 'Offline' : 'Online'}
                  </div>
                </td>
                <td className="px-6 py-4">{user.createdOn}</td>
                <td className="px-6 py-4">
                  {user.status === 0 ?
                    <button
                      onClick={() => handleUnBlockUser(user.id)}
                      className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">
                      Unblock
                    </button> :
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className="font-semibold text-red-600 dark:text-blue-500 hover:underline">
                      Block
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  )
}

export default CustomerList