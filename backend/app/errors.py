"""
Centralized error handling middleware and exceptions
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AppException(Exception):
    """Base exception for application errors"""
    def __init__(self, message: str, status_code: int = 400, error_code: str = "APP_ERROR"):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(AppException):
    """Validation error"""
    def __init__(self, message: str):
        super().__init__(message, 422, "VALIDATION_ERROR")


class NotFoundError(AppException):
    """Resource not found"""
    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} not found", 404, "NOT_FOUND")


class AuthenticationError(AppException):
    """Authentication failed"""
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, 401, "AUTH_ERROR")


class AuthorizationError(AppException):
    """Authorization failed"""
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, 403, "FORBIDDEN")


class AIServiceError(AppException):
    """AI service error"""
    def __init__(self, message: str = "AI service temporarily unavailable"):
        super().__init__(message, 503, "AI_ERROR")


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware to catch and format all exceptions"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except AppException as e:
            logger.warning(f"App error: {e.error_code} - {e.message}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": True,
                    "error_code": e.error_code,
                    "message": e.message
                }
            )
        except HTTPException as e:
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": True,
                    "error_code": "HTTP_ERROR",
                    "message": e.detail
                }
            )
        except Exception as e:
            # Log full traceback for unexpected errors
            logger.error(f"Unexpected error: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={
                    "error": True,
                    "error_code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred. Please try again later."
                }
            )


def format_validation_errors(errors: list) -> str:
    """Format Pydantic validation errors into readable message"""
    messages = []
    for error in errors:
        field = " -> ".join(str(loc) for loc in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        messages.append(f"{field}: {msg}")
    return "; ".join(messages)
