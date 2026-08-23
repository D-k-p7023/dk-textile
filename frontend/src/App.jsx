import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://dk-textile-backend.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [orderForm, setOrderForm] = useState({
  name: "",
  mobile: "",
  address: "",
  quantity: 1,
});

const [orderMessage, setOrderMessage] = useState("");
const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
      });
  }, []);

  const handlePlaceOrder = async () => {
  if (!orderForm.name.trim()) {
    setOrderMessage("Please enter your name.");
    return;
  }

  if (!orderForm.mobile.trim()) {
    setOrderMessage("Please enter your mobile number.");
    return;
  }

  if (!orderForm.address.trim()) {
    setOrderMessage("Please enter your delivery address.");
    return;
  }

  if (
    Number(orderForm.quantity) <
    Number(selectedProduct.minimum_order_quantity)
  ) {
    setOrderMessage(
      `Minimum order quantity is ${selectedProduct.minimum_order_quantity}.`
    );
    return;
  }

  setIsPlacingOrder(true);
  setOrderMessage("");

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: Number(orderForm.quantity),
        customer_name: orderForm.name,
        mobile: orderForm.mobile,
        address: orderForm.address,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to place order");
    }

    setOrderMessage("✅ Order placed successfully!");

    setOrderForm({
      name: "",
      mobile: "",
      address: "",
      quantity: selectedProduct.minimum_order_quantity,
    });

  } catch (error) {
    console.error("Order error:", error);
    setOrderMessage(
      "❌ Unable to place order. Please try again."
    );
  } finally {
    setIsPlacingOrder(false);
  }
};

  const getFileUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">DK TEXTILE</h1>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="login-btn">Login</button>
      </nav>

      {/* PRODUCT DETAILS */}
      {selectedProduct ? (
        <section className="product-details-page">

          <button
            className="back-btn"
            onClick={() => {
              setSelectedProduct(null);
              setShowOrderPopup(false);
            }}
          >
            ← Back to Products
          </button>

          <div className="product-details-container">

            <div className="product-details-media">

              {selectedProduct.image_path ? (
                <img
                  src={getFileUrl(selectedProduct.image_path)}
                  alt={selectedProduct.name}
                  className="details-image"
                />
              ) : (
                <div className="no-image">
                  No Image Available
                </div>
              )}

              {selectedProduct.video_path && (
                <video controls className="details-video">
                  <source
                    src={getFileUrl(selectedProduct.video_path)}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}

            </div>

            <div className="product-details-info">

              <h2>{selectedProduct.name}</h2>

              <p>
                <strong>Product Code:</strong>{" "}
                {selectedProduct.product_code}
              </p>

              <p>
                <strong>Fabric:</strong>{" "}
                {selectedProduct.fabric}
              </p>

              <p>
                <strong>Color:</strong>{" "}
                {selectedProduct.color}
              </p>

              <p>
                <strong>Retail Price:</strong> ₹{" "}
                {selectedProduct.price}
              </p>

              <p>
                <strong>Wholesale Price:</strong> ₹{" "}
                {selectedProduct.wholesale_price}
              </p>

              <p>
                <strong>Available Stock:</strong>{" "}
                {selectedProduct.stock}
              </p>

              <p>
                <strong>Minimum Order Quantity:</strong>{" "}
                {selectedProduct.minimum_order_quantity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedProduct.status}
              </p>

              <p className="details-description">
                <strong>Description:</strong>
                <br />
                {selectedProduct.description}
              </p>

              {/* ORDER NOW BUTTON */}
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  console.log("ORDER NOW CLICKED");
                  setShowOrderPopup(true);
                }}
              >
                Order Now
              </button>

            </div>
          </div>

          {/* ORDER POPUP */}
          {showOrderPopup && (
            <div className="order-popup-overlay">

              <div className="order-popup">

                <button
                  type="button"
                  className="popup-close"
                  onClick={() => setShowOrderPopup(false)}
                >
                  ×
                </button>

                <h2>Place Your Order</h2>

                <h3>{selectedProduct.name}</h3>

                <p>
                  <strong>Product Code:</strong>{" "}
                  {selectedProduct.product_code}
                </p>

                <p>
                  <strong>Wholesale Price:</strong> ₹{" "}
                  {selectedProduct.wholesale_price}
                </p>

                <label>Quantity</label>

                <input
                  type="number"
                  min={selectedProduct.minimum_order_quantity}
                  value={orderForm.quantity}
                  onChange={(e) =>
                  setOrderForm({
                  ...orderForm,
                  quantity: e.target.value,
                })
                }
              />

                <label>Your Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={orderForm.name}
                  onChange={(e) =>
                  setOrderForm({
                  ...orderForm,
                  name: e.target.value,
                })
                }
                />

                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={orderForm.mobile}
                  onChange={(e) =>
                  setOrderForm({
                  ...orderForm,
                  mobile: e.target.value,
                })
                }
                />

                <label>Delivery Address</label>

                <textarea
                  placeholder="Enter delivery address"
                  rows="4"
                  value={orderForm.address}
                  onChange={(e) =>
                  setOrderForm({
                  ...orderForm,
                  address: e.target.value,
                  })
                }
                ></textarea>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button>

                {orderMessage && (
                  <p className="order-message">
                    {orderMessage}
                  </p>
                )}

              </div>

            </div>
          )}

        </section>
      ) : (

        <>
          {/* HERO */}
          <section className="hero" id="home">

            <div className="hero-content">

              <h2>
                Premium Textile Products for Every Business
              </h2>

              <p>
                DK TEXTILE provides quality fabrics and textile
                products for shopkeepers and customers across India.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  document
                    .getElementById("products")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Products
              </button>

            </div>

          </section>

          {/* PRODUCTS */}
          <section className="products-section" id="products">

            <h2>Our Products</h2>

            <div className="product-container">

              {products.length === 0 ? (
                <p>Loading products...</p>
              ) : (

                products.map((product) => (

                  <div
                    className="product-card"
                    key={product.id}
                  >

                    {product.image_path ? (
                      <img
                        src={getFileUrl(product.image_path)}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image">
                        No Image Available
                      </div>
                    )}

                    <h3>{product.name}</h3>

                    <p>
                      <strong>Fabric:</strong>{" "}
                      {product.fabric}
                    </p>

                    <p>
                      <strong>Color:</strong>{" "}
                      {product.color}
                    </p>

                    <p className="price">
                      ₹ {product.price}
                    </p>

                    <p>
                      {product.description}
                    </p>

                    {product.video_path && (
                      <video
                        controls
                        className="product-video"
                      >
                        <source
                          src={getFileUrl(product.video_path)}
                          type="video/mp4"
                        />

                        Your browser does not support the video tag.
                      </video>
                    )}

                    <button
                      className="primary-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </button>

                  </div>

                ))

              )}

            </div>

          </section>

          {/* ABOUT */}
          <section
            className="about-section"
            id="about"
          >

            <h2>About DK TEXTILE</h2>

            <p>
              DK TEXTILE is a textile manufacturing and supply
              business offering a wide variety of quality products.
              We serve shopkeepers and customers across India with
              reliable production, wholesale supply, and product
              ordering services.
            </p>

          </section>

          {/* FOOTER */}
          <footer
            className="footer"
            id="contact"
          >

            <h2>DK TEXTILE</h2>

            <p>
              Quality Textile Products • Wholesale Orders •
              Delivery Across India
            </p>

            <p>
              © 2026 DK TEXTILE. All Rights Reserved.
            </p>

          </footer>

        </>

      )}

    </div>
  );
}

export default App;