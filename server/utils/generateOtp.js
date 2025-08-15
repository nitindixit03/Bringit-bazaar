const generateOtp = ()=>{
    return Math.floor(Math.random() * 900000) + 100000 // 100000 to 9000000
}
export default generateOtp