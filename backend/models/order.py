from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, nullable=False)
    product_name = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    customer_name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    address = Column(Text, nullable=False)

    total_price = Column(Float, nullable=False)
    status = Column(String, default="Pending")