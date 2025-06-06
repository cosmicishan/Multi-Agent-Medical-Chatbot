import logging

logging.basicConfig(
    filename="Loggers/debugging.log",     # 👈 log file path
    level=logging.DEBUG,                  # 👈 log all levels DEBUG and above
    filemode="w"
)

for noisy_logger in ['httpx', 'httpcore', 'groq', 'urllib3', 'asyncio']:
    logging.getLogger(noisy_logger).setLevel(logging.WARNING)

# Optional: get logger object for reuse
logger = logging.getLogger("project_logger")