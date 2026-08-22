import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dk-textile-backend.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
      });
  }, []);

  return (
    <div className="app">

      {/* Navigation Bar */}
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

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h2>Premium Textile Products for Every Business</h2>

          <p>
            DK TEXTILE provides quality fabrics and textile products
            for shopkeepers and customers across India.
          </p>

          <button className="primary-btn">
            Explore Products
          </button>
        </div>
      </section>

      {/* Real Products Section */}
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
                    src={`http://127.0.0.1:8000/${product.image_path.replace(/\\/g, "/")}`}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="no-image">
                    No Image Available
                  </div>
                )}

                <h3>{product.name}</h3>

                <p><strong>Fabric:</strong> {product.fabric}</p>

                <p><strong>Color:</strong> {product.color}</p>

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
      src={`http://127.0.0.1:8000/${product.video_path.replace(/\\/g, "/")}`}
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
)}

<button className="primary-btn">
  View Details
</button>

              </div>
            ))
          )}

        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>About DK TEXTILE</h2>

        <p>
          DK TEXTILE is a textile manufacturing and supply business
          offering a wide variety of quality products. We serve
          shopkeepers and customers across India with reliable
          production, wholesale supply, and product ordering services.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <h2>DK TEXTILE</h2>

        <p>
          Quality Textile Products • Wholesale Orders • Delivery Across India
        </p>

        <p>© 2026 DK TEXTILE. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default App;