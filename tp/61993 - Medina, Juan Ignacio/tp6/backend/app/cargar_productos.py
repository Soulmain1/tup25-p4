import os
import sys
import json
from sqlalchemy.orm import Session


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

from app.database import engine, Base
from app import models

Base.metadata.create_all(bind=engine)

RUTA_JSON = os.path.join(BASE_DIR, "data", "productos.json")

def cargar_productos():
    if not os.path.exists(RUTA_JSON):
        print(f"❌ No se encontró el archivo: {RUTA_JSON}")
        return

    with open(RUTA_JSON, "r", encoding="utf-8") as f:
        productos = json.load(f)

    session = Session(bind=engine)

    try:
        for p in productos:
            existe = session.query(models.Producto).filter_by(nombre=p["titulo"]).first()

            if not existe:
                nuevo = models.Producto(
                    nombre=p["titulo"],
                    categoria=p["categoria"],
                    precio=p["precio"],
                    stock=p["existencia"],
                    imagen=p.get("imagen", ""),
                    tipo_iva="21%",
                    descripcion=p.get("descripcion", "")
                )
                session.add(nuevo)
                print(f"✅ Producto agregado: {p['titulo']}")
            else:
                print(f"⚠️ Ya existía: {p['titulo']}")

        session.commit()
        print("\n🎉 Carga completa.")
    except Exception as e:
        session.rollback()
        print(f"❌ Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    cargar_productos()
