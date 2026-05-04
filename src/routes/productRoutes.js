import { Router } from 'express';
import ProductController from '../controllers/productController.js';

const router = Router();
const productController = new ProductController();

// Basic CRUD routes
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/search', (req, res) => productController.findProducts(req, res));
router.get('/low-stock', (req, res) => productController.getLowStockProducts(req, res));
router.get('/out-of-stock', (req, res) => productController.getOutOfStockProducts(req, res));
router.get('/inventory-value', (req, res) => productController.getInventoryValue(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.put('/:id', (req, res) => productController.updateProduct(req, res));
router.patch('/:id/quantity', (req, res) => productController.updateProductQty(req, res));
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export default router;