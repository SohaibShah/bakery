import React from 'react'

const NotPermitted = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-6xl">&#128683;</div>
      <div className="mt-5 text-2xl font-semibold text-center">
        {"You don't have permission to view this page."} <br /> {"It's not safe here."}
      </div>
      <div className="mt-3 text-lg text-gray-600">
        {"Hold tight, you're being redirected to safety!"}
      </div>
    </div>
  )
}

export default NotPermitted