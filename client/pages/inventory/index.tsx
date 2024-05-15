import { IInventoryItem } from '@/components/inventory/inventory_row';
import InventoryTable from '@/components/inventory/inventory_table';
import Loading from '@/components/loading';
import { DB_BASE_LINK } from '@/constants';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa';

const Inventory = () => {
  const [inventory, setInventory] = useState<IInventoryItem[] | undefined>(undefined)

  useEffect (() => {
    fetch(`${DB_BASE_LINK}/inventory`).then(res => res.json()).then(data => setInventory(data.inventory))
  }, [])

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-3xl text-black">Inventory</h1>
        <div className="flex w-full justify-end">
          <Link
            href='/inventory/edit'
            className="p-2 bg-black transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-gray-800">
            <FaPlus size={22} />
            <p>Add</p>
          </Link>
        </div>
      </div>
      { inventory ? <InventoryTable inventory={inventory as IInventoryItem[]}/>
      : <div className="mx-auto">
        <Loading />
      </div>}
    </>
  )
}

export default Inventory