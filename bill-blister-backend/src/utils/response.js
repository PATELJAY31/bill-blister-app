// Success response helper
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response helper
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    skip: offset,
    take: limit,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

// Paginated response helper
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(data.total / limit);

  return res.status(200).json({
    success: true,
    message,
    data: data.results,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: data.total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

// Created response (201)
const createdResponse = (res, message = 'Resource created successfully', data = null) => {
  return successResponse(res, 201, message, data);
};

// Updated response (200)
const updatedResponse = (res, message = 'Resource updated successfully', data = null) => {
  return successResponse(res, 200, message, data);
};

// Deleted response (200)
const deletedResponse = (res, message = 'Resource deleted successfully') => {
  return successResponse(res, 200, message);
};

// Not found response (404)
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

// Unauthorized response (401)
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, 401, message);
};

// Forbidden response (403)
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, 403, message);
};

// Bad request response (400)
const badRequestResponse = (res, message = 'Bad Request', errors = null) => {
  return errorResponse(res, 400, message, errors);
};

// Conflict response (409)
const conflictResponse = (res, message = 'Conflict') => {
  return errorResponse(res, 409, message);
};

// Internal server error response (500)
const internalErrorResponse = (res, message = 'Internal Server Error') => {
  return errorResponse(res, 500, message);
};

module.exports = {
  successResponse,
  errorResponse,
  paginate,
  paginatedResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  conflictResponse,
  internalErrorResponse,
};
