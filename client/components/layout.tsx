import React from 'react'
import Navbar from './navbar'

const Layout = ({ children }: any) => {
    return (
        <div className="fixed flex w-full h-full bg-white">
            <div className="h-full  w-1/5 bg-gray-900 p-3 rounded-r-xl shadow-2xl">
                <Navbar />
            </div>
            <main className="flex-1 p-5 overflow-auto">
                <div className='gap-4 w-full flex flex-col'>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout