const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  next();
};

// Employee validation rules
const validateEmployee = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  body('role')
    .isIn(['EMPLOYEE', 'ENGINEER', 'APPROVER', 'ADMIN'])
    .withMessage('Invalid role'),
  
  body('loginName')
    .trim()
    .notEmpty()
    .withMessage('Login name is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Login name must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Login name can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  
  handleValidationErrors
];

// Login validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Expense type validation rules
const validateExpenseType = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean'),
  
  handleValidationErrors
];

// Allocation validation rules
const validateAllocation = [
  body('allocationDate')
    .isISO8601()
    .withMessage('Valid allocation date is required'),
  
  body('empId')
    .isInt({ min: 1 })
    .withMessage('Valid employee ID is required'),
  
  body('expenseTypeId')
    .isInt({ min: 1 })
    .withMessage('Valid expense type ID is required'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('remarks')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Remarks must not exceed 500 characters'),
  
  body('billNumber')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Bill number must not exceed 50 characters'),
  
  body('billDate')
    .optional()
    .isISO8601()
    .withMessage('Valid bill date is required'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('originalBill')
    .optional()
    .isBoolean()
    .withMessage('Original bill must be a boolean'),
  
  handleValidationErrors
];

// Approval validation rules
const validateApproval = [
  body('approved')
    .isBoolean()
    .withMessage('Approval status must be a boolean'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email', 'amount', 'allocationDate'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// Head validation rules
const validateHead = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateEmployee,
  validateLogin,
  validateExpenseType,
  validateAllocation,
  validateApproval,
  validateId,
  validatePagination,
  validateHead,
};