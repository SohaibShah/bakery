import { ICustomer } from '@/components/customers/customer_row';
import CustomersTable from '@/components/customers/customers_table';
import { IEmployee } from '@/components/employees/employee_row';
import EmployeesTable from '@/components/employees/employees_table';
import { IInventoryItem } from '@/components/inventory/inventory_row';
import InventoryTable from '@/components/inventory/inventory_table';
import Loading from '@/components/loading';
import { IOrder } from '@/components/orders/order_row';
import OrdersTable from '@/components/orders/orders_table';
import { IProduct } from '@/components/products/product_row';
import ProductsTable from '@/components/products/products_table';
import { DB_BASE_LINK } from '@/constants';
import React, { useEffect, useState } from 'react'

const Index = () => {

  const [orders, setOrders] = useState<IOrder[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [inventory, setInventory] = useState<IInventoryItem[]>([])
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      await fetch(`${DB_BASE_LINK}/orders`).then(res => res.json()).then(data => setOrders(data.orders))
      await fetch(`${DB_BASE_LINK}/products`).then(res => res.json()).then(data => setProducts(data.products))
      await fetch(`${DB_BASE_LINK}/inventory`).then(res => res.json()).then(data => setInventory(data.inventory))
      await fetch(`${DB_BASE_LINK}/customers`).then(res => res.json()).then(data => setCustomers(data.customers))
      await fetch(`${DB_BASE_LINK}/employees`).then(res => res.json()).then(data => setEmployees(data.employees))
    }

    fetchData().then(() => setLoading(false))
  }, [])

  return (
    <>
      <h1 className="font-bold text-3xl text-black">Overview</h1>

      {!loading ?
        <>
          <h2 className="font-bold">Orders</h2>
          <OrdersTable orders={orders} />

          <h2 className="font-bold">Products</h2>
          <ProductsTable products={products} />

          <h2 className="font-bold">Inventory</h2>
          <InventoryTable inventory={inventory} />

          <h2 className="font-bold">Customers</h2>
          <CustomersTable customers={customers} />

          <h2 className="font-bold">Employees</h2>
          <EmployeesTable employees={employees} />
        </>
        :
        <div className="mx-auto">
          <Loading />
        </div>
      }
    </>
  )
}

export default Index