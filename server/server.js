const express = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, err => {
    if (err) console.log("Getting error: " + err)
    return;
});

const PORT = 8080

const getTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return today
}

// Auth
{
    app.post("/api/login", (req, res) => {
        if (req.body && req.body.username && req.body.password) {
            db.get('select * from EmpAuth where EmpUsername = ? and EmpPassword = ?', [req.body.username, req.body.password],
            (err, row) => {
                if (!err && row) {
                    const empId = row.EmpID
                    if (row.EmpID) {
                        db.get('select * from Employee where EmpID = ?', [empId],
                        (err, row) => {
                            if (!err) res.json({ employee: row })
                            else res.json({ error: err.message })
                        })
                    } 
                    else {
                        res.status(401)
                        res.json({ error: 'Invalid username or password!' })
                    }
                } 
                else {
                    res.status(401)
                    res.json({ error: 'Invalid username or password!' })
                }
            })
        } else {
            res.json({ error: 'Invalid attempt!' })
        }
    })
}

// Orders
{
    app.get("/api/orders", (req, res) => {
        if (db) {
            db.all(`select * from \`Order\``, (err, rows) => {
                res.json({ orders: rows })
            })
        }
    })

    app.get("/api/order", (req, res) => {
        if (db && req.query.id) {
            db.get(`select * from \`Order\` where OrderID = ?`, [req.query.id], (err, row) => {
                if (err) res.json({ error: err.message })
                else res.json({ order: row })
            })
        } else {
            res.json({ error: 'Invalid attempt!' })
        }
    })

    app.post('/api/orders/add', async (req, res) => {
        if (db && req.body) {
            var lastRowId = undefined;
            var orderData = {
                CustomerID: req.body.customer.CustomerID,
                OrderDate: req.body.order ? req.body.order.OrderDate : getTodayDate(),
                Status: req.body.orderStatus,
                Order: req.body.order
            }

            if (!orderData.Order) {
                db.run('insert into `Order` (CustomerID, OrderDate, Status) values (?, ?, ?)',
                    [orderData.CustomerID, orderData.OrderDate, orderData.Status],
                    (err) => {
                        if (err) res.json({ error: err.message })
                        else db.get('select last_insert_rowid()', (err, row) => {
                            if (!err) {
                                lastRowId = row['last_insert_rowid()']
                                insertOrderDetail()
                            }
                            else res.json({ error: err.message })
                        })
                    })
            } else {
                lastRowId = orderData.Order.OrderID
                db.run('update `Order` set CustomerID = ?, OrderDate = ?, Status = ? where OrderID = ?',
                    [orderData.CustomerID, orderData.OrderDate, orderData.Status, orderData.Order.OrderID],
                    err => {
                        if (err) res.json({ error: err.message })
                        else db.run('delete from `OrderDetail` where OrderID = ?', [lastRowId],
                            err => {
                                if (err) res.json({ error: err.message })
                                else insertOrderDetail()
                            })
                    })
            }
            const insertOrderDetail = () => {
                if (lastRowId)
                    req.body.productsQuantity.forEach(prod => {
                        db.run('insert into `OrderDetail` (OrderID, ProductID, OrderQuantity, PricePerUnit) values (?, ?, ?, ?)',
                            [lastRowId, prod.product.ProductID, prod.quantity, prod.pricePerUnit],
                            (err) => {
                                console.log("OrderStatus: " + orderData.Status)
                                if (err) res.json({ error: err.message })

                                else if (lastRowId && orderData.Status === "Completed") {
                                    console.log("ran this else if statement")
                                    var inventoryQuantity = 0;
                                    db.all('select * from `Inventory` where ProductID = ?', [prod.product.ProductID], (err, rows) => {
                                        if (err) res.json({ error: err.message })
                                        else {
                                            rows.forEach(row => {
                                                inventoryQuantity += row.Quantity
                                            })
                                            inventoryQuantity -= prod.quantity;
                                            console.log("Final inventory quantity: " + inventoryQuantity)

                                            // If there are multiple rows of one product in inventory, replace them with one.
                                            db.run('delete from `Inventory` where ProductID = ?', [prod.product.ProductID],
                                                err => {
                                                    if (err) res.json({ error: err.message })
                                                    else if (inventoryQuantity > 0) db.run('insert into `Inventory` (ProductID, Quantity, DOE) values (?, ?, ?)',
                                                        [prod.product.ProductID, inventoryQuantity, getTodayDate()],
                                                        err => {
                                                            if (err) res.json({ error: err.messasge })
                                                            else res.json({ message: orderData.Order ? "Successfully edited order!" : "Successfully added order!" })
                                                        })
                                                    else res.json({ message: orderData.Order ? "Successfully edited order!" : "Successfully added order!" })
                                                })
                                        }
                                    })
                                }
                                else res.json({ message: orderData.Order ? "Successfully edited order!" : "Successfully added order!" })
                            })

                    })
                else res.json({ error: 'Something went wrong!' })
            }
        } else res.json({ error: 'Invalid attempt!' })
    })

    app.delete('/api/order', (req, res) => {
        if (req.body.id)
            db.run('delete from `Order` where OrderID = ?', [req.body.id],
                err => {
                    if (err) res.json({ error: err.message })
                    else db.run('delete from `OrderDetail` where OrderID = ?', [req.body.id],
                        err => {
                            if (err) res.json({ error: err.message })
                            else res.json({ message: "Successfully deleted order! Redirecting..." })
                        })
                })
        else res.json({ error: 'Invalid attempt!' })
    })
}

