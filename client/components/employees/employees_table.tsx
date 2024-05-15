import React from 'react'
import ElevatedPlate from '../general/elevated_plate';
import EmployeeRow, { IEmployee } from './employee_row';

export interface IEmployeeList {
    employees: IEmployee[];
}
const EmployeesTable = ({ employees }: IEmployeeList) => {
    return (
        <ElevatedPlate>
            <div className="flex gap-3 font-bold text-lg">
                <p className='basis-1/6'>Employee ID</p>
                <p className='basis-3/6'>Name</p>
                <p className='basis-2/6'>Role</p>
            </div>
            <div>
                {
                    employees.map((curr, idx) => (
                        <div key={idx}>
                            <EmployeeRow myProps={curr} />
                        </div>
                    ))
                }
            </div>
        </ElevatedPlate>
    )
}

export default EmployeesTable