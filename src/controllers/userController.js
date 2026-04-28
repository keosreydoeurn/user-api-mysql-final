import User from '../models/user.js';

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      const [firstUser, ...rest] = users;
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
        firstUser: firstUser ? firstUser.name : null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const { id: userId, name, created_at } = user;
      res.status(200).json({
        success: true,
        data: { userId, name, created_at }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message
      });
    }
  }

  async createUser(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }
      
      const user = await User.create({ name: name.trim() });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }
      
      const updatedUser = await User.update(parseInt(id), { name: name.trim() });
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

export default UserController;
