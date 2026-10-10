"""
Entry point for running the server:
    python -m server
    or
    python server
"""

import sys
from pathlib import Path

# Ensure the project root is on the Python path
_project_root = str(Path(__file__).resolve().parent.parent)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

import uvicorn
from server.config import SERVER_HOST, SERVER_PORT

if __name__ == "__main__":
    uvicorn.run(
        "server.main:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=False,
        log_level="info",
    )
