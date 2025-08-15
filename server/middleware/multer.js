import multer from 'multer'
 
const storage = multer.memoryStorage() //.memoryStorage(): A built-in multer storage engine that stores files in memory instead of writing them to disk.

const upload = multer({ storage : storage })

export default upload