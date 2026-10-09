"""
Entry point for: python -m server
"""
from server.run import *

if __name__ == "__main__":
    import uvicorn
    from server.config import SERVER_HOST, SERVER_PORT

    uvicorn.run(
        "server.main:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=False,
        log_level="info",
    )
