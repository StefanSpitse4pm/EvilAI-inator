from starlette.requests import Request
from log import get_logger

async def log_middleware(request: Request, call_next):
    logger = get_logger()
    log_dict = {
        'url': request.url.path,
        'method': request.method,
    }
    logger.info(log_dict)
    response = await call_next(request)
    return response