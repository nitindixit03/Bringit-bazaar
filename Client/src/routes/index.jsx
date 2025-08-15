import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Forgotpassword from "../pages/ForgotPassword.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import UserMenuMobile from "../pages/userMenuMobile.jsx"
import Dashboard from "../layouts/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Address from "../pages/Address.jsx";
import Category from "../pages/Category.jsx";
import SubCategory from "../pages/SubCategory.jsx";
import UploadProduct from "../pages/UploadProduct.jsx";
import ProductAdmin from "../pages/ProductAdmin.jsx";
import AdminPermission from "../layouts/AdminPermission.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPages from "../pages/ProductDisplayPages.jsx";
import CartMobile from "../pages/CartMobile.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import Cancel from "../pages/Cancel.jsx";
import Success from "../pages/Success.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <Forgotpassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <AdminPermission> <Category /> </AdminPermission>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermission> <SubCategory /> </AdminPermission>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermission> <UploadProduct /> </AdminPermission>
                    },
                    {
                        path: "product",
                        element: <AdminPermission> <ProductAdmin /> </AdminPermission>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage />
                    }
                ]
            },
            {
                path : "product/:product",
                element : <ProductDisplayPages />
            },
            {
                path : "cart",
                element : <CartMobile />
            },
            {
                path : "checkout",
                element : <CheckoutPage />
            },{
                path : "success",
                element : <Success />
            },{
                path : 'cancel',
                element : <Cancel />
            }
        ]
    }
])

export default router