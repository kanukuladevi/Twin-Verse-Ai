import sys
import os

# Add backend directory to Python path for root-level cloud runners (Render/Vercel/Heroku)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.main import app
