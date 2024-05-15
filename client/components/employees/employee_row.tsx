import Link from 'next/link';
import React from 'react'

export interface IEmployee {
  EmpID: number;
  EmpName: string;
  EmpRole: string
}

const EmployeeRow = ({ myProps }: any) => {
  const { EmpID, EmpName, EmpRole } = myProps

  return (
    <div className='flex flex-col p-3 my-2 rounded-lg outline-double outline-1 outline-black bg-white hover:cursor-pointer hover:scale-[1.05] transition-all'>
      <Link 
        className='flex gap-3 text-left'
        href={`/employees/edit/${EmpID}`}
      >
        <p className='basis-1/6'>{`${EmpID}`}</p>
        <p className='basis-3/6'>{`${EmpName}`}</p>
        <p className='basis-2/6'>{`${EmpRole}`}</p>
      </Link>
    </div>
  )
}

export default EmployeeRow