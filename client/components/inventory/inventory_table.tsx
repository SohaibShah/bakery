import React from 'react'
import ElevatedPlate from '../general/elevated_plate';
import InventoryRow, { IInventoryItem } from './inventory_row';

export interface IInventoryList {
    inventory: IInventoryItem[];
}
const InventoryTable = ({ inventory } : IInventoryList) => {
  return (
    <ElevatedPlate>
        <div className="flex gap-3 font-bold text-lg">
            <p className='basis-1/4'>Inventory ID</p>
            <p className='basis-1/4'>Product</p>
            <p className='basis-1/2'>Quantity</p>
            <p className='basis-1/2'>Date of Entry</p>
        </div>
        <div>
        {
            inventory.map((curr, idx) => (
                <div key={idx}>                    
                <InventoryRow myProps={curr}/>
                </div>
            ))
        }
        </div>
    </ElevatedPlate>
  )
}

export default InventoryTable