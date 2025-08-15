import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import productReducer from './ProductSlice.js'
import cartReducer from './cartProduct.js'
import addressReducer from './address.js'
import orderReducer from '../store/orderSlice.js'

export const store = configureStore({
    reducer : {
        user : userReducer,
        product : productReducer,
        cartItem : cartReducer,
        address : addressReducer,
        orders : orderReducer
    },
})