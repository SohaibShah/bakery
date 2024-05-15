import { ICustomer } from '@/components/customers/customer_row'
import ElevatedPlate from '@/components/general/elevated_plate'
import { IInventoryItem } from '@/components/inventory/inventory_row'
import Loading from '@/components/loading'
import { IOrder } from '@/components/orders/order_row'
import { IProduct } from '@/components/products/product_row'
import { DB_BASE_LINK } from '@/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Select from 'react-dropdown-select'
import { FaCheck, FaCheckCircle, FaExclamationCircle, FaMinus, FaPlus, FaTrash } from 'react-icons/fa'

interface IProductQuantity {
  product: IProduct;
  quantity: number;
  pricePerUnit: number;
  inventory: number;
}

const EditOrder = () => {

  const router = useRouter()
  const [order, setOrder] = useState<IOrder>()

  const [customers, setCustomers] = useState<ICustomer[] | undefined>(undefined)
  const [selectedCustomers, setSelectedCustomers] = useState<ICustomer[]>([])

  const [products, setProducts] = useState<IProduct[] | undefined>(undefined)
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([])
  const [productQuantity, setProductQuantity] = useState<IProductQuantity[]>([])

  const [orderStatus, setOrderStatus] = useState("Confirmed")

  const [loading, setLoading] = useState(true)
  const [doneButtonLocked, setDoneButtonLocked] = useState(false)
  const [error, setError] = useState("")
  const [posted, setPosted] = useState("")

  const defaultError = "Please ensure all values have been correctly entered!"
  const couldNotLoadError = "Error while loading!"

  useEffect(() => {
    var error = false
    fetch(`${DB_BASE_LINK}/customers`).then(res => res.json()).then(data => setCustomers(data.customers)).catch(err => setError(err))
    fetch(`${DB_BASE_LINK}/products`).then(res => res.json()).then(data => setProducts(data.products)).catch(err => setError(err))
    if (!error) setLoading(false)
    else setError(couldNotLoadError)
  }, [])

  useEffect(() => {
    if (router.query.id) {
      setLoading(true)
      fetch(`${DB_BASE_LINK}/order?id=${router.query.id}`).then(res => res.json()).then(data => {
        if (data.order) setOrder(data.order)
        else if (data.error) setError(data.error)
        else setError(couldNotLoadError)
      }).then(() => setLoading(false))
    }
  }, [router.query.id])

  useEffect(() => {
    if (order) {
      const fetchData = async () => {
        setLoading(true)

        var tempSelectedProducts: IProduct[] = [];

        await fetch(`${DB_BASE_LINK}/customer?id=${order.CustomerID}`).then(res => res.json())
          .then(data => {
            if (data.customer) setSelectedCustomers([data.customer])
            else if (data.error) setError(data.error)
            else setError(couldNotLoadError)
          })

        await fetch(`${DB_BASE_LINK}/order-detail?id=${order.OrderID}`).then(res => res.json())
          .then(async data => {
            if (data['order-detail']) setProductQuantity(await Promise.all((data['order-detail'] as any[]).map(async (curr, idx) => {
              var prod: IProduct | undefined
              var inventory = 0

              await fetch(`${DB_BASE_LINK}/product?id=${curr.ProductID}`).then(res => res.json())
                .then(data => {
                  if (data.product) prod = data.product as IProduct
                  else if (data.error) setError(data.error)
                  else setError(couldNotLoadError)
                })

              if (prod)
                await fetch(`${DB_BASE_LINK}/inventory/product?id=${prod.ProductID}`).then(res => res.json())
                  .then(data => {
                    if (data.inventory) (data.inventory as IInventoryItem[]).forEach(item => {
                      inventory = inventory + item.Quantity
                    })
                    else if (data.error) setError(data.error)
                    else setError(couldNotLoadError)
                  })

              if (prod) {
                tempSelectedProducts.push(prod)
                return {
                  product: prod,
                  quantity: curr.OrderQuantity,
                  pricePerUnit: curr.PricePerUnit,
                  inventory: inventory
                } as IProductQuantity
              }
              else return {} as IProductQuantity
            })))
          })

        return tempSelectedProducts
      }

      fetchData().then(products => {
        setSelectedProducts(products)
        setOrderStatus(order.Status)
        setLoading(false)
      })
    }
  }, [order])

  const handleOrderDone = (e: any) => {

    if (selectedCustomers.length && productQuantity.length && orderStatus) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: order ? order : undefined,
          customer: selectedCustomers[0],
          productsQuantity: productQuantity,
          orderStatus: orderStatus,
        })
      }

      fetch(`${DB_BASE_LINK}/orders/add`, orderRequestOptions).then(async response => {
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
        });
    } else {
      setError(defaultError)
    }
  }

  const handleOrderDelete = () => {
    if (order) {
      setError("")
      setDoneButtonLocked(true)

      const orderRequestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.OrderID
        })
      }

      fetch(`${DB_BASE_LINK}/order`, orderRequestOptions).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        if (!response.ok) {
          const error = (data && data.error) || response.status;
          return Promise.reject(error);
        }

        setPosted(data.message)
        await new Promise(res => setTimeout(res, 2000))
        router.push('/orders')
      })
        .catch(err => setError(err))
    }
  }

  const orderStatusOptions = [
    { status: "Completed" },
    { status: "Confirmed" },
    { status: "Cancelled" },
    { status: "Issue" },
  ]

  const handleQuantityChange = (idx: number, newQuantity: number) => {
    var old = [...productQuantity];
    if (old && newQuantity > 0 && newQuantity <= old[idx].inventory) {
      old[idx].quantity = newQuantity;
      setProductQuantity(old)
    }
  }

  const handlePricePerUnitChange = (idx: number, newPrice: number) => {
    var old = [...productQuantity];
    if (old && newPrice >= 0) {
      old[idx].pricePerUnit = newPrice;
    } else {
      old[idx].pricePerUnit = 0
    }
    setProductQuantity(old)
  }

  const handleSelectedProductsChange = async (val: IProduct[]) => {
    setLoading(true)
    setSelectedProducts(val)
    setProductQuantity(await Promise.all(val.map(async (val, idx) => {
      var q = 1
      var inventory = 0
      await fetch(`${DB_BASE_LINK}/inventory/product?id=${val.ProductID}`).then(res => res.json()).then(data => {
        if (data.inventory) (data.inventory as IInventoryItem[]).forEach(item => {
          inventory = inventory + item.Quantity
        })
        else if (data.error) setError(data.error)
        else setError(couldNotLoadError)
      })
      if (productQuantity[idx]) q = productQuantity[idx].quantity
      return { product: val, quantity: q, pricePerUnit: 0, inventory: inventory } as IProductQuantity
    })))
    setLoading(false)
  }

  return (
    <div className='transition-all gap-4 flex flex-col'>
      <h1 className="font-bold text-3xl text-black">{order ? 'Edit Order' : 'Add Order'}</h1>

      <div className={`w-full flex gap-3 custom_undershadow bg-red-600 p-3 text-white rounded-lg ${!error.length && 'hidden'}`}>
        <FaExclamationCircle size={32} />
        <p className='my-auto'>{error}</p>
      </div>
      {order?.Status === "Completed" &&
        <div className="w-full flex gap-3 custom_undershadow bg-orange-500 p-3 text-white rounded-lg">
          <FaExclamationCircle size={32} />
          <p className="my-auto italic">Order can no longer be edited as it is already completed.</p>
        </div>
      }
      {!loading && error !== couldNotLoadError ?
        <>
          <div
            className={`${order?.Status === "Completed" && 'pointer-events-none opacity-75'} flex flex-col gap-4`}
          >
            <ElevatedPlate>
              <div className="flex flex-col w-full gap-1">
                <h2 className="font-bold">Customer</h2>
                <Select
                  style={{ borderRadius: '0.5rem' }}
                  disabled={order?.Status === "Completed"}
                  options={customers!!}
                  onChange={val => setSelectedCustomers(val)}
                  valueField='CustomerID'
                  labelField='Cname'
                  values={selectedCustomers} />
              </div>
            </ElevatedPlate>

            <ElevatedPlate>
              <div className="flex flex-col w-full gap-1">
                <h2 className="font-bold">Products</h2>
                <Select
                  style={{ borderRadius: '0.5rem' }}
                  disabled={order?.Status === "Completed"}
                  multi={true}
                  options={products!!}
                  searchable={true}
                  onChange={val => handleSelectedProductsChange(val)}
                  valueField='Pname' labelField='Pname' values={selectedProducts} />

                <div className="flex gap-3 text-left my-3 font-bold">
                  <p className="basis-3/6">Product</p>
                  <p className="basis-1/6">Price Per Unit</p>
                  <p className="basis-1/6">Quantity</p>
                  <p className="basis-1/6">Inventory Availability</p>
                </div>
                {productQuantity && productQuantity.length ? productQuantity.map((prod, idx) => (
                  <div key={idx} className="flex gap-3 text-center m-2">
                    <p className="basis-3/6 text-left">{prod.product.Pname}</p>
                    <div className="basis-1/6 flex gap-2 hover:scale-[1.25] transition-all">
                      <FaMinus size={20}
                        className='hover:cursor-pointer hover:text-red-400'
                        onClick={e => handlePricePerUnitChange(idx, prod.pricePerUnit - 10)}
                      />
                      <input
                        type='number'
                        className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none w-14 outline outline-1 rounded-lg text-center outline-gray-400 focus:outline-blue-500 focus:outline-2'
                        value={prod.pricePerUnit}
                        onChange={(e) => { handlePricePerUnitChange(idx, Number(e.target.value)) }}
                      />
                      <FaPlus size={20}
                        className='hover:cursor-pointer hover:text-green-400'
                        onClick={e => handlePricePerUnitChange(idx, prod.pricePerUnit + 10)}
                      />
                    </div>
                    <div className="basis-1/6 flex gap-2 hover:scale-[1.25] transition-all">
                      <FaMinus size={20}
                        className='hover:cursor-pointer hover:text-red-400'
                        onClick={e => { handleQuantityChange(idx, prod.quantity - 1) }}
                      />
                      <input
                        type='number'
                        className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none w-14 outline outline-1 rounded-lg text-center outline-gray-400 focus:outline-blue-500 focus:outline-2'
                        value={prod.quantity}
                        onChange={(e) => { handleQuantityChange(idx, Number(e.target.value)) }}
                      />
                      <FaPlus size={20}
                        className='hover:cursor-pointer hover:text-green-400'
                        onClick={e => handleQuantityChange(idx, prod.quantity + 1)}
                      />
                    </div>
                    <p className="basis-1/6">{prod.inventory} units</p>
                  </div>
                ))
                  :
                  <div className="w-full text-center italic text-gray-400 mt-3">
                    Add products to continue
                  </div>
                }
              </div>
            </ElevatedPlate>

            <ElevatedPlate>
              <div className="flex flex-col w-full gap-1">
                <h2 className="font-bold">Order Status</h2>
                <Select
                  style={{ borderRadius: '0.5rem' }}
                  disabled={order?.Status === "Completed"}
                  options={orderStatusOptions}
                  searchable={true}
                  onChange={val => setOrderStatus(val[0].status)}
                  valueField='status' labelField='status' values={[{ status: orderStatus }]} />
              </div>
            </ElevatedPlate>

            <div className={`w-full flex custom_undershadow gap-3 bg-green-600 p-3 text-white rounded-lg ${!posted && 'hidden'}`}>
              <FaCheckCircle size={32} />
              <p className='my-auto'>{posted}</p>
            </div>
          </div>
          <div className="w-full gap-4 flex justify-end">
            {order && !doneButtonLocked &&
              <div
                onClick={() => { if (!doneButtonLocked) handleOrderDelete() }}
                className="p-2 bg-red-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-red-400">
                <>
                  <FaTrash size={22} />
                  <p>Delete</p>
                </>
              </div>
            }
            <div
              onClick={(e) => { if (order?.Status === "Completed") router.back(); else if (!doneButtonLocked) handleOrderDone(e) }}
              className="p-2 bg-green-600 transition-all text-white flex gap-2 rounded-lg hover:scale-[1.05] hover:cursor-pointer hover:bg-green-400">
              {!doneButtonLocked ? <>
                {<FaCheck size={22} />}
                <p>{order?.Status === 'Completed' ? 'Back' : 'Done'}</p></>
                : <Loading />}
            </div>
          </div>
        </>
        : <div className="mx-auto"><Loading /></div>
      }
    </div >
  )
}

export default EditOrder