// OrderDetail
{
    app.get('/api/order-detail', (req, res) => {
        if (db && req.query.id) {
            db.all('select * from `OrderDetail` where OrderID = ?', [req.query.id],
                (err, rows) => {
                    if (!err) res.json({ 'order-detail': rows })
                    else res.json({ error: err.message })
                })
        } else res.json({ error: 'Invalid attempt!' })
    })
}

// Customers
{
    app.get("/api/customers", (req, res) => {
        if (db) {
            db.all('select * from `Customer`', (err, rows) => {
                if (err) res.json({ error: err.message })
                else res.json({ customers: rows })
            })
        }
    })

    app.get("/api/customer", (req, res) => {
        if (db && req.query.id) {
            db.get('select * from `Customer` where CustomerID = ?', [req.query.id], (err, row) => {
                if (!err) {
                    res.json({ customer: row })
                } else {
                    res.json({ error: err.message })
                }
            })
        } else res.json({ error: 'Invalid attempt!' })
    })

    app.post('/api/customers/add', (req, res) => {
        if (db && req.body) {
            if (!req.body.CustomerID) db.run('insert into `Customer` (Cname, Contact) values (?, ?)', [req.body.Cname, req.body.Contact], (err) => {
                if (err) res.json({ error: err.message })
                else res.json({ message: "Successfully added customer!" })
            })
            else db.run('update `Customer` set Cname = ?,  Contact = ? where CustomerID = ?',
                [req.body.Cname, req.body.Contact, req.body.CustomerID],
                err => {
                    if (err) res.json({ error: err.message })
                    else res.json({ message: "Successfully edited customer!" })
                })
        } else {
            res.json({ error: 'Invalid attempt!' })
        }
    })

    app.delete('/api/customer', (req, res) => {
        if (req.body.id) db.run('delete from `Customer` where CustomerID = ?', [req.body.id],
            err => {
                if (err) res.json({ error: err.messsage })
                else res.json({ message: "Successfully deleted customer! Redirecting..." })
            })
        else res.json({ error: 'Invalid attempt!' })
    })
}

// Employees
{
    app.get('/api/employees', (req, res) => {
        if (db) {
            db.all('select * from `Employee`', (err, rows) => {
                if (!err) res.json({ employees: rows })
                else res.json({ error: err.message })
            })
        }
    })

    app.get('/api/employee', (req, res) => {
        if (db && req.query.id) {
            db.get('select * from `Employee` where EmpID = ?', [req.query.id], (err, row) => {
                if (!err) res.json({ employee: row })
                else res.json({ error: err.message })
            })
        } else {
            res.json({ error: 'Invalid attempt!' })
        }
    })

    app.post('/api/employees/add', (req, res) => {
        if (db && req.body) {
            if (!req.body.EmpID) db.run('insert into `Employee` (EmpName, EmpRole) values (?, ?)',
                [req.body.EmpName, req.body.EmpRole],
                (err) => {
                    if (err) res.json({ error: err.message })
                    else res.json({ message: "Successfully added employee!" })
                })
            else db.run('update `Employee` set EmpName = ?, EmpRole = ? where EmpID = ?',
                [req.body.EmpName, req.body.EmpRole, req.body.EmpID],
                err => {
                    if (err) res.json({ error: err.message })
                    else res.json({ message: "Successfully edited employee!" })
                })
        }
    })

    app.delete('/api/employee', (req, res) => {
        if (req.body.id) db.run('delete from `Employee` where EmpID = ?', [req.body.id],
            err => {
                if (!err) res.json({ message: "Successfully deleted employee! Redirecting..." })
                else res.json({ error: err.message })
            })
        else res.json({ error: 'Invalid attempt!' })
    })
}

// Products
{
    app.get('/api/products', (req, res) => {
        if (db) {
            db.all('select * from `Product`', (err, rows) => {
                if (!err) res.json({ products: rows })
                else res.json({ error: err.message })
            })
        }
    })

    app.get('/api/product', (req, res) => {
        if (db && req.query.id) {
            db.get('select * from `Product` where ProductID = ?', [req.query.id], (err, row) => {
                if (!err) res.json({ product: row })
                else res.json({ error: err.message })
            })
        } else {
            res.json({ error: 'Invalid attempt!' })
        }
    })

    app.post('/api/products/add', (req, res) => {
        if (db && req.body) {
            if (req.body.ProductID) db.run('update `Product` set Pname = ?, Pdesc = ? where ProductID = ?', [req.body.Pname, req.body.Pdesc, req.body.ProductID], err => {
                if (err) res.json({ error: err.message })
                else res.json({ message: "Successfully modified product! " })
            })
            else db.run('insert into `Product` (Pname, Pdesc) values (?, ?)', [req.body.Pname, req.body.Pdesc], (err) => {
                if (err) res.json({ error: err.message })
                else res.json({ message: "Successfully added product!" })
            })
        }
    })

    app.delete('/api/product', (req, res) => {
        if (req.body.id) db.run('delete from `Product` where ProductID = ?', [req.body.id],
            err => {
                if (err) res.json({ error: err.message })
                else res.json({ message: "Successfully deleted product! Redirecting..." })
            })
    })
}

// Inventory
{
    app.get('/api/inventory', (req, res) => {
        if (db) {
            if (!req.query.id) db.all('select * from `Inventory`', (err, rows) => {
                if (!err) res.json({ inventory: rows })
                else res.json({ error: err.message })
            })
            else db.get('select * from `Inventory` where InventoryID = ?', [req.query.id], (err, row) => {
                if (!err) res.json({ inventory: row })
                else res.json({ error: err.message })
            })
        }
    })

    app.get('/api/inventory/product', (req, res) => {
        if (db && req.query.id) {
            db.all('select * from `Inventory` where ProductID = ?', [req.query.id], (err, rows) => {
                if (!err) res.json({ inventory: rows })
                else res.json({ error: err.message })
            })
        }
    })

    app.post('/api/inventory/add', (req, res) => {
        if (db && req.body) {
            if (!req.body.InventoryID) db.run('insert into `Inventory` (ProductID, Quantity, DOE) values (?, ?, ?)',
                [req.body.ProductID, req.body.Quantity, getTodayDate()],
                (err) => {
                    if (err) res.json({ error: err.message })
                    else res.json({ message: "Successfully added to inventory!" })
                })
            else db.run('update `Inventory` set ProductID = ?, Quantity = ?, DOE = ? where InventoryID = ?',
                [req.body.ProductID, req.body.Quantity, getTodayDate(), req.body.InventoryID],
                err => {
                    if (err) res.json({ error: err.message })
                    else res.json({ message: 'Successfully edited inventory item!' })
                })
        }
    })

    app.delete('/api/inventory', (req, res) => {
        if (req.body.id) db.run('delete from `Inventory` where InventoryID = ?', [req.body.id],
            err => {
                if (err) res.json({ error: err.message })
                else res.json({ message: "Successfully deleted inventory item! Redirecting..." })
            })
    })
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})