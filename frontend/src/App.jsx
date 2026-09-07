import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://dk-textile-backend.onrender.com";

function App() {
  // =========================
  // CART
  // =========================
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("dk_textile_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Unable to load cart:", error);
      return [];
    }
  });

  const [showCartPage, setShowCartPage] = useState(false);

  useEffect(() => {
    localStorage.setItem("dk_textile_cart", JSON.stringify(cart));
  }, [cart]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    alert("Product added to cart!");
  };

  // =========================
  // UPDATE CART QUANTITY
  // =========================
  const increaseCartQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (Number(item.quantity) >= Number(item.stock)) {
          alert("❌ Maximum available stock reached.");
          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity) + 1,
        };
      })
    );
  };

  const decreaseCartQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          const newQuantity = Number(item.quantity) - 1;

          if (newQuantity <= 0) {
            return null;
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter(Boolean)
    );
  };

  // =========================
  // REMOVE CART ITEM
  // =========================
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId)
    );
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = () => {
    if (cart.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear the cart?"
    );

    if (confirmed) {
      setCart([]);
    }
  };

  // =========================
  // CART TOTAL
  // =========================
  const getCartTotal = () => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.wholesale_price || item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  };

  // =========================
  // PRODUCTS
  // =========================
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =========================
  // AUTHENTICATION
  // =========================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(
        "dk_textile_user"
      );

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error(
        "Unable to load saved user:",
        error
      );
      return null;
    }
  });

  const [showAuthPage, setShowAuthPage] =
    useState(false);

  const [authMode, setAuthMode] =
    useState("customer-login");

  const [authForm, setAuthForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] =
    useState(false);

  // =========================
  // ORDER POPUP
  // =========================
  const [showOrderPopup, setShowOrderPopup] =
    useState(false);

  const [orderForm, setOrderForm] = useState({
    name: "",
    mobile: "",
    address: "",
    quantity: 1,
  });

  const [orderMessage, setOrderMessage] =
    useState("");

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  // =========================
  // CART CHECKOUT
  // =========================
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [checkoutMessage, setCheckoutMessage] =
    useState("");

  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

  // =========================
  // ADMIN ORDERS
  // =========================
  const [showOrdersPage, setShowOrdersPage] =
    useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(false);

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(
          "Error loading products:",
          error
        );
      });
  }, []);

  // =========================
  // GET FILE URL
  // =========================
  const getFileUrl = (path) => {
    if (!path) {
      return "";
    }

    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  };

  // =========================
  // OPEN CART
  // =========================
  const openCartPage = () => {
    setShowAuthPage(false);
    setShowOrdersPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);
    setShowCartPage(true);
  };

  // =========================
  // CLOSE CART
  // =========================
  const closeCartPage = () => {
    setShowCartPage(false);
  };

  // =========================
  // OPEN CUSTOMER LOGIN
  // =========================
  const openCustomerLogin = () => {
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);

    setAuthMode("customer-login");

    setAuthForm({
      name: "",
      mobile: "",
      password: "",
    });

    setAuthMessage("");
    setShowAuthPage(true);
  };

  // =========================
  // OPEN CUSTOMER REGISTER
  // =========================
  const openCustomerRegister = () => {
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);

    setAuthMode("customer-register");

    setAuthForm({
      name: "",
      mobile: "",
      password: "",
    });

    setAuthMessage("");
    setShowAuthPage(true);
  };

  // =========================
  // OPEN ADMIN LOGIN
  // =========================
  const openAdminLogin = () => {
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);

    setAuthMode("admin-login");

    setAuthForm({
      name: "",
      mobile: "",
      password: "",
    });

    setAuthMessage("");
    setShowAuthPage(true);
  };

  // =========================
  // CLOSE AUTH PAGE
  // =========================
  const closeAuthPage = () => {
    setShowAuthPage(false);

    setAuthForm({
      name: "",
      mobile: "",
      password: "",
    });

    setAuthMessage("");
  };

  // =========================
  // AUTH FORM CHANGE
  // =========================
  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CUSTOMER REGISTRATION
  // =========================
  const handleCustomerRegister = async () => {
    if (!authForm.name.trim()) {
      setAuthMessage("Please enter your name.");
      return;
    }

    if (!authForm.mobile.trim()) {
      setAuthMessage(
        "Please enter your mobile number."
      );
      return;
    }

    if (!authForm.password.trim()) {
      setAuthMessage("Please enter your password.");
      return;
    }

    if (authForm.password.length < 4) {
      setAuthMessage(
        "Password must be at least 4 characters."
      );
      return;
    }

    setIsAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: authForm.name,
            mobile: authForm.mobile,
            password: authForm.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed."
        );
      }

      setAuthMessage(
        "✅ Registration successful! You can now login."
      );

      setAuthForm({
        name: "",
        mobile: authForm.mobile,
        password: "",
      });

      setTimeout(() => {
        setAuthMode("customer-login");
        setAuthMessage("");
      }, 1500);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setAuthMessage(
        `❌ ${
          error.message || "Registration failed."
        }`
      );
    } finally {
      setIsAuthLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (role) => {
    if (!authForm.mobile.trim()) {
      setAuthMessage(
        "Please enter your mobile number."
      );
      return;
    }

    if (!authForm.password.trim()) {
      setAuthMessage("Please enter your password.");
      return;
    }

    setIsAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: authForm.mobile,
            password: authForm.password,
            role: role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed."
        );
      }

      const user = data.user;

      localStorage.setItem(
        "dk_textile_user",
        JSON.stringify(user)
      );

      setCurrentUser(user);

      setAuthMessage("✅ Login successful!");

      setAuthForm({
        name: "",
        mobile: "",
        password: "",
      });

      setTimeout(() => {
        setShowAuthPage(false);
        setAuthMessage("");

        if (role === "admin") {
          openOrdersPageForAdmin(user);
        } else {
          if (showCartPage) {
            setCheckoutForm({
              name: user.name || "",
              mobile: user.mobile || "",
              address: "",
            });
          }
        }
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      setAuthMessage(
        `❌ ${
          error.message || "Login failed."
        }`
      );
    } finally {
      setIsAuthLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem(
      "dk_textile_user"
    );

    setCurrentUser(null);

    setShowOrdersPage(false);
    setShowAuthPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);

    setOrders([]);

    setAuthMessage("");

    setOrderForm({
      name: "",
      mobile: "",
      address: "",
      quantity: 1,
    });

    setCheckoutForm({
      name: "",
      mobile: "",
      address: "",
    });

    setOrderMessage("");
    setCheckoutMessage("");
  };

  // =========================
  // LOAD ALL ORDERS
  // =========================
  const loadOrders = async () => {
    setOrdersLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/orders`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load orders"
        );
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(
        "Error loading orders:",
        error
      );

      alert("Unable to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // =========================
  // OPEN ADMIN ORDERS PAGE
  // =========================
  const openOrdersPage = () => {
    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      openAdminLogin();
      return;
    }

    openOrdersPageForAdmin(currentUser);
  };

  const openOrdersPageForAdmin = (user) => {
    if (!user || user.role !== "admin") {
      return;
    }

    setSelectedProduct(null);
    setShowOrderPopup(false);
    setShowAuthPage(false);
    setShowCartPage(false);
    setShowOrdersPage(true);

    loadOrders();
  };

  // =========================
  // CLOSE ADMIN ORDERS PAGE
  // =========================
  const closeOrdersPage = () => {
    setShowOrdersPage(false);
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      alert(
        "Only admin can update order status."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update order status"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      console.log(
        "Order status updated:",
        data.order.status
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status."
      );

      loadOrders();
    }
  };

  // =========================
  // OPEN ORDER POPUP
  // =========================
  const openOrderPopup = () => {
    if (
      !currentUser ||
      currentUser.role !== "customer"
    ) {
      openCustomerLogin();
      return;
    }

    setShowOrderPopup(true);

    setOrderForm({
      name: currentUser.name || "",
      mobile: currentUser.mobile || "",
      address: "",
      quantity:
        selectedProduct.minimum_order_quantity,
    });

    setOrderMessage("");
  };

  // =========================
  // PLACE SINGLE PRODUCT ORDER
  // =========================
  const handlePlaceOrder = async () => {
    if (
      !currentUser ||
      currentUser.role !== "customer"
    ) {
      setOrderMessage(
        "Please login as a customer before placing an order."
      );
      return;
    }

    if (!orderForm.name.trim()) {
      setOrderMessage(
        "Please enter your name."
      );
      return;
    }

    if (!orderForm.mobile.trim()) {
      setOrderMessage(
        "Please enter your mobile number."
      );
      return;
    }

    if (!orderForm.address.trim()) {
      setOrderMessage(
        "Please enter your delivery address."
      );
      return;
    }

    if (
      Number(orderForm.quantity) <
      Number(
        selectedProduct.minimum_order_quantity
      )
    ) {
      setOrderMessage(
        `Minimum order quantity is ${selectedProduct.minimum_order_quantity}.`
      );
      return;
    }

    if (
      Number(orderForm.quantity) >
      Number(selectedProduct.stock)
    ) {
      setOrderMessage(
        "❌ Not enough stock available."
      );
      return;
    }

    setIsPlacingOrder(true);
    setOrderMessage("");

    try {
      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            quantity: Number(
              orderForm.quantity
            ),
            customer_name: orderForm.name,
            mobile: orderForm.mobile,
            address: orderForm.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to place order"
        );
      }

      setOrderMessage(
        "✅ Order placed successfully!"
      );

      const orderedQuantity = Number(
        orderForm.quantity
      );

      setOrderForm({
        name: currentUser.name || "",
        mobile: currentUser.mobile || "",
        address: "",
        quantity:
          selectedProduct.minimum_order_quantity,
      });

      // Update displayed selected product stock
      setSelectedProduct(
        (currentProduct) => ({
          ...currentProduct,
          stock:
            Number(currentProduct.stock) -
            orderedQuantity,
        })
      );

      // Update product list stock
      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              product.id ===
              selectedProduct.id
                ? {
                    ...product,
                    stock:
                      Number(product.stock) -
                      orderedQuantity,
                  }
                : product
          )
      );

      // Update same product in cart if present
      setCart((currentCart) =>
        currentCart
          .map((item) =>
            item.id === selectedProduct.id
              ? {
                  ...item,
                  stock:
                    Number(item.stock) -
                    orderedQuantity,
                }
              : item
          )
          .filter(
            (item) => Number(item.stock) > 0
          )
      );
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      setOrderMessage(
        `❌ ${
          error.message ||
          "Unable to place order. Please try again."
        }`
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // =========================
  // CHECKOUT FORM CHANGE
  // =========================
  const handleCheckoutChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CART CHECKOUT
  // =========================
  const handleCartCheckout = async () => {
    if (
      !currentUser ||
      currentUser.role !== "customer"
    ) {
      setCheckoutMessage(
        "Please login as a customer before checkout."
      );

      openCustomerLogin();
      return;
    }

    if (cart.length === 0) {
      setCheckoutMessage(
        "Your cart is empty."
      );
      return;
    }

    if (!checkoutForm.name.trim()) {
      setCheckoutMessage(
        "Please enter your name."
      );
      return;
    }

    if (!checkoutForm.mobile.trim()) {
      setCheckoutMessage(
        "Please enter your mobile number."
      );
      return;
    }

    if (!checkoutForm.address.trim()) {
      setCheckoutMessage(
        "Please enter your delivery address."
      );
      return;
    }

    // Check minimum quantity for every product
    for (const item of cart) {
      if (
        Number(item.quantity) <
        Number(item.minimum_order_quantity)
      ) {
        setCheckoutMessage(
          `Minimum order quantity for ${item.name} is ${item.minimum_order_quantity}.`
        );
        return;
      }

      if (
        Number(item.quantity) >
        Number(item.stock)
      ) {
        setCheckoutMessage(
          `❌ Not enough stock available for ${item.name}.`
        );
        return;
      }
    }

    setIsCheckingOut(true);
    setCheckoutMessage("");

    try {
      let successfulOrders = 0;

      for (const item of cart) {
        const response = await fetch(
          `${API_URL}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              product_id: item.id,
              product_name: item.name,
              quantity: Number(
                item.quantity
              ),
              customer_name:
                checkoutForm.name,
              mobile:
                checkoutForm.mobile,
              address:
                checkoutForm.address,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              `Failed to place order for ${item.name}`
          );
        }

        successfulOrders += 1;
      }

      // Clear cart after successful checkout
      setCart([]);

      // Refresh products from backend
      try {
        const productsResponse =
          await fetch(
            `${API_URL}/products`
          );

        if (productsResponse.ok) {
          const freshProducts =
            await productsResponse.json();

          setProducts(freshProducts);

          if (selectedProduct) {
            const updatedSelectedProduct =
              freshProducts.find(
                (product) =>
                  product.id ===
                  selectedProduct.id
              );

            if (updatedSelectedProduct) {
              setSelectedProduct(
                updatedSelectedProduct
              );
            }
          }
        }
      } catch (refreshError) {
        console.error(
          "Product refresh error:",
          refreshError
        );
      }

      setCheckoutMessage(
        `✅ ${successfulOrders} order${
          successfulOrders > 1
            ? "s"
            : ""
        } placed successfully!`
      );

      setCheckoutForm({
        name:
          currentUser.name || "",
        mobile:
          currentUser.mobile || "",
        address: "",
      });
    } catch (error) {
      console.error(
        "Cart checkout error:",
        error
      );

      setCheckoutMessage(
        `❌ ${
          error.message ||
          "Unable to complete checkout."
        }`
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // =========================
  // AUTH PAGE
  // =========================
  if (showAuthPage) {
    const isCustomerRegister =
      authMode === "customer-register";

    const isCustomerLogin =
      authMode === "customer-login";

    const isAdminLogin =
      authMode === "admin-login";

    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">
            DK TEXTILE
          </h1>

          <button
            className="login-btn"
            onClick={closeAuthPage}
          >
            Back to Website
          </button>
        </nav>

        <section className="auth-page">
          <div className="auth-container">

            {/* CUSTOMER LOGIN */}
            {isCustomerLogin && (
              <>
                <h2>Customer Login</h2>

                <p className="auth-subtitle">
                  Login to place your textile
                  orders.
                </p>

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={authForm.mobile}
                  onChange={
                    handleAuthChange
                  }
                />

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={
                    authForm.password
                  }
                  onChange={
                    handleAuthChange
                  }
                />

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleLogin(
                      "customer"
                    )
                  }
                  disabled={
                    isAuthLoading
                  }
                >
                  {isAuthLoading
                    ? "Logging in..."
                    : "Customer Login"}
                </button>

                {authMessage && (
                  <p className="auth-message">
                    {authMessage}
                  </p>
                )}

                <p className="auth-switch">
                  Don't have an account?
                </p>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    openCustomerRegister
                  }
                >
                  Create Customer Account
                </button>

                <button
                  type="button"
                  className="text-btn"
                  onClick={
                    openAdminLogin
                  }
                >
                  Admin Login
                </button>
              </>
            )}

            {/* CUSTOMER REGISTRATION */}
            {isCustomerRegister && (
              <>
                <h2>
                  Customer Registration
                </h2>

                <p className="auth-subtitle">
                  Create your DK TEXTILE
                  customer account.
                </p>

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={authForm.name}
                  onChange={
                    handleAuthChange
                  }
                />

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={authForm.mobile}
                  onChange={
                    handleAuthChange
                  }
                />

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={
                    authForm.password
                  }
                  onChange={
                    handleAuthChange
                  }
                />

                <button
                  type="button"
                  className="primary-btn"
                  onClick={
                    handleCustomerRegister
                  }
                  disabled={
                    isAuthLoading
                  }
                >
                  {isAuthLoading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                {authMessage && (
                  <p className="auth-message">
                    {authMessage}
                  </p>
                )}

                <p className="auth-switch">
                  Already have an account?
                </p>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    openCustomerLogin
                  }
                >
                  Customer Login
                </button>

                <button
                  type="button"
                  className="text-btn"
                  onClick={
                    openAdminLogin
                  }
                >
                  Admin Login
                </button>
              </>
            )}

            {/* ADMIN LOGIN */}
            {isAdminLogin && (
              <>
                <h2>Admin Login</h2>

                <p className="auth-subtitle">
                  Admin access for DK TEXTILE
                  management.
                </p>

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter admin mobile number"
                  value={authForm.mobile}
                  onChange={
                    handleAuthChange
                  }
                />

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={
                    authForm.password
                  }
                  onChange={
                    handleAuthChange
                  }
                />

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleLogin("admin")
                  }
                  disabled={
                    isAuthLoading
                  }
                >
                  {isAuthLoading
                    ? "Logging in..."
                    : "Admin Login"}
                </button>

                {authMessage && (
                  <p className="auth-message">
                    {authMessage}
                  </p>
                )}

                <button
                  type="button"
                  className="text-btn"
                  onClick={
                    openCustomerLogin
                  }
                >
                  Customer Login
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    );
  }

  // =========================
  // ADMIN ORDERS PAGE
  // =========================
  if (showOrdersPage) {
    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      return (
        <div className="app">
          <nav className="navbar">
            <h1 className="logo">
              DK TEXTILE
            </h1>

            <button
              className="login-btn"
              onClick={
                openAdminLogin
              }
            >
              Admin Login
            </button>
          </nav>

          <section className="auth-page">
            <div className="auth-container">
              <h2>
                Admin Access Required
              </h2>

              <p>
                Please login with an admin
                account to view customer
                orders.
              </p>

              <button
                className="primary-btn"
                onClick={
                  openAdminLogin
                }
              >
                Admin Login
              </button>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">
            DK TEXTILE
          </h1>

          <div className="nav-links">
            <span>
              Welcome,{" "}
              {currentUser.name}
            </span>
          </div>

          <div className="auth-buttons">
            <button
              className="login-btn"
              onClick={
                closeOrdersPage
              }
            >
              Back to Website
            </button>

            <button
              className="login-btn logout-btn"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </div>
        </nav>

        <section className="orders-page">
          <div className="orders-header">
            <div>
              <h2>
                Customer Orders
              </h2>

              <p>
                View all orders placed
                by customers.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={
                loadOrders
              }
            >
              Refresh Orders
            </button>
          </div>

          {ordersLoading ? (
            <p className="loading-text">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="loading-text">
              No orders available.
            </p>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>
                      Order ID
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Mobile
                    </th>

                    <th>
                      Address
                    </th>

                    <th>
                      Total Price
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(
                    (order) => (
                      <tr
                        key={
                          order.id
                        }
                      >
                        <td>
                          #
                          {
                            order.id
                          }
                        </td>

                        <td>
                          {
                            order.product_name
                          }
                        </td>

                        <td>
                          {
                            order.quantity
                          }
                        </td>

                        <td>
                          {
                            order.customer_name
                          }
                        </td>

                        <td>
                          {
                            order.mobile
                          }
                        </td>

                        <td>
                          {
                            order.address
                          }
                        </td>

                        <td>
                          ₹{" "}
                          {
                            order.total_price
                          }
                        </td>

                        <td>
                          <select
                            className="order-status-select"
                            value={
                              order.status ||
                              "Pending"
                            }
                            onChange={(
                              e
                            ) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Packed">
                              Packed
                            </option>

                            <option value="Dispatched">
                              Dispatched
                            </option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>
                          </select>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  // =========================
  // CART PAGE
  // =========================
  if (showCartPage) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">
            DK TEXTILE
          </h1>

          <div className="auth-buttons">
            {currentUser ? (
              <>
                <span className="user-welcome">
                  Hi,{" "}
                  {currentUser.name}
                </span>

                {currentUser.role ===
                  "admin" && (
                  <button
                    className="login-btn"
                    onClick={
                      openOrdersPage
                    }
                  >
                    Admin Orders
                  </button>
                )}

                <button
                  className="login-btn logout-btn"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-btn"
                  onClick={
                    openCustomerLogin
                  }
                >
                  Customer Login
                </button>

                <button
                  className="login-btn"
                  onClick={
                    openAdminLogin
                  }
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </nav>

        <section className="products-section">
          <button
            className="back-btn"
            onClick={
              closeCartPage
            }
          >
            ← Back to Products
          </button>

          <h2>
            🛒 Shopping Cart
          </h2>

          {cart.length === 0 ? (
            <div className="auth-container">
              <h2>
                Your Cart is Empty
              </h2>

              <p>
                Add products to your
                cart to continue.
              </p>

              <button
                className="primary-btn"
                onClick={
                  closeCartPage
                }
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="product-container">
                {cart.map(
                  (item) => (
                    <div
                      className="product-card"
                      key={item.id}
                    >
                      {item.image_path ? (
                        <img
                          src={getFileUrl(
                            item.image_path
                          )}
                          alt={
                            item.name
                          }
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">
                          No Image Available
                        </div>
                      )}

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        <strong>
                          Product Code:
                        </strong>{" "}
                        {
                          item.product_code
                        }
                      </p>

                      <p>
                        <strong>
                          Wholesale Price:
                        </strong>{" "}
                        ₹{" "}
                        {
                          item.wholesale_price
                        }
                      </p>

                      <p>
                        <strong>
                          Available Stock:
                        </strong>{" "}
                        {
                          item.stock
                        }
                      </p>

                      <p>
                        <strong>
                          Minimum Order:
                        </strong>{" "}
                        {
                          item.minimum_order_quantity
                        }
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          gap: "10px",
                          margin:
                            "15px 0",
                        }}
                      >
                        <button
                          type="button"
                          className="login-btn"
                          onClick={() =>
                            decreaseCartQuantity(
                              item.id
                            )
                          }
                        >
                          −
                        </button>

                        <strong
                          style={{
                            fontSize:
                              "18px",
                          }}
                        >
                          {
                            item.quantity
                          }
                        </strong>

                        <button
                          type="button"
                          className="login-btn"
                          onClick={() =>
                            increaseCartQuantity(
                              item.id
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <p className="price">
                        ₹{" "}
                        {(
                          Number(
                            item.wholesale_price ||
                              item.price ||
                              0
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  )
                )}
              </div>

              <div
                className="auth-container"
                style={{
                  marginTop:
                    "30px",
                }}
              >
                <h2>
                  Cart Summary
                </h2>

                <p>
                  <strong>
                    Total Products:
                  </strong>{" "}
                  {cart.length}
                </p>

                <p>
                  <strong>
                    Total Quantity:
                  </strong>{" "}
                  {cart.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.quantity
                      ),
                    0
                  )}
                </p>

                <h2>
                  Total: ₹{" "}
                  {getCartTotal().toFixed(
                    2
                  )}
                </h2>

                <button
                  type="button"
                  className="login-btn"
                  onClick={
                    clearCart
                  }
                  style={{
                    marginRight:
                      "10px",
                  }}
                >
                  🧹 Clear Cart
                </button>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (
                      !currentUser ||
                      currentUser.role !==
                        "customer"
                    ) {
                      openCustomerLogin();
                      return;
                    }

                    setCheckoutForm(
                      {
                        name:
                          currentUser.name ||
                          "",
                        mobile:
                          currentUser.mobile ||
                          "",
                        address:
                          "",
                      }
                    );

                    setCheckoutMessage(
                      ""
                    );
                  }}
                >
                  📦 Proceed to Checkout
                </button>

                <div
                  style={{
                    marginTop:
                      "25px",
                  }}
                >
                  <h3>
                    Checkout Details
                  </h3>

                  <label>
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={
                      checkoutForm.name
                    }
                    onChange={
                      handleCheckoutChange
                    }
                  />

                  <label>
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={
                      checkoutForm.mobile
                    }
                    onChange={
                      handleCheckoutChange
                    }
                  />

                  <label>
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    placeholder="Enter delivery address"
                    rows="4"
                    value={
                      checkoutForm.address
                    }
                    onChange={
                      handleCheckoutChange
                    }
                  />

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={
                      handleCartCheckout
                    }
                    disabled={
                      isCheckingOut
                    }
                  >
                    {isCheckingOut
                      ? "Placing Orders..."
                      : "Place Cart Order"}
                  </button>

                  {checkoutMessage && (
                    <p className="order-message">
                      {
                        checkoutMessage
                      }
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  // =========================
  // PRODUCT DETAILS PAGE
  // =========================
  if (selectedProduct) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">
            DK TEXTILE
          </h1>

          <div className="auth-buttons">
            <button
              className="login-btn"
              onClick={
                openCartPage
              }
            >
              🛒 Cart ({cart.length})
            </button>

            {currentUser ? (
              <>
                <span className="user-welcome">
                  Hi,{" "}
                  {currentUser.name}
                </span>

                {currentUser.role ===
                  "admin" && (
                  <button
                    className="login-btn"
                    onClick={
                      openOrdersPage
                    }
                  >
                    Admin Orders
                  </button>
                )}

                <button
                  className="login-btn logout-btn"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-btn"
                  onClick={
                    openCustomerLogin
                  }
                >
                  Customer Login
                </button>

                <button
                  className="login-btn"
                  onClick={
                    openAdminLogin
                  }
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </nav>

        <section className="product-details-page">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedProduct(
                null
              );

              setShowOrderPopup(
                false
              );

              setOrderMessage(
                ""
              );
            }}
          >
            ← Back to Products
          </button>

          <div className="product-details-container">
            <div className="product-details-media">
              {selectedProduct.image_path ? (
                <img
                  src={getFileUrl(
                    selectedProduct.image_path
                  )}
                  alt={
                    selectedProduct.name
                  }
                  className="details-image"
                />
              ) : (
                <div className="no-image">
                  No Image Available
                </div>
              )}

              {selectedProduct.video_path && (
                <video
                  controls
                  className="details-video"
                >
                  <source
                    src={getFileUrl(
                      selectedProduct.video_path
                    )}
                    type="video/mp4"
                  />

                  Your browser does
                  not support the video
                  tag.
                </video>
              )}
            </div>

            <div className="product-details-info">
              <h2>
                {selectedProduct.name}
              </h2>

              <p>
                <strong>
                  Product Code:
                </strong>{" "}
                {
                  selectedProduct.product_code
                }
              </p>

              <p>
                <strong>
                  Fabric:
                </strong>{" "}
                {
                  selectedProduct.fabric
                }
              </p>

              <p>
                <strong>
                  Color:
                </strong>{" "}
                {
                  selectedProduct.color
                }
              </p>

              <p>
                <strong>
                  Retail Price:
                </strong>{" "}
                ₹{" "}
                {
                  selectedProduct.price
                }
              </p>

              <p>
                <strong>
                  Wholesale Price:
                </strong>{" "}
                ₹{" "}
                {
                  selectedProduct.wholesale_price
                }
              </p>

              <p>
                <strong>
                  Available Stock:
                </strong>{" "}
                {
                  selectedProduct.stock
                }
              </p>

              <p>
                <strong>
                  Minimum Order Quantity:
                </strong>{" "}
                {
                  selectedProduct.minimum_order_quantity
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  selectedProduct.status
                }
              </p>

              <p className="details-description">
                <strong>
                  Description:
                </strong>

                <br />

                {
                  selectedProduct.description
                }
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={
                  openOrderPopup
                }
                disabled={
                  Number(
                    selectedProduct.stock
                  ) <= 0
                }
              >
                {Number(
                  selectedProduct.stock
                ) <= 0
                  ? "Out of Stock"
                  : "Order Now"}
              </button>

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  addToCart(
                    selectedProduct
                  )
                }
                disabled={
                  Number(
                    selectedProduct.stock
                  ) <= 0
                }
              >
                Add to Cart
              </button>

              <button
                type="button"
                className="login-btn"
                onClick={
                  openCartPage
                }
              >
                🛒 View Cart (
                {cart.length})
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
                  onClick={() => {
                    setShowOrderPopup(
                      false
                    );

                    setOrderMessage(
                      ""
                    );
                  }}
                >
                  ×
                </button>

                <h2>
                  Place Your Order
                </h2>

                <h3>
                  {
                    selectedProduct.name
                  }
                </h3>

                <p>
                  <strong>
                    Product Code:
                  </strong>{" "}
                  {
                    selectedProduct.product_code
                  }
                </p>

                <p>
                  <strong>
                    Wholesale Price:
                  </strong>{" "}
                  ₹{" "}
                  {
                    selectedProduct.wholesale_price
                  }
                </p>

                <p>
                  <strong>
                    Available Stock:
                  </strong>{" "}
                  {
                    selectedProduct.stock
                  }
                </p>

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min={
                    selectedProduct.minimum_order_quantity
                  }
                  max={
                    selectedProduct.stock
                  }
                  value={
                    orderForm.quantity
                  }
                  onChange={(e) =>
                    setOrderForm(
                      {
                        ...orderForm,
                        quantity:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={
                    orderForm.name
                  }
                  onChange={(e) =>
                    setOrderForm(
                      {
                        ...orderForm,
                        name: e.target
                          .value,
                      }
                    )
                  }
                />

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={
                    orderForm.mobile
                  }
                  onChange={(e) =>
                    setOrderForm(
                      {
                        ...orderForm,
                        mobile:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <label>
                  Delivery Address
                </label>

                <textarea
                  placeholder="Enter delivery address"
                  rows="4"
                  value={
                    orderForm.address
                  }
                  onChange={(e) =>
                    setOrderForm(
                      {
                        ...orderForm,
                        address:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <button
                  type="button"
                  className="primary-btn"
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={
                    isPlacingOrder
                  }
                >
                  {isPlacingOrder
                    ? "Placing Order..."
                    : "Place Order"}
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
      </div>
    );
  }

  // =========================
  // HOME PAGE
  // =========================
  return (
    <div className="app">

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <h1 className="logo">
          DK TEXTILE
        </h1>

        <div className="nav-links">
          <a href="#home">
            Home
          </a>

          <a href="#products">
            Products
          </a>

          <a href="#about">
            About Us
          </a>

          <a href="#contact">
            Contact
          </a>
        </div>

        <div className="auth-buttons">
          <button
            className="login-btn"
            onClick={
              openCartPage
            }
          >
            🛒 Cart ({cart.length})
          </button>

          {currentUser ? (
            <>
              <span className="user-welcome">
                Hi,{" "}
                {currentUser.name}
              </span>

              {currentUser.role ===
                "admin" && (
                <button
                  className="login-btn"
                  onClick={
                    openOrdersPage
                  }
                >
                  Admin Orders
                </button>
              )}

              <button
                className="login-btn logout-btn"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={
                  openCustomerLogin
                }
              >
                Customer Login
              </button>

              <button
                className="login-btn"
                onClick={
                  openAdminLogin
                }
              >
                Admin Login
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero"
        id="home"
      >
        <div className="hero-content">
          <h2>
            Premium Textile Products
            for Every Business
          </h2>

          <p>
            DK TEXTILE provides quality
            fabrics and textile products
            for shopkeepers and customers
            across India.
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              document
                .getElementById(
                  "products"
                )
                .scrollIntoView({
                  behavior:
                    "smooth",
                })
            }
          >
            Explore Products
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        className="products-section"
        id="products"
      >
        <h2>
          Our Products
        </h2>

        <div className="product-container">
          {products.length === 0 ? (
            <p>
              Loading products...
            </p>
          ) : (
            products.map(
              (product) => (
                <div
                  className="product-card"
                  key={product.id}
                >
                  {product.image_path ? (
                    <img
                      src={getFileUrl(
                        product.image_path
                      )}
                      alt={
                        product.name
                      }
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">
                      No Image Available
                    </div>
                  )}

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    <strong>
                      Fabric:
                    </strong>{" "}
                    {
                      product.fabric
                    }
                  </p>

                  <p>
                    <strong>
                      Color:
                    </strong>{" "}
                    {
                      product.color
                    }
                  </p>

                  <p className="price">
                    ₹{" "}
                    {
                      product.price
                    }
                  </p>

                  <p>
                    {
                      product.description
                    }
                  </p>

                  {/* PRODUCT VIDEO */}
                  {product.video_path && (
                    <video
                      controls
                      className="product-video"
                    >
                      <source
                        src={getFileUrl(
                          product.video_path
                        )}
                        type="video/mp4"
                      />

                      Your browser
                      does not support
                      the video tag.
                    </video>
                  )}

                  <button
                    className="primary-btn"
                    onClick={() =>
                      setSelectedProduct(
                        product
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              )
            )
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >
        <h2>
          About DK TEXTILE
        </h2>

        <p>
          DK TEXTILE is a textile
          manufacturing and supply
          business offering a wide
          variety of quality products.
          We serve shopkeepers and
          customers across India with
          reliable production,
          wholesale supply, and product
          ordering services.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        className="footer"
        id="contact"
      >
        <h2>
          DK TEXTILE
        </h2>

        <p>
          Quality Textile Products •
          Wholesale Orders • Delivery
          Across India
        </p>

        <p>
          © 2026 DK TEXTILE. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;