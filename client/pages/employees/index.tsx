import { IEmployee } from '@/components/employees/employee_row';
import EmployeesTable from '@/components/employees/employees_table';
import Loading from '@/components/loading';
import NotPermitted from '@/components/not_permitted';
import { DB_BASE_LINK, LOCAL_USER } from '@/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa';

const Employees = () => {

  const [permission, setPermission] = useState(false)
  const router = useRouter()
  const [employees, setEmployees] = useState<IEmployee[] | undefined>(undefined)

  useEffect(() => {
    fetch(`${DB_BASE_LINK}/employees`).then(res => res.json()).then(data => setEmployees(data.employees))
  }, [])



  useEffect(() => {
    let user = localStorage.getItem(LOCAL_USER) || undefined
    if (user && user !== 'undefined') {
      let emp: IEmployee = JSON.parse(user)
      console.log("parsed: " + emp)
      if (emp.EmpRole === 'Manager') {
        setPermission(true)
      } else {
        setTimeout(() => router.push('/'), 3500)
      }
    }
  }, [router])

  if (!permission) return (
    <NotPermitted />
  )


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