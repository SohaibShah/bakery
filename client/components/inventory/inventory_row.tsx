import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IProduct } from '../products/product_row';
import { DB_BASE_LINK } from '@/constants';
import Loading from '../loading';

export interface IInventoryItem {
  InventoryID: number;
  ProductID: number;
  Quantity: number;
  DOE: string;
}

const InventoryRow = ({ myProps }: any) => {
  const { InventoryID, ProductID, Quantity, DOE } = myProps
  const [product, setProduct] = useState<IProduct | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/product?id=${ProductID}`).then(res => res.json()).then(data => setProduct(data.product))
    setLoading(false)
  }, [ProductID])

  return (
    <div className='flex flex-col p-3 my-2 rounded-lg outline-double outline-1 outline-black bg-white hover:cursor-pointer hover:scale-[1.05] transition-all'>
    {!loading ?
      <Link 
        className='flex gap-3 text-left'
        href={`/inventory/edit/${InventoryID}`}
      >
        <p className='basis-1/4'>{`${InventoryID}`}</p>
        <div className="basis-1/4">
            <Link href={`/products/edit/${ProductID}`}
              className='hover:text-blue-500'>
              {`${product?.Pname}`}
            </Link>
          </div>
        <p className='basis-1/2'>{`${Quantity}`}</p>
        <p className='basis-1/2'>{`${DOE}`}</p>
      </Link>
      : <div className="mx-auto">
        <Loading/>
      </div>
      }
    </div>
  )
}

export default InventoryRow