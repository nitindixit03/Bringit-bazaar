import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs'
import sendEmail from '../config/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailtemplate.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshtoken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generateOtp from '../utils/generateOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordtemplate.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//register
export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({  
                message : "Provide email, name, password!!",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne( { email })

        if(user){
            return res.json({
                message : "Already register email",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from bringit",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            }),
        })

        return res.status(200).json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save
        })


    } catch (error) {
        return res.status(500).json({ 
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify email
export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body

        const user = await UserModel.findOne({ _id : code })

        if(!user){
            return res.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code }, { $set : { verify_email : true }})

        return res.json({
            message : "Email verification done!",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json( {
            message : "error.message || error",
            error : true,
            success : true
        })
    }
}

//login controller
export async function loginController(req, res) {
    let accessToken, refreshToken
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return res.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if(!checkPassword){
            return res.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        accessToken = await generateAccessToken(user._id)
        refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        res.cookie('accessToken', accessToken, cookieOption)
        res.cookie('refreshToken', refreshToken, cookieOption)

        return res.json({
            message : "Login Successfully",
            error : false,
            success : true,
            data : {
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
         return res.status(500).json({
            message : error.message || "error",
            error : true,
            success : false,
            data : {
                accessToken,
                refreshToken
            }
         })
    }
}

//logout controller
export async function logoutController(req, res) {
    try {
        const userid = req.userId // middleware
        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken", cookieOption)
        res.clearCookie("refreshToken", cookieOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })
        
        return res.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user avatar
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId //auth middleware
        const image = req.file //multer middleware

        const upload = await uploadImageCloudinary(image)
        
        const upadateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return res.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId //auth middleware
        const { name, email, mobile, password } = req.body

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateuser = await UserModel.updateOne({ _id : userId },{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return res.json({
            message : "Updated Successfully",
            error : false,
            success : true,
            data : updateuser,
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//forgot password when he is not login
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body

        if(!email){
            return res.status(400).json({
                message : "Please provide an email",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not found. Please register",
                error : true,
                success : false
            })
        }

        const otp = generateOtp()

          // Set expiry to 1 hour from now
        const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        }) 

        await sendEmail({
            sendTo : email,
            subject : "Fogot password from - Bringit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.json({
            message : "OTP sent to your email",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || "Somthing went wrong",
            error : true,
            success : false
        })
    }    
}

//verify forgot password otp

export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body
        
        if(!email || !otp){
            return res.status(400).json({
                message : "Provide required field email, otp",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not found.",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message : "OTP is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message : "Invalid OTP",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })

        return res.json({
            message : "Verify OTP Successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetPassword(req, res) {
    try {

        const { email, newPassword, confirmPassword } = req.body

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword",
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return res.json({
            message : "password updated successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//refresh token
export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if(!refreshToken){
            return res.status(401).json({
                message : "Invalid Token",
                error : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(400).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?.id
        console.log(userId)

        const newAccessToken = await generateAccessToken(userId)

        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken', newAccessToken, cookieOption)

        return res.json({
            message : "new Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken,
            }
        })

    } catch (error) {
        return res.status(500).json({
            message : error.status || error,
            error : true,
            success : false
        })
    }
}

// get login user details
export async function userDetails(req, res) {
    try {
        const userId = req.userId //from auth middleware

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message : "user details",
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Somthing is wrong",
            error : true,
            success : false
        })
    }
}