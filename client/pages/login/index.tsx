import { IEmployee } from '@/components/employees/employee_row'
import Loading from '@/components/loading'
import { DB_BASE_LINK } from '@/constants'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import { useWindowSize } from 'react-use'

interface LoginPageProps {
    setEmp: React.Dispatch<React.SetStateAction<IEmployee | undefined>>
}

const Login: React.FC<LoginPageProps> = ({ setEmp }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [doneButtonLocked, setDoneButtonLocked] = useState(false)

    const [error, setError] = useState('')

    const handleLoginDone = () => {
        if (username.length && password.length) {
            setError('')
            setDoneButtonLocked(true)

            const loginRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            }
            fetch(`${DB_BASE_LINK}/login`, loginRequestOptions).then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                if (!response.ok) {
                    const error = (data && data.error) || response.status;
                    return Promise.reject(error);
                }

                if (data.employee) setEmp(data.employee)
                else setError('Could not get data!')
            })
                .catch(err => {
                    setError(err)
                    setDoneButtonLocked(false)
                })
        } else {
            setError('Enter both username and password!')
            setDoneButtonLocked(false)
        }
    }

    return (
        <div className="absolute w-full h-full flex flex-col items-center justify-center bg-black">
            <Image className='fixed opacity-40' src={'/background.jpg'} alt={'LOL'} height={1080} width={1920} />
            <div
                className="w-[400px] bg-white opacity-100 p-8 rounded-lg z-10 flex flex-col">
                <h1 className='font-bold text-3xl text-center'>Login</h1>
                <div className="flex flex-col gap-2 mt-4 h-full">

                    <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error && 'hidden'}`}>
                        <FaExclamationCircle size={32} />
                        <p className='my-auto'>{error}</p>
                    </div>
                    <p className="font-bold">Username</p>
                    <input
                        type='text'
                        className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none h-10 w-full outline outline-1 rounded-lg px-2 outline-gray-400 focus:outline-blue-500 focus:outline-2'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <p className="font-bold mt-3">Password</p>
                    <input
                        type='password'
                        className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none h-10 w-full outline outline-1 rounded-lg px-2 outline-gray-400 focus:outline-blue-500 focus:outline-2'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={(e) => { if (!doneButtonLocked) handleLoginDone() }}
                        className="p-3 mt-5 justify-center bg-blue-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-blue-400">
                        {!doneButtonLocked ? <>
                            <p className='text-xl'>Login</p>
                            {/* <FaArrowRight size={25} /> */}
                        </>
                            : <Loading />}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login