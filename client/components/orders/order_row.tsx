import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ICustomer } from '../customers/customer_row';
import { DB_BASE_LINK } from '@/constants';
import Loading from '../loading';

export interface IOrder {
  OrderID: number;
  CustomerID: number;
  OrderDate: string;
  Status: string;
}

const OrderRow = ({ myProps }: any) => {
  const { OrderID, CustomerID, OrderDate, Status } = myProps

  const [customer, setCustomer] = useState<ICustomer | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/customer?id=${CustomerID}`).then(res => res.json()).then(data => setCustomer(data.customer))
    setLoading(false)
  }, [CustomerID])

  return (
    <div className='flex flex-col p-3 my-2 rounded-lg outline-double outline-1 outline-black bg-white hover:cursor-pointer hover:scale-[1.05] transition-all'>
      {!loading ?
        <Link
          className='flex gap-3 text-left'
          href={`/orders/edit/${OrderID}`}
        >
          <p className='basis-1/4'>{`${OrderID}`}</p>
          <div className="basis-1/4">
            <Link href={`/customers/edit/${CustomerID}`}
              className='hover:text-blue-500'>
              {`${customer?.Cname}`}
            </Link>
          </div>
          <p className='basis-1/2'>{`${OrderDate}`}</p>
          <p className='basis-1/2'>{`${Status}`}</p>
        </Link>
        : <div className="mx-auto">
          <Loading />
        </div>
      }
    </div>
  )
}

export default OrderRow