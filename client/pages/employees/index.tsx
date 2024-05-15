import { IEmployee } from '@/components/employees/employee_row';
import EmployeesTable from '@/components/employees/employees_table';
import Loading from '@/components/loading';
import { DB_BASE_LINK } from '@/constants';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa';

const Employees = () => {
  const [employees, setEmployees] = useState<IEmployee[] | undefined>(undefined)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/employees`).then(res => res.json()).then(data => setEmployees(data.employees))
  }, [])

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-3xl text-black">Employees</h1>
        <div className="flex w-full justify-end">
          <Link
            href='/employees/edit'
            className="p-2 bg-black transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-gray-800">
            <FaPlus size={22} />
            <p>Add</p>
          </Link>
        </div>
      </div>
      {employees ? <EmployeesTable employees={employees as IEmployee[]} />
        : <div className="mx-auto">
          <Loading />
        </div>}
    </>
  )
}

export default Employees