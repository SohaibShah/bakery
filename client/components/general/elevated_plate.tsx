import React from 'react'

const ElevatedPlate = ({ children }: any) => {
    return (
        <main className="p-5 rounded-xl bg-white custom_undershadow">
            {children}
        </main>
    )
}

export default ElevatedPlate