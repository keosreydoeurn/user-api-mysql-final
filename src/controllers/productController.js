import Product from '../models/product.js';
import BaseController from './baseController.js';

class ProductController extends BaseController {
    constructor() {
        super();
        this.productModel = new Product();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productModel.findAll();
            
            // Calculate total value
            const totalValue = products.reduce((sum, product) => {
                return sum + (product.price * product.qty);
            }, 0);
            
            return this.successResponse(
                res,
                'Products retrieved successfully',
                {
                    count: products.length,
                    totalValue: totalValue,
                    data: products
                },
                200
            );
        } catch (error) {
            return this.errorResponse(res, `Error fetching products: ${error.message}`, 500);
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productModel.get(parseInt(id));
            
            if (!product) {
                return this.errorResponse(res, 'Product not found', 404);
            }
            
            return this.successResponse(res, 'Product retrieved successfully', product, 200);
        } catch (error) {
            return this.errorResponse(res, `Error fetching product: ${error.message}`, 500);
        }
    }

    async createProduct(req, res) {
        try {
            const { name, price, qty, description } = req.body;
            
            // Validation using destructuring
            if (!name || !price) {
                return this.errorResponse(res, 'Name and price are required', 400);
            }
            
            const product = await this.productModel.create({ 
                name: name.trim(), 
                price: parseFloat(price), 
                qty: parseInt(qty) || 0, 
                description: description || '' 
            });
            
            return this.successResponse(res, 'Product created successfully', product, 201);
        } catch (error) {
            return this.errorResponse(res, `Error creating product: ${error.message}`, 500);
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, qty, description } = req.body;
            
            if (!name || !price) {
                return this.errorResponse(res, 'Name and price are required', 400);
            }
            
            const updatedProduct = await this.productModel.update(parseInt(id), {
                name: name.trim(),
                price: parseFloat(price),
                qty: parseInt(qty) || 0,
                description: description || ''
            });
            
            if (!updatedProduct) {
                return this.errorResponse(res, 'Product not found', 404);
            }
            
            return this.successResponse(res, 'Product updated successfully', updatedProduct, 200);
        } catch (error) {
            return this.errorResponse(res, `Error updating product: ${error.message}`, 500);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.productModel.delete(parseInt(id));
            
            if (!deleted) {
                return this.errorResponse(res, 'Product not found', 404);
            }
            
            return this.successResponse(res, 'Product deleted successfully', null, 200);
        } catch (error) {
            return this.errorResponse(res, `Error deleting product: ${error.message}`, 500);
        }
    }

    async updateProductQty(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            
            if (quantity === undefined) {
                return this.errorResponse(res, 'Quantity is required', 400);
            }
            
            const updatedProduct = await this.productModel.updateQty(parseInt(id), parseInt(quantity));
            
            if (!updatedProduct) {
                return this.errorResponse(res, 'Product not found', 404);
            }
            
            const message = quantity >= 0 ? 
                `Added ${quantity} units to stock` : 
                `Removed ${Math.abs(quantity)} units from stock`;
            
            return this.successResponse(res, message, updatedProduct, 200);
        } catch (error) {
            return this.errorResponse(res, `Error updating quantity: ${error.message}`, 500);
        }
    }

    async findProducts(req, res) {
        try {
            const filters = req.query;
            const products = await this.productModel.find(filters);
            
            const totalValue = products.reduce((sum, product) => {
                return sum + (product.price * product.qty);
            }, 0);
            
            return this.successResponse(
                res,
                'Products found successfully',
                {
                    count: products.length,
                    totalValue: totalValue,
                    filters: filters,
                    data: products
                },
                200
            );
        } catch (error) {
            return this.errorResponse(res, `Error finding products: ${error.message}`, 500);
        }
    }

    async getLowStockProducts(req, res) {
        try {
            const threshold = req.query.threshold || 10;
            const products = await this.productModel.getLowStock(threshold);
            
            return this.successResponse(
                res,
                `Products with quantity <= ${threshold}`,
                {
                    count: products.length,
                    threshold: threshold,
                    data: products
                },
                200
            );
        } catch (error) {
            return this.errorResponse(res, `Error fetching low stock products: ${error.message}`, 500);
        }
    }

    async getOutOfStockProducts(req, res) {
        try {
            const products = await this.productModel.getOutOfStock();
            
            return this.successResponse(
                res,
                'Out of stock products',
                {
                    count: products.length,
                    data: products
                },
                200
            );
        } catch (error) {
            return this.errorResponse(res, `Error fetching out of stock products: ${error.message}`, 500);
        }
    }

    async getInventoryValue(req, res) {
        try {
            const totalValue = await this.productModel.getTotalValue();
            
            return this.successResponse(
                res,
                'Total inventory value',
                {
                    totalValue: totalValue,
                    currency: 'USD'
                },
                200
            );
        } catch (error) {
            return this.errorResponse(res, `Error calculating inventory value: ${error.message}`, 500);
        }
    }
}

export default ProductController;