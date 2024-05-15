import Link from 'next/link';
import React from 'react'

export interface ICustomer {
  CustomerID: number;
  Cname: string;
  Contact: string
}

const CustomerRow = ({ myProps }: any) => {
  const { CustomerID, Cname, Contact } = myProps

  return (
    <div className='flex flex-col p-3 my-2 rounded-lg outline-double outline-1 outline-black bg-white hover:cursor-pointer hover:scale-[1.05] transition-all'>
      <Link 
        className='flex gap-3 text-left'
        href={`/customers/edit/${CustomerID}`}
      >
        <p className='basis-1/6'>{`${CustomerID}`}</p>
        <p className='basis-3/6'>{`${Cname}`}</p>
        <p className='basis-2/6'>{`${Contact}`}</p>
      </Link>
    </div>
  )
}

export default CustomerRow