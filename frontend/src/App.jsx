import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://dk-textile-backend.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const getFileUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  };

  if (selectedProduct) {
  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">DK TEXTILE</h1>
      </nav>

      <section className="product-details-page">

        <button
          className="back-btn"
          onClick={() => setSelectedProduct(null)}
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

            <button className="primary-btn">
              Order Now
            </button>

          </div>

        </div>

      </section>
    </div>
  );
}
  return (
    <div className="app">

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

      {selectedProduct ? (

        <section className="product-details-page">

          <button
            className="back-btn"
            onClick={() => setSelectedProduct(null)}
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
                <strong>Retail Price:</strong> ₹ {selectedProduct.price}
              </p>

              <p>
                <strong>Wholesale Price:</strong> ₹ {selectedProduct.wholesale_price}
              </p>

              <p>
                <strong>Available Stock:</strong> {selectedProduct.stock}
              </p>

              <p>
                <strong>Minimum Order Quantity:</strong>{" "}
                {selectedProduct.minimum_order_quantity}
              </p>

              <p>
                <strong>Status:</strong> {selectedProduct.status}
              </p>

              <p className="details-description">
                <strong>Description:</strong>
                <br />
                {selectedProduct.description}
              </p>

              <button className="primary-btn">
                Order Now
              </button>

            </div>

          </div>

        </section>

      ) : (

        <>

          <section className="hero" id="home">

            <div className="hero-content">

              <h2>
                Premium Textile Products for Every Business
              </h2>

              <p>
                DK TEXTILE provides quality fabrics and textile products
                for shopkeepers and customers across India.
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

          <section className="products-section" id="products">

            <h2>Our Products</h2>

            <div className="product-container">

              {products.length === 0 ? (

                <p>Loading products...</p>

              ) : (

                products.map((product) => (

                  <div className="product-card" key={product.id}>

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
                      <strong>Fabric:</strong> {product.fabric}
                    </p>

                    <p>
                      <strong>Color:</strong> {product.color}
                    </p>

                    <p className="price">
                      ₹ {product.price}
                    </p>

                    <p>{product.description}</p>

                    {product.video_path && (

                      <video controls className="product-video">

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

          <section className="about-section" id="about">

            <h2>About DK TEXTILE</h2>

            <p>
              DK TEXTILE is a textile manufacturing and supply business
              offering a wide variety of quality products. We serve
              shopkeepers and customers across India with reliable
              production, wholesale supply, and product ordering services.
            </p>

          </section>

          <footer className="footer" id="contact">

            <h2>DK TEXTILE</h2>

            <p>
              Quality Textile Products • Wholesale Orders • Delivery Across India
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