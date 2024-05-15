import Loading from '@/components/loading';
import { IProduct } from '@/components/products/product_row';
import ProductsTable from '@/components/products/products_table';
import { DB_BASE_LINK } from '@/constants';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState<IProduct[] | undefined>(undefined)

  useEffect (() => {
    fetch(`${DB_BASE_LINK}/products`).then(res => res.json()).then(data => setProducts(data.products))
  }, [])

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-3xl text-black">Products</h1>
        <div className="flex w-full justify-end">
          <Link
            href='/products/edit'
            className="p-2 bg-black transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-gray-800">
            <FaPlus size={22} />
            <p>Add</p>
          </Link>
        </div>
      </div>
      { products ? <ProductsTable products={products as IProduct[]}/>
      : <div className="mx-auto">
        <Loading />
      </div>}
    </>
  )
}

export default Products