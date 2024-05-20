import { IEmployee } from '@/components/employees/employee_row'
import ElevatedPlate from '@/components/general/elevated_plate'
import Loading from '@/components/loading'
import NotPermitted from '@/components/not_permitted'
import { DB_BASE_LINK, LOCAL_USER } from '@/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Select from 'react-dropdown-select'
import { FaCheck, FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa'

const EditEmployee = () => {

  const [permission, setPermission] = useState(false)

  const router = useRouter()
  const [employee, setEmployee] = useState<IEmployee>()

  const [employeeName, setEmployeeName] = useState("")
  const [role, setRole] = useState("")

  const [loading, setLoading] = useState(false)
  const [doneButtonLocked, setDoneButtonLocked] = useState(false)
  const [error, setError] = useState("")
  const [posted, setPosted] = useState("")

  const defaultError = "Please ensure all values have been correctly entered!"
  const employeeNotFoundError = "Employee not found!"

  const possibleRoles = [
    { role: "Manager" },
    { role: "Cashier" },
    { role: "Chef" },
    { role: "Janitor" },
    { role: "Driver" },
  ]

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
      setLoading(true)
      fetch(`${DB_BASE_LINK}/employee?id=${router.query.id}`).then(res => res.json())
        .then(data => {
          if (data.employee) setEmployee(data.employee)
          else if (data.error) setError(data.error)
          else setError(employeeNotFoundError)
          setLoading(false)
        })
    }
  }, [router.query.id])

  useEffect(() => {
    if (employee) {
      setLoading(true)
      setEmployeeName(employee.EmpName)
      setRole(employee.EmpRole)
      setLoading(false)
    }
  }, [employee])

  const handleEmployeeDelete = () => {
    if (employee) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: employee.EmpID })
      }

      fetch(`${DB_BASE_LINK}/employee`, orderRequestOptions).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        if (!response.ok) {
          const error = (data && data.error) || response.status;
          return Promise.reject(error);
        }

        setPosted(data.message)
        console.log(data.message)
        await new Promise((res) => setTimeout(res, 2000))
        router.push('/employees')
      })
        .catch(error => {
          console.error(error)
          setError(error)
        })
    }
  }

  const handleEmployeeDone = (e: any) => {
    if (role !== "" && employeeName !== "") {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EmpID: employee?.EmpID ? employee.EmpID : undefined,
          EmpName: employeeName,
          EmpRole: role,
        })
      }

      fetch(`${DB_BASE_LINK}/employees/add`, orderRequestOptions).then(async response => {
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

  if (!permission) return (
    <NotPermitted />
  )

  return (
    <>
      <h1 className="font-bold text-3xl text-black">{employee ? "Edit Employee" : "Add Employee"}</h1>

      <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error && 'hidden'}`}>
        <FaExclamationCircle size={32} />
        <p className='my-auto'>{error}</p>
      </div>
      {!loading ?
        <div className="w-full flex flex-col gap-4">
          <ElevatedPlate>
            <div className="flex flex-col w-full gap-3">
              <h2 className="font-bold">Information</h2>
              <div className="flex justify-between">
                <p className="my-auto">Employee Name</p>
                <input type="text"
                  className="px-2 basis-1/2 outline outline-gray-400 focus:outline-blue-500 focus:outline-2 outline-1 h-8 rounded-lg w-full hover:scale-[1.05] focus:scale-[1.05] transition-all"
                  value={employeeName}
                  onChange={e => { e.preventDefault; setEmployeeName(e.target.value) }}
                />
              </div>
              <div className="flex justify-between">
                <p className="basis-1/2 mt-1">Employee Role</p>
                <div className="basis-1/2">
                  <Select
                    className='basis-1/2'
                    style={{ borderRadius: '0.5rem' }}
                    values={employee ? [{ role: employee.EmpRole }] : []} options={possibleRoles} searchable={true} labelField='role' valueField='role' onChange={(role) => setRole(role[0].role)} />
                </div>
              </div>
            </div>
          </ElevatedPlate>

          <div className="w-full gap-4 flex justify-end">
            {employee && !doneButtonLocked &&
              <div
                onClick={(e) => { if (!doneButtonLocked) handleEmployeeDelete() }}
                className="p-2 bg-red-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-red-400">
                <>
                  <FaTrash size={22} />
                  <p>Delete</p>
                </>
              </div>
            }
            <div
              onClick={(e) => { if (!doneButtonLocked) handleEmployeeDone(e) }}
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

export default EditEmployee