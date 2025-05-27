import logging
import sys

def setup_logging(logger: logging.Logger):

    file_handler = logging.FileHandler("logging.log")
    console_handler = logging.StreamHandler(sys.stdout)

    format = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    file_handler.setFormatter(format)
    console_handler.setFormatter(format)

    logger.handlers = [console_handler, file_handler]
    logger.setLevel(logging.DEBUG)

def get_logger() -> logging.Logger:
    logger = logging.getLogger(__name__)
    setup_logging(logger)
    return logger