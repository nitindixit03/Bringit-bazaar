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

// ✅ Allow multiple frontend URLs from env
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

app.use(cors({
  credentials: true, 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  }
}));

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: false,
}))

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.json({ message: "Server is running at " + PORT })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

db().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
  })
})
