import React from 'react'
import ElevatedPlate from '../general/elevated_plate';
import CustomerRow, { ICustomer } from './customer_row';

export interface ICustomerList {
    customers: ICustomer[];
}
const CustomersTable = ({ customers }: ICustomerList) => {
    return (
        <ElevatedPlate>
            <div className="flex gap-3 font-bold text-lg">
                <p className='basis-1/6'>Customer ID</p>
                <p className='basis-3/6'>Name</p>
                <p className='basis-2/6'>Contact</p>
            </div>
            <div>
                {
                    customers.map((curr, idx) => (
                        <div key={idx}>
                            <CustomerRow myProps={curr} />
                        </div>
                    ))
                }
            </div>
        </ElevatedPlate>
    )
}

export default CustomersTable