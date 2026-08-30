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


# Create database tables
Base.metadata.create_all(bind=engine)


# Order request model
class OrderCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    customer_name: str
    mobile: str
    address: str


# Create FastAPI application
app = FastAPI(
    title="DK TEXTILE API",
    description="Backend API for DK TEXTILE",
    version="1.0.0"
)


# CORS settings
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


# Static uploads folder
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


# Home API
@app.get("/")
def home():
    return {
        "message": "Welcome to DK TEXTILE API"
    }


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "Backend is working successfully"
    }


# =========================
# CATEGORY APIs
# =========================

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


# =========================
# PRODUCT APIs
# =========================

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

    # Check category
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

    # Check product code
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

    # Create product
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


# =========================
# PRODUCT IMAGE UPLOAD
# =========================

@app.post("/products/{product_id}/image")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

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

    upload_folder = "uploads/products"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        f"product_{product_id}_{file.filename}"
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    product.image_path = file_path

    db.commit()

    db.refresh(product)

    return {
        "message": "Product image uploaded and linked successfully",
        "product_id": product.id,
        "image_path": product.image_path
    }


# =========================
# PRODUCT VIDEO UPLOAD
# =========================

@app.post("/products/{product_id}/video")
def upload_product_video(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

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

    upload_folder = "uploads/videos"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        f"product_{product_id}_{file.filename}"
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    product.video_path = file_path

    db.commit()

    db.refresh(product)

    return {
        "message": "Product video uploaded and linked successfully",
        "product_id": product.id,
        "video_path": product.video_path
    }


# =========================
# GET ALL ORDERS
# =========================

@app.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):

    orders = (
        db.query(Order)
        .order_by(Order.id.desc())
        .all()
    )

    return orders

# =========================
# UPDATE ORDER STATUS
# =========================

@app.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Dispatched",
        "Out for Delivery",
        "Delivered"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid order status"
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully",
        "order": {
            "id": order.id,
            "status": order.status
        }
    }

# =========================
# CREATE NEW ORDER
# =========================

@app.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    # Find product
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
            detail=(
                f"Minimum order quantity is "
                f"{product.minimum_order_quantity}"
            )
        )

    # Check stock
    if order.quantity > product.stock:

        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    # Select price
    price = (
        product.wholesale_price
        if product.wholesale_price is not None
        else product.price
    )

    # Calculate total price
    total_price = price * order.quantity

    # Create new order
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

    # Reduce stock
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