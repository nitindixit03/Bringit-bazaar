import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet'
import db from './config/connectDB.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import uploadRouter from './routes/upload.route.js';
import subCategoryRouter from './routes/subCategory.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import addressRouter from './routes/address.route.js';
import orderRouter from './routes/order.route.js';

const app = express();
app.use(cors({
    credentials : true, // if using cookies/auth headers
    origin: process.env.FRONTEND_URL, // allow frontend to connect
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy : false,
}))

const PORT = 8000 || process.env.PORT

app.get('/', (req, res) => {
    res.json({ message: "Server is running at " + PORT})
})

app.use('/api/user', userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

db().then(()=>{
    app.listen(PORT, ()=> {
        console.log('Server is running',PORT)
    })
})


