import Link from 'next/link';
import React from 'react'

export interface IProduct {
  ProductID: number;
  Pname: string;
  Pdesc: string
}

const ProductRow = ({ myProps }: any) => {
  const { ProductID, Pname, Pdesc } = myProps

  return (
    <div className='flex flex-col p-3 my-2 rounded-lg outline-double outline-1 outline-black bg-white hover:cursor-pointer hover:scale-[1.05] transition-all'>
      <Link 
        className='flex gap-3 text-left'
        href={`/products/edit/${ProductID}`}
      >
        <p className='basis-1/6'>{`${ProductID}`}</p>
        <p className='basis-2/6'>{`${Pname}`}</p>
        <p className='basis-3/6'>{`${Pdesc}`}</p>
      </Link>
    </div>
  )
}

export default ProductRow