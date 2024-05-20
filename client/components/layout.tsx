import React, { ReactNode } from 'react'
import Navbar from './navbar'
import { IEmployee } from './employees/employee_row'

interface LayoutProps {
    setEmp: React.Dispatch<React.SetStateAction<IEmployee | undefined>>
    currEmp: IEmployee | undefined
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ setEmp, currEmp, children }) => {
    return (
        <div className="fixed flex w-full h-full bg-white">
            <div className="h-full  w-1/5 bg-gray-900 p-3 rounded-r-xl shadow-2xl">
                <Navbar setEmp={setEmp} currEmp={currEmp} />
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