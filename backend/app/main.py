from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

import os
import shutil

from app.database import Base, engine, SessionLocal
from models.category import Category
from models.product import Product
from models.order import Order

Base.metadata.create_all(bind=engine)

class OrderCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    customer_name: str
    mobile: str
    address: str

app = FastAPI(
    title="DK TEXTILE API",
    description="Backend API for DK TEXTILE",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dk-textile.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to DK TEXTILE API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "Backend is working successfully"
    }


# Get all categories
@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories


# Add a new category
@app.post("/categories")
def create_category(
    name: str,
    description: str = None,
    db: Session = Depends(get_db)
):
    existing_category = (
        db.query(Category)
        .filter(Category.name == name)
        .first()
    )

    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    new_category = Category(
        name=name,
        description=description
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return {
        "message": "Category created successfully",
        "category": {
            "id": new_category.id,
            "name": new_category.name,
            "description": new_category.description
        }
    }
# Get all products
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products


# Add a new product
@app.post("/products")
def create_product(
    product_code: str,
    name: str,
    category_id: int,
    fabric: str = None,
    color: str = None,
    price: float = 0,
    wholesale_price: float = None,
    stock: int = 0,
    minimum_order_quantity: int = 1,
    description: str = None,
    status: str = "Active",
    db: Session = Depends(get_db)
):
    # Check whether the category exists
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # Check whether the product code already exists
    existing_product = (
        db.query(Product)
        .filter(Product.product_code == product_code)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product code already exists"
        )

    # Create the product
    new_product = Product(
        product_code=product_code,
        name=name,
        category_id=category_id,
        fabric=fabric,
        color=color,
        price=price,
        wholesale_price=wholesale_price,
        stock=stock,
        minimum_order_quantity=minimum_order_quantity,
        description=description,
        status=status
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product created successfully",
        "product": new_product
    }

@app.post("/products/{product_id}/image")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check whether the product exists
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Create upload folder if it does not exist
    upload_folder = "uploads/products"
    os.makedirs(upload_folder, exist_ok=True)

    # Create file path
    file_path = os.path.join(
        upload_folder,
        f"product_{product_id}_{file.filename}"
    )

    # Save the uploaded image
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save image path in the database
    product.image_path = file_path
    db.commit()
    db.refresh(product)

    return {
        "message": "Product image uploaded and linked successfully",
        "product_id": product.id,
        "image_path": product.image_path
    }

@app.post("/products/{product_id}/video")
def upload_product_video(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check whether the product exists
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Create video upload folder if it does not exist
    upload_folder = "uploads/videos"
    os.makedirs(upload_folder, exist_ok=True)

    # Create video file path
    file_path = os.path.join(
        upload_folder,
        f"product_{product_id}_{file.filename}"
    )

    # Save the uploaded video
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save video path in the database
    product.video_path = file_path
    db.commit()
    db.refresh(product)

    return {
        "message": "Product video uploaded and linked successfully",
        "product_id": product.id,
        "video_path": product.video_path
    }

@app.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    # Find the product
    product = (
        db.query(Product)
        .filter(Product.id == order.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check minimum order quantity
    if order.quantity < product.minimum_order_quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order quantity is {product.minimum_order_quantity}"
        )

    # Check stock
    if order.quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    # Calculate total
    price = (
        product.wholesale_price
        if product.wholesale_price is not None
        else product.price
    )

    total_price = price * order.quantity

    # Create order
    new_order = Order(
        product_id=product.id,
        product_name=product.name,
        quantity=order.quantity,
        customer_name=order.customer_name,
        mobile=order.mobile,
        address=order.address,
        total_price=total_price,
        status="Pending"
    )

    db.add(new_order)

    # Reduce product stock
    product.stock -= order.quantity

    db.commit()
    db.refresh(new_order)

    return {
        "message": "Order placed successfully",
        "order": {
            "id": new_order.id,
            "product_name": new_order.product_name,
            "quantity": new_order.quantity,
            "customer_name": new_order.customer_name,
            "mobile": new_order.mobile,
            "address": new_order.address,
            "total_price": new_order.total_price,
            "status": new_order.status
        }
    }