import { ICustomer } from '@/components/customers/customer_row';
import Loading from '@/components/loading';
import { DB_BASE_LINK } from '@/constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Customer = () => {
    const router = useRouter();

    const [customer, setCustomer] = useState<ICustomer | undefined>(undefined)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.query.id) {
            fetch(`${DB_BASE_LINK}/customer?id=${router.query.id}`).then(res => res.json()).then(data => setCustomer(data.customer))
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
                    : <> Customer: {customer?.CustomerID} </>
            }
        </>
    )
}

export default Customer