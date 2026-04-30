import User from '../models/user.js';
import BaseController from './baseController.js';

class UserController extends BaseController {
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      const [firstUser, ...rest] = users;
      
      // Using destructuring for response
      const responseData = {
        count: users.length,
        data: users,
        firstUser: firstUser ? firstUser.name : null
      };
      
      return this.successResponse(
        res, 
        'Users retrieved successfully', 
        responseData, 
        200
      );
    } catch (error) {
      return this.errorResponse(
        res, 
        'Error fetching users: ' + error.message, 
        500
      );
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(parseInt(id));
      
      if (!user) {
        return this.errorResponse(res, 'User not found', 404);
      }
      
      // Using object destructuring
      const { id: userId, name, created_at } = user;
      const responseData = { userId, name, created_at };
      
      return this.successResponse(
        res, 
        'User retrieved successfully', 
        responseData, 
        200
      );
    } catch (error) {
      return this.errorResponse(
        res, 
        'Error fetching user: ' + error.message, 
        500
      );
    }
  }

  async createUser(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return this.errorResponse(res, 'Name is required', 400);
      }
      
      const user = await User.create({ name: name.trim() });
      
      return this.successResponse(
        res, 
        'User created successfully', 
        user, 
        201
      );
    } catch (error) {
      return this.errorResponse(
        res, 
        'Error creating user: ' + error.message, 
        500
      );
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return this.errorResponse(res, 'Name is required', 400);
      }
      
      const updatedUser = await User.update(parseInt(id), { name: name.trim() });
      
      if (!updatedUser) {
        return this.errorResponse(res, 'User not found', 404);
      }
      
      return this.successResponse(
        res, 
        'User updated successfully', 
        updatedUser, 
        200
      );
    } catch (error) {
      return this.errorResponse(
        res, 
        'Error updating user: ' + error.message, 
        500
      );
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.delete(parseInt(id));
      
      if (!deleted) {
        return this.errorResponse(res, 'User not found', 404);
      }
      
      return this.successResponse(
        res, 
        'User deleted successfully', 
        null, 
        200
      );
    } catch (error) {
      return this.errorResponse(
        res, 
        'Error deleting user: ' + error.message, 
        500
      );
    }
  }
}

export default UserController;