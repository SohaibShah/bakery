import React from 'react'
import ElevatedPlate from '../general/elevated_plate';
import OrderRow, { IOrder } from './order_row';

export interface IOrderList {
    orders: IOrder[];
}
const OrdersTable = ({ orders }: IOrderList) => {
    return (
        <ElevatedPlate>
            <div className="flex gap-3 font-bold text-lg">
                <p className='basis-1/4'>Order ID</p>
                <p className='basis-1/4'>Customer</p>
                <p className='basis-1/2'>Order Date</p>
                <p className='basis-1/2'>Order Status</p>
            </div>
            <div>
                {
                    orders.map((curr, idx) => (
                        <div key={idx}>
                            <OrderRow myProps={curr} />
                        </div>
                    ))
                }
            </div>
        </ElevatedPlate>
    )
}

export default OrdersTable