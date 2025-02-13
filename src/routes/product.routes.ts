import { Router } from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller'
import { uploader } from '../config/uploaderCloudinary'

const router = Router()

router.get('/:productId', getProductById )

router.get('/', getAllProducts )

router.post('/', uploader.single('file'), createProduct )

router.patch('/:productId', uploader.single('file'), updateProduct )

router.delete('/:productId', deleteProduct )

export { router as productRouter }