from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    product_code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )

    fabric = Column(String, nullable=True)
    color = Column(String, nullable=True)

    price = Column(Float, nullable=False)
    wholesale_price = Column(Float, nullable=True)

    stock = Column(Integer, default=0)
    minimum_order_quantity = Column(Integer, default=1)

    description = Column(String, nullable=True)

    image_path = Column(String, nullable=True)

    video_path = Column(String, nullable=True)

    status = Column(String, default="Active")