import { app, startServer } from "./server"
import express from 'express'
import cors from 'cors'
import { customerRouter } from "./routes/customer.routes"
import { userRouter } from "./routes/user.routes"
import cookieParser from "cookie-parser"
import { productRouter } from "./routes/product.routes"
import { employeeRouter } from "./routes/employee.routes"
import { catalogRouter } from "./routes/catalog.routes"
import { serviceRouter } from "./routes/service.routes"
import { purchaseRouter } from "./routes/purchase.routes"
import { movementRouter } from "./routes/movement.routes"
import { saleRouter } from "./routes/sale.routes"
import { adminRouter } from "./routes/admin.routes"
import { dashboardRouter } from "./routes/dashboard.routes"

( async () => {

    app.use( cors({
        origin: ['http://localhost:4200','https://carwash-app-zeta.vercel.app'],
        credentials: true,
    }))
    app.use( cookieParser() )
    app.use( express.json() )
    app.use( express.urlencoded({ extended: true }) )

    await startServer()
    
    app.use( '/api/dashboard', dashboardRouter )
    app.use( '/api/customers', customerRouter )
    app.use( '/api/admin', adminRouter )
    app.use( '/api/user', userRouter )
    app.use( '/api/products', productRouter )
    app.use( '/api/employees', employeeRouter )
    app.use( '/api/catalogs', catalogRouter )
    app.use( '/api/services', serviceRouter )
    app.use( '/api/purchase', purchaseRouter )
    app.use( '/api/movement', movementRouter )
    app.use( '/api/sale', saleRouter )
    

})()