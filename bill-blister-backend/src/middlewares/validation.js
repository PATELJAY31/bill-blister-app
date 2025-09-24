const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  
  next();
};

// Auth validation rules
const validateSignup = [
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
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['EMPLOYEE', 'ENGINEER', 'HO_APPROVER', 'ADMIN'])
    .withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

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
  
  body('role')
    .isIn(['EMPLOYEE', 'ENGINEER', 'HO_APPROVER', 'ADMIN'])
    .withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  
  body('reportingManagerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid reporting manager ID'),
  
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('joiningDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('leavingDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  handleValidationErrors,
];

// Expense type validation rules
const validateExpenseType = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Expense type name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  
  handleValidationErrors,
];

// Allocation validation rules
const validateAllocation = [
  body('allocationDate')
    .isISO8601()
    .withMessage('Valid allocation date is required'),
  
  body('employeeId')
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
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Remarks must be less than 1000 characters'),
  
  body('billNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Bill number must be less than 50 characters'),
  
  body('billDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid bill date format'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  handleValidationErrors,
];

// Claim validation rules
const validateClaim = [
  body('employeeId')
    .isInt({ min: 1 })
    .withMessage('Valid employee ID is required'),
  
  body('expenseTypeId')
    .isInt({ min: 1 })
    .withMessage('Valid expense type ID is required'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('billNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Bill number must be less than 50 characters'),
  
  body('billDate')
    .isISO8601()
    .withMessage('Valid bill date is required'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  handleValidationErrors,
];

// Claim verification validation
const validateClaimVerification = [
  body('status')
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be either APPROVED or REJECTED'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  body('rejectionReason')
    .if(body('status').equals('REJECTED'))
    .notEmpty()
    .withMessage('Rejection reason is required when rejecting a claim')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
  
  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  
  handleValidationErrors,
];

// Query validation for pagination
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
    .isIn(['createdAt', 'updatedAt', 'amount', 'name'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateEmployee,
  validateExpenseType,
  validateAllocation,
  validateClaim,
  validateClaimVerification,
  validateId,
  validatePagination,
  handleValidationErrors,
};
