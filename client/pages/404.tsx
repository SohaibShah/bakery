import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Custom404 = () => {

    const router = useRouter()

    useEffect(() => {
        const redirect = async () => {
            await new Promise(res => setTimeout(res, 5000));
            router.push('/')
        }

        redirect()
    })

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <div className="text-6xl">🚧</div>
            <div className="mt-5 text-2xl font-semibold text-center">
                {"Oops! You've hit a dead end."} <br /> {"This is not the page you're looking for."}
            </div>
            <div className="mt-3 text-lg text-gray-600">
                {"Hold tight, you're being redirected to safety!"}
            </div>
        </div>
    )
}

export default Custom404