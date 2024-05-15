import Loading from '@/components/loading'
import { IOrder } from '@/components/orders/order_row'
import OrdersTable from '@/components/orders/orders_table'
import { DB_BASE_LINK } from '@/constants'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'

const Orders = () => {

  const [orders, setOrders] = useState<IOrder[] | undefined>(undefined)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/orders`).then(res => res.json()).then(data => setOrders(data.orders))
  }, []);



  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-3xl text-black">Orders</h1>
        <div className="flex w-full justify-end">
          <Link
            href='/orders/edit'
            className="p-2 bg-black transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-gray-800">
            <FaPlus size={22} />
            <p>Add</p>
          </Link>
        </div>
      </div>
      {orders ? <OrdersTable orders={orders as IOrder[]} />
        : <div className="mx-auto">
          <Loading />
        </div>}
    </>
  )
}

export default Orders