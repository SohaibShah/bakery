import React from 'react'
import ElevatedPlate from '../general/elevated_plate';
import ProductRow, { IProduct } from './product_row';

export interface IProductList {
    products: IProduct[];
}
const ProductsTable = ({ products }: IProductList) => {
    return (
        <ElevatedPlate>
            <div className="flex gap-3 font-bold text-lg">
                <p className='basis-1/6'>Product ID</p>
                <p className='basis-2/6'>Name</p>
                <p className='basis-3/6'>Description</p>
            </div>
            <div>
                {
                    products.map((curr, idx) => (
                        <div key={idx}>
                            <ProductRow myProps={curr} />
                        </div>
                    ))
                }
            </div>
        </ElevatedPlate>
    )
}

export default ProductsTable