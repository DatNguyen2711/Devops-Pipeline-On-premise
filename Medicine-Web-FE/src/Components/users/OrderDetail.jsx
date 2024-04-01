import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Header from './Header';
import authApi from '../../utils/authApi';
import * as XLSX from 'xlsx'; 

function OrderDetail() {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                const response = await authApi.get(`/Order/ViewOrderDetail/${id}`);
                setOrderDetail(response.data);

                const total = response.data.reduce((acc, item) => acc + item.totalPrice, 0);
                setTotalPrice(total);
            } catch (error) {
                console.log(error);
            }
        }
        getOrderDetail();
    }, [id]);

    // Hàm để xử lý xuất hóa đơn ra file Excel
    const handleExportToExcel = () => {
        const dataForExcel = orderDetail.map(item => {
            return {
                "Product Name": item.medicine.name,
                "Quantity": item.quantity,
                "Unit Price": item.unitPrice,
                "Discount": item.discount,
                "Total Price of this Product": item.totalPrice
            };
        });

        const totalPriceOfOrder = orderDetail.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        dataForExcel.push({
            "Product Name": "Total Price of Order",
            "Quantity": "",
            "Unit Price": "",
            "Discount": "",
            "Total Price of this Product": totalPriceOfOrder
        });

        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'OrderDetail');
        XLSX.writeFile(wb, 'order_detail.xlsx');
    };



    return (
        <>
            <Header />
            <h1 className='text-center text-3xl font-semibold mt-6'>Order Detail</h1>
            <div className="container mx-auto px-4 mt-10 items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300  border-b-gray-300">
                    <div className="px-6 py-4">
                        {orderDetail.map((item, index) => (
                            <div key={index} className="mb-4">
                                <div className="text-gray-700 text-base">
                                    <span className="font-semibold">Product Name:</span> {item.medicine.name}
                                </div>
                                <div className="text-gray-700 text-base">
                                    <span className="font-semibold">Quantity:</span> {item.quantity}
                                </div>
                                <div className="text-gray-700 text-base">
                                    <span className="font-semibold">Unit Price:</span> {item.unitPrice}
                                </div>
                                <div className="text-gray-700 text-base">
                                    <span className="font-semibold">Discount:</span> {item.discount}
                                </div>
                                <div className="text-gray-700 text-base">
                                    <span className="font-semibold">Total Price of this Product:</span> {item.totalPrice}
                                </div>
                            </div>
                        ))}
                        <div className="text-center text-2xl font-semibold mt-6 text-gray-500">
                            Total Price: {totalPrice}
                        </div>
                        <div className='text-center'>

                            <button onClick={handleExportToExcel} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">
                                Export to Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetail;
