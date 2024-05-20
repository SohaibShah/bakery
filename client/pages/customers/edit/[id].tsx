import { ICustomer } from '@/components/customers/customer_row'
import ElevatedPlate from '@/components/general/elevated_plate'
import Loading from '@/components/loading'
import { DB_BASE_LINK } from '@/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa'

const EditCustomer = () => {

  const router = useRouter()
  const [customer, setCustomer] = useState<ICustomer>()

  const [customerName, setCustomerName] = useState("")
  const [contact, setContact] = useState("")

  const [loading, setLoading] = useState(false)
  const [doneButtonLocked, setDoneButtonLocked] = useState(false)
  const [error, setError] = useState("")
  const [posted, setPosted] = useState("")

  const defaultError = "Please ensure all values have been correctly entered!"
  const customerNotFoundError = "Customer not found!"

  useEffect(() => {
    if (router.query.id) {
      setLoading(true)
      fetch(`${DB_BASE_LINK}/customer?id=${router.query.id}`).then(res => res.json())
        .then(data => {
          if (data.customer) setCustomer(data.customer)
          else if (data.error) setError(data.error)
          else setError(customerNotFoundError)
        })
      setLoading(false)
    }
  }, [router.query.id])

  useEffect(() => {
    if (customer) {
      setLoading(true)
      setCustomerName(customer.Cname)
      setContact(customer.Contact)
      setLoading(false)
    }
  }, [customer])

  const handleCustomerDelete = () => {
    if (customer) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customer.CustomerID })
      }

      fetch(`${DB_BASE_LINK}/customer`, orderRequestOptions).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        if (!response.ok) {
          const error = (data && data.error) || response.status;
          return Promise.reject(error);
        }

        setPosted(data.message)
        await new Promise(res => setTimeout(res, 2000))
        router.push('/customers')
      })
        .catch(err => setError(err))
    }
  }

  const handleCustomerDone = (e: any) => {
    if (contact !== "" && customerName !== "" && contact.length === 11 && /^(03\d{9})$/.test(contact)) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID: customer ? customer.CustomerID : undefined,
          Cname: customerName,
          Contact: contact,
        })
      }

      fetch(`${DB_BASE_LINK}/customers/add`, orderRequestOptions).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        if (!response.ok) {
          const error = (data && data.error) || response.status;
          return Promise.reject(error);
        }

        setPosted(data.message)
        await new Promise(res => setTimeout(res, 1000))
        router.back()
      })
        .catch(error => {
          setError(error)
        });
    } else {
      setError(defaultError)
    }
  }

  return (
    <>
      <h1 className="font-bold text-3xl text-black">{customer ? 'Edit Customer' : 'Add Customer'}</h1>

      <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error.length && 'hidden'}`}>
        <FaExclamationCircle size={32} />
        <p className='my-auto'>{error}</p>
      </div>
      {!loading && error !== customerNotFoundError ?
        <div className="w-full flex flex-col gap-4">
          <ElevatedPlate>
            <div className="flex flex-col w-full gap-3">
              <h2 className="font-bold">Information</h2>
              <div className="flex justify-between">
                <p className="my-auto">Customer Name</p>
                <input type="text"
                  className="px-2 basis-1/2 outline outline-gray-400 focus:outline-blue-500 focus:outline-2 outline-1 h-8 rounded-lg w-full hover:scale-[1.05] focus:scale-[1.05] transition-all"
                  value={customerName}
                  onChange={e => { e.preventDefault; setCustomerName(e.target.value) }}
                />
              </div>
              <div className="flex justify-between">
                <p className="mt-1">Customer Contact Number</p>
                <input type="tel"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none px-2 basis-1/2 outline outline-gray-400 focus:outline-blue-500 focus:outline-2 outline-1 h-8 rounded-lg w-full hover:scale-[1.05] focus:scale-[1.05] transition-all"
                  value={contact}
                  onChange={e => { e.preventDefault; setContact(e.target.value) }}
                />
              </div>
            </div>
          </ElevatedPlate>

          <div className="w-full flex gap-4 justify-end">
            {customer && !doneButtonLocked &&
              <div
                onClick={(e) => { if (!doneButtonLocked) handleCustomerDelete() }}
                className="p-2 bg-red-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-red-400">
                <>
                  <FaTrash size={22} />
                  <p>Delete</p>
                </>
              </div>
            }
            <div
              onClick={(e) => { if (!doneButtonLocked) handleCustomerDone(e) }}
              className="p-2 bg-green-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-green-400">
              {!doneButtonLocked ? <>
                <FaCheck size={22} />
                <p>Done</p></>
                : <Loading />}
            </div>
          </div>

          <div className={`w-full flex custom_undershadow gap-3 bg-green-600 p-3 text-white rounded-lg ${!posted && 'hidden'}`}>
            <FaCheckCircle size={32} />
            <p className='my-auto'>{posted}</p>
          </div>
        </div>
        : <div className="mx-auto"><Loading /></div>
      }
    </>
  )
}

export default EditCustomer