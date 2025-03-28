import { Router } from 'express'
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller'
import { uploader } from '../config/uploaderCloudinary'

const router = Router()

router.get('/:productId', getProductById )

router.get('/', getAllProducts )

router.post('/', uploader.single('file'), createProduct )

router.patch('/:productId', uploader.single('file'), updateProduct )


export { router as productRouter }