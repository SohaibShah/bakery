import { IEmployee } from '@/components/employees/employee_row';
import Loading from '@/components/loading';
import NotPermitted from '@/components/not_permitted';
import { DB_BASE_LINK, LOCAL_USER } from '@/constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Employee = () => {
    const router = useRouter();

    const [permission, setPermission] = useState(false)

    const [employee, setEmployee] = useState<IEmployee | undefined>(undefined)
    const [loading, setLoading] = useState(true);


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

    useEffect(() => {
        if (router.query.id) {
            fetch(`${DB_BASE_LINK}/employee?id=${router.query.id}`).then(res => res.json()).then(data => setEmployee(data.employee))
            setLoading(false)
        }
    }, [router.query.id])

    if (!permission) return (
        <NotPermitted />
    )

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