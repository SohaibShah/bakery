import ElevatedPlate from '@/components/general/elevated_plate'
import Loading from '@/components/loading'
import { IProduct } from '@/components/products/product_row'
import { DB_BASE_LINK } from '@/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa'

const EditProduct = () => {

  const router = useRouter()
  const [product, setProduct] = useState<IProduct>()
  const [error, setError] = useState("")

  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")

  const [loading, setLoading] = useState(false)
  const [doneButtonLocked, setDoneButtonLocked] = useState(false)
  const [posted, setPosted] = useState("")

  const defaultError = "Please ensure all values have been correctly entered!"
  const cannotFindError = "The product does not exist!"

  useEffect(() => {
    if (router.query.id) {
      setLoading(true)
      fetch(`${DB_BASE_LINK}/product?id=${router.query.id}`).then(res => res.json()).then(data => {
        if (data.product) setProduct(data.product)
        else if (data.error) setError(data.error)
        else setError(cannotFindError);
      })
      setLoading(false)
    }
  }, [router.query.id])

  useEffect(() => {
    if (product && !error) {
      setLoading(true)
      setError("")
      setProductName(product.Pname)
      setProductDesc(product.Pdesc)
      setLoading(false)
    }
  }, [product, error])

  const handleProductDelete = () => {
    if (product) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.ProductID
        })
      }

      fetch(`${DB_BASE_LINK}/product`, orderRequestOptions).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        if (!response.ok) {
          const error = (data && data.error) || response.status;
          return Promise.reject(error);
        }

        setPosted(data.message)
        await new Promise(res => setTimeout(res, 2000))
        router.push('/products')
      })
        .catch(err => setError(err))
    }
  }

  const handleProductDone = (e: any) => {
    if (productDesc != "" && productName != "") {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ProductID: product ? product.ProductID : undefined,
          Pname: productName,
          Pdesc: productDesc, 
        })
      }

      fetch(`${DB_BASE_LINK}/products/add`, orderRequestOptions).then(async response => {
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
          setError(error)
        })
    } else {
      setError(defaultError)
    }
  }

  return (
    <>
      <h1 className="font-bold text-3xl text-black">{product ? 'Edit Product' : 'Add Product'}</h1>

      <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error.length && 'hidden'}`}>
        <FaExclamationCircle size={32} />
        <p className='my-auto'>{error}</p>
      </div>
      {!loading && error !== cannotFindError ?
        <div className="w-full flex flex-col gap-4">
          <ElevatedPlate>
            <div className="flex flex-col w-full gap-3">
              <h2 className="font-bold">Information</h2>
              <div className="flex justify-between">
                <p className="my-auto">Product Name</p>
                <input type="text"
                  className="px-2 basis-1/2 outline outline-gray-400 focus:outline-blue-500 focus:outline-2 outline-1 h-8 rounded-lg w-full hover:scale-[1.05] focus:scale-[1.05] transition-all"
                  value={productName}
                  onChange={e => { e.preventDefault; setProductName(e.target.value) }}
                />
              </div>
              <div className="flex justify-between">
                <p className="mt-1">Product Description</p>
                <textarea
                  className="px-2 resize-none basis-1/2 outline outline-gray-400 focus:outline-blue-500 focus:outline-2 outline-1 rounded-lg w-full hover:scale-[1.05] focus:scale-[1.05] transition-all"
                  rows={3}
                  value={productDesc}
                  onChange={e => { e.preventDefault; setProductDesc(e.target.value) }}
                />
              </div>
            </div>
          </ElevatedPlate>

          <div className="w-full flex gap-4 justify-end">
            {product && !doneButtonLocked &&
              <div
                onClick={() => { if (!doneButtonLocked) handleProductDelete() }}
                className="p-2 bg-red-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-red-400">
                <>
                  <FaTrash size={22} />
                  <p>Delete</p>
                </>
              </div>
            }
            <div
              onClick={(e) => { if (!doneButtonLocked) handleProductDone(e) }}
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

export default EditProduct