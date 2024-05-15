import { ICustomer } from '@/components/customers/customer_row'
import CustomersTable from '@/components/customers/customers_table';
import Loading from '@/components/loading';
import { DB_BASE_LINK } from '@/constants';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa';

const Customers = () => {
  const [customers, setCustomers] = useState<ICustomer[] | undefined>(undefined)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/customers`).then(res => res.json()).then(data => setCustomers(data.customers))
  }, [])

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-3xl text-black">Customers</h1>
        <div className="flex w-full justify-end">
          <Link
            href='/customers/edit'
            className="p-2 bg-black transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-gray-800">
            <FaPlus size={22} />
            <p>Add</p>
          </Link>
        </div>
      </div>
      {customers ? <CustomersTable customers={customers as ICustomer[]} />
        : <div className="mx-auto">
          <Loading />
        </div>}
    </>
  )
}

export default Customers