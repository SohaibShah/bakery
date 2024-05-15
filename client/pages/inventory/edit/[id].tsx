import ElevatedPlate from '@/components/general/elevated_plate'
import { IInventoryItem } from '@/components/inventory/inventory_row'
import Loading from '@/components/loading'
import { IProduct } from '@/components/products/product_row'
import { DB_BASE_LINK } from '@/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Select from 'react-dropdown-select'
import { FaCheck, FaCheckCircle, FaExclamationCircle, FaMinus, FaPlus, FaTrash } from 'react-icons/fa'

const EditInventory = () => {

    const router = useRouter()
    const [inventory, setInventory] = useState<IInventoryItem>()

    const [product, setProduct] = useState<IProduct | undefined>()
    const [quantity, setQuantity] = useState(0)

    const [products, setProducts] = useState<IProduct[] | undefined>()

    const [loading, setLoading] = useState(true)
    const [doneButtonLocked, setDoneButtonLocked] = useState(false)
    const [error, setError] = useState("")
    const [posted, setPosted] = useState("")

    const defaultError = "Please ensure all values have been correctly entered!"
    const cannotFindInventoryError = "The inventory entry does not exist!"
    const cannotFindProductsError = "Products could not be loaded!"

    useEffect(() => {
        setLoading(true)
        if (!products?.length)
            fetch(`${DB_BASE_LINK}/products`).then(res => res.json())
                .then(data => {
                    if (data.products) setProducts(data.products)
                    else if (data.error) setError(data.error)
                    else setError(cannotFindProductsError)
                })
                .catch(err => setError(err))
        if (router.query.id)
            fetch(`${DB_BASE_LINK}/inventory?id=${router.query.id}`).then(res => res.json())
                .then(data => {
                    if (data.inventory) setInventory(data.inventory)
                    else if (data.error) setError(data.error)
                    else setError(cannotFindInventoryError)
                })
        setLoading(false)
    }, [products, router.query.id])

    useEffect(() => {
        setLoading(true)
        if (inventory && products && !product) {
            var newProduct: IProduct | undefined;
            products.forEach(prod => {
                if (prod.ProductID === inventory.ProductID) newProduct = prod;
            })
            setProduct(newProduct ?? newProduct)
            setQuantity(inventory.Quantity)
        }
        setLoading(false)
    }, [inventory, products, product])

    const handleInventoryDelete = () => {
        if (inventory) {
            setError("")
            setDoneButtonLocked(true)

            const orderRequestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: inventory.InventoryID
                })
            }

            fetch(`${DB_BASE_LINK}/inventory`, orderRequestOptions).then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                if (!response.ok) {
                    const error = (data && data.error) || response.status;
                    return Promise.reject(error);
                }

                setPosted(data.message)
                await new Promise(res => setTimeout(res, 2000))
                router.push('/inventory')
            })
            .catch(err => setError(err))
        }
    }

    const handleInventoryDone = (e: any) => {
        if (product && quantity > 0) {
            setError("")
            setDoneButtonLocked(true)

            const orderRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    InventoryID: inventory ? inventory.InventoryID : undefined,
                    ProductID: product.ProductID,
                    Quantity: quantity,
                })
            }

            fetch(`${DB_BASE_LINK}/inventory/add`, orderRequestOptions).then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                if (!response.ok) {
                    const error = (data && data.error) || response.status;
                    return Promise.reject(error);
                }

                setPosted(data.message)
                setDoneButtonLocked(false)
            })
                .catch(error => {
                    setError(error);
                });
        } else {
            setError(defaultError)
        }
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0)
            setQuantity(newQuantity)
    }

    return (
        <>
            <h1 className="font-bold text-3xl text-black">{inventory ? 'Edit Inventory Item' : 'Add Inventory Item'}</h1>

            <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error.length && 'hidden'}`}>
                <FaExclamationCircle size={32} />
                <p className='my-auto'>{error}</p>
            </div>
            {!loading && error !== cannotFindInventoryError ?
                <div className="w-full flex flex-col gap-4">
                    <ElevatedPlate>
                        <div className="flex flex-col w-full">
                            <h2 className="font-bold">Product</h2>
                            {products && products.length && <Select options={products} onChange={val => setProduct(val[0])} valueField='Pname' labelField='Pname' values={product ? [product] : [] as IProduct[]} />}
                        </div>
                        <div className="flex justify-between gap-3 text-center mt-8">
                            <p className="text-left">Quantity</p>
                            <div className="flex gap-2 hover:scale-[1.25] transition-all">
                                <FaMinus size={20}
                                    className='hover:cursor-pointer hover:text-red-400'
                                    onClick={e => handleQuantityChange(quantity - 1)}
                                />
                                <input
                                    type='number'
                                    className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none w-14 outline outline-1 rounded-lg text-center outline-gray-400 focus:outline-blue-500 focus:outline-2'
                                    value={quantity}
                                    onChange={(e) => { handleQuantityChange(Number(e.target.value)) }}
                                />
                                <FaPlus size={20}
                                    className='hover:cursor-pointer hover:text-green-400'
                                    onClick={e => handleQuantityChange(quantity + 1)}
                                />
                            </div>
                        </div>
                    </ElevatedPlate>

                    <div className="w-full flex gap-4 justify-end">
                        {inventory && !doneButtonLocked &&
                            <div
                                onClick={(e) => { if (!doneButtonLocked) handleInventoryDelete() }}
                                className="p-2 bg-red-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-red-400">
                                <>
                                    <FaTrash size={22} />
                                    <p>Delete</p>
                                </>
                            </div>
                        }
                        <div
                            onClick={(e) => { if (!doneButtonLocked) handleInventoryDone(e) }}
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

export default EditInventory