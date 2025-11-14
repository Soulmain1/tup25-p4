from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import init_db
from app.routers import auth, productos, carrito, compras

app = FastAPI(title="API Tienda")


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGENES_DIR = os.path.join(BASE_DIR, "imagenes")

app.mount("/imagenes", StaticFiles(directory=IMAGENES_DIR), name="imagenes")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()


app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(compras.router)

@app.get("/")
def home():
    return {"mensaje": "Bienvenido a la API de Tienda"}
