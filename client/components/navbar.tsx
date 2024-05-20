import React from 'react'
import Link from 'next/link'
import { APP_NAME } from '../constants'
import { FaShoppingCart, FaBoxOpen, FaClipboardList, FaUserFriends, FaUser, FaDoorOpen } from 'react-icons/fa'
import { IEmployee } from './employees/employee_row'
import { FaDoorClosed } from 'react-icons/fa6'

const menuItems = [
    { text: "Orders", link: "/orders", icon: <FaShoppingCart />, mgrOnly: false },
    { text: "Products", link: "/products", icon: <FaBoxOpen />, mgrOnly: false },
    { text: "Inventory", link: "/inventory", icon: <FaClipboardList />, mgrOnly: false },
    { text: "Customers", link: "/customers", icon: <FaUserFriends />, mgrOnly: false },
    { text: "Employees", link: "/employees", icon: <FaUser />, mgrOnly: true },
]

interface NavbarProps {
    setEmp: React.Dispatch<React.SetStateAction<IEmployee | undefined>>
    currEmp: IEmployee | undefined
}

const Navbar: React.FC<NavbarProps> = ({ setEmp, currEmp }) => {
    return (
        <>
            <Link href='/' className="font-bold text-gray-100 text-2xl hover:text-gray-400 transition-all">{APP_NAME}</Link>
            <div className="h-full pb-9 flex flex-col justify-between">
                <div className='mt-10 flex flex-col'>
                    {menuItems.map((item) => {
                        if (!item.mgrOnly || (item.mgrOnly && currEmp?.EmpRole === 'Manager'))
                        return <Link
                            key={item.text}
                            href={item.link}
                            className='pb-8 text-lg text-gray-300 hover:text-xl transition-all'
                        >
                            <div className="flex gap-2">
                                {item.icon}
                                {item.text}
                            </div>
                        </Link>
                    })}
                </div>
                <div
                    onClick={() => { setEmp(undefined) }}
                    className="p-3 mx-2 mt-auto justify-center bg-blue-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-blue-400">
                    <>
                        <p className='text-xl'>Log out</p>
                        <FaDoorOpen size={25} />
                    </>
                </div>
            </div>
        </>
    )
}

export default Navbar