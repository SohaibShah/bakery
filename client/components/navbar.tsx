import React from 'react'
import Link from 'next/link'
import { APP_NAME } from '../constants'
import { FaShoppingCart, FaBoxOpen, FaClipboardList, FaUserFriends, FaUser } from 'react-icons/fa'

const menuItems = [
    { text: "Orders", link: "/orders", icon: <FaShoppingCart/> },
    { text: "Products", link: "/products", icon: <FaBoxOpen/> },
    { text: "Inventory", link: "/inventory", icon: <FaClipboardList/> },
    { text: "Customers", link: "/customers", icon: <FaUserFriends/> },
    { text: "Employees", link: "/employees", icon: <FaUser/> },
]

const Navbar = () => {
    return (
        <>
            <Link href='/' className="font-bold text-gray-100 text-2xl hover:text-gray-400 transition-all">{APP_NAME}</Link>
            <div className='mt-10 flex flex-col'>
                {menuItems.map((item) => (
                    <Link
                        key={item.text}
                        href={item.link}
                        className='pb-8 text-lg text-gray-300 hover:text-xl transition-all'
                    >
                        <div className="flex gap-2">
                            {item.icon}
                            {item.text}
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Navbar