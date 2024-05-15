import { IEmployee } from '@/components/employees/employee_row';
import Loading from '@/components/loading';
import { DB_BASE_LINK } from '@/constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Employee = () => {
    const router = useRouter();

    const [employee, setEmployee] = useState<IEmployee | undefined>(undefined)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.query.id) {
            fetch(`${DB_BASE_LINK}/employee?id=${router.query.id}`).then(res => res.json()).then(data => setEmployee(data.employee))
            setLoading(false)
        }
    }, [router.query.id])
    return (
        <>
            {
                loading ?
                    <div className="mx-auto">
                        <Loading />
                    </div>
                    : <> Employee: {employee?.EmpID} </>
            }
        </>
    )
}

export default Employee