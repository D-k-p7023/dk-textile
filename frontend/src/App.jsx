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
  // ADMIN PRODUCT MANAGEMENT
  // =========================
  const [showAdminProductsPage, setShowAdminProductsPage] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [addProductForm, setAddProductForm] = useState({
    product_code: "",
    name: "",
    category_id: "",
    fabric: "",
    color: "",
    price: "",
    wholesale_price: "",
    stock: "",
    minimum_order_quantity: "1",
    description: "",
    status: "Active",
  });
  const [addProductImage, setAddProductImage] = useState(null);
  const [addProductVideo, setAddProductVideo] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    product_code: "",
    name: "",
    category_id: "",
    fabric: "",
    color: "",
    price: "",
    wholesale_price: "",
    stock: "",
    minimum_order_quantity: "1",
    description: "",
    status: "Active",
  });
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editProductVideo, setEditProductVideo] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // =========================
  // INVENTORY MANAGEMENT
  // =========================
  const [showInventoryPage, setShowInventoryPage] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("All");
  const [inventoryAdjustments, setInventoryAdjustments] = useState({});
  const [inventoryUpdatingId, setInventoryUpdatingId] = useState(null);
  const [inventoryHistory, setInventoryHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("dk_textile_inventory_history");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Unable to load inventory history:", error);
      return [];
    }
  });
  const [inventoryHistoryFilter, setInventoryHistoryFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      "dk_textile_inventory_history",
      JSON.stringify(inventoryHistory.slice(0, 200))
    );
  }, [inventoryHistory]);

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
  const [showDashboard, setShowDashboard] = useState(false);

  const [orders, setOrders] = useState([]);
  const [salesFilter, setSalesFilter] = useState("all");
  const [ordersLoading, setOrdersLoading] =
    useState(false);

  // =========================
  // LOAD PRODUCTS
  // =========================
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error("Failed to load products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
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
  // PUBLIC PRODUCT CATALOGUE FILTERS
  // =========================
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [catalogueFabricFilter, setCatalogueFabricFilter] = useState("All");
  const [catalogueColorFilter, setCatalogueColorFilter] = useState("All");
  const [catalogueStockFilter, setCatalogueStockFilter] = useState("All");
  const [catalogueSort, setCatalogueSort] = useState("featured");

  const catalogueFabrics = [...new Set(
    products
      .map((product) => String(product.fabric || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const catalogueColors = [...new Set(
    products
      .map((product) => String(product.color || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const filteredCatalogueProducts = products
    .filter((product) => {
      const search = catalogueSearch.trim().toLowerCase();
      const matchesSearch =
        !search ||
        String(product.product_code || "").toLowerCase().includes(search) ||
        String(product.name || "").toLowerCase().includes(search) ||
        String(product.fabric || "").toLowerCase().includes(search) ||
        String(product.color || "").toLowerCase().includes(search) ||
        String(product.description || "").toLowerCase().includes(search);

      const matchesFabric =
        catalogueFabricFilter === "All" ||
        String(product.fabric || "") === catalogueFabricFilter;

      const matchesColor =
        catalogueColorFilter === "All" ||
        String(product.color || "") === catalogueColorFilter;

      const matchesStock =
        catalogueStockFilter === "All" ||
        (catalogueStockFilter === "In Stock" && Number(product.stock || 0) > 0) ||
        (catalogueStockFilter === "Out of Stock" && Number(product.stock || 0) <= 0);

      return matchesSearch && matchesFabric && matchesColor && matchesStock;
    })
    .sort((a, b) => {
      if (catalogueSort === "name-asc") {
        return String(a.name || "").localeCompare(String(b.name || ""));
      }
      if (catalogueSort === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }
      if (catalogueSort === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }
      if (catalogueSort === "stock-high") {
        return Number(b.stock || 0) - Number(a.stock || 0);
      }
      return Number(a.id || 0) - Number(b.id || 0);
    });

  const clearCatalogueFilters = () => {
    setCatalogueSearch("");
    setCatalogueFabricFilter("All");
    setCatalogueColorFilter("All");
    setCatalogueStockFilter("All");
    setCatalogueSort("featured");
  };

  // =========================
  // ADMIN PRODUCT FILTERS
  // =========================
  const getStockInfo = (stock) => {
    const value = Number(stock || 0);
    if (value <= 0) return { label: "Out of Stock", key: "Out", className: "stock-out" };
    if (value <= 20) return { label: "Low Stock", key: "Low", className: "stock-low" };
    return { label: "In Stock", key: "In", className: "stock-in" };
  };

  const filteredAdminProducts = products.filter((product) => {
    const search = productSearch.trim().toLowerCase();
    const matchesSearch = !search ||
      String(product.product_code || "").toLowerCase().includes(search) ||
      String(product.name || "").toLowerCase().includes(search) ||
      String(product.fabric || "").toLowerCase().includes(search) ||
      String(product.color || "").toLowerCase().includes(search);

    const matchesStock =
      stockFilter === "All" || getStockInfo(product.stock).key === stockFilter;

    const matchesStatus =
      statusFilter === "All" || (product.status || "Active") === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || String(product.category_id) === String(categoryFilter);

    return matchesSearch && matchesStock && matchesStatus && matchesCategory;
  });

  const adminInStockCount = products.filter((product) => getStockInfo(product.stock).key === "In").length;
  const adminLowStockCount = products.filter((product) => getStockInfo(product.stock).key === "Low").length;
  const adminOutOfStockCount = products.filter((product) => getStockInfo(product.stock).key === "Out").length;
  const adminActiveCount = products.filter((product) => (product.status || "Active") === "Active").length;
  const adminCategoryIds = [...new Set(products.map((product) => product.category_id).filter((id) => id !== null && id !== undefined))].sort((a, b) => Number(a) - Number(b));

  // =========================
  // INVENTORY MANAGEMENT
  // =========================
  const openInventoryPage = () => {
    if (!currentUser || currentUser.role !== "admin") {
      openAdminLogin();
      return;
    }

    setShowAuthPage(false);
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);
    setEditingProduct(null);
    setShowAddProductForm(false);
    setShowAdminProductsPage(false);
    setShowInventoryPage(true);
    setShowDashboard(false);
    loadProducts();
  };

  const handleInventoryAdjustmentChange = (productId, value) => {
    setInventoryAdjustments((current) => ({
      ...current,
      [productId]: value,
    }));
  };

  const addInventoryHistory = ({
    product,
    type,
    quantity,
    previousStock,
    newStock,
    orderId = null,
    customerName = "Admin",
  }) => {
    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      product_id: product.id,
      product_code: product.product_code || "-",
      product_name: product.name || "-",
      type,
      quantity: Number(quantity),
      previous_stock: Number(previousStock),
      new_stock: Number(newStock),
      order_id: orderId,
      customer_name: customerName || "-",
      created_at: new Date().toISOString(),
    };

    setInventoryHistory((current) => [historyEntry, ...current].slice(0, 200));
  };

  const clearInventoryHistory = () => {
    if (inventoryHistory.length === 0) return;

    if (window.confirm("Are you sure you want to clear all inventory history on this browser?")) {
      setInventoryHistory([]);
    }
  };

  const handleAdjustStock = async (product, action) => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("❌ Only admin can update inventory.");
      return;
    }

    const amount = Number(inventoryAdjustments[product.id] || 0);

    if (!Number.isInteger(amount) || amount <= 0) {
      alert("Please enter a whole number greater than 0.");
      return;
    }

    const currentStock = Number(product.stock || 0);
    const newStock = action === "add"
      ? currentStock + amount
      : currentStock - amount;

    if (newStock < 0) {
      alert("❌ Stock cannot be negative.");
      return;
    }

    setInventoryUpdatingId(product.id);

    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update stock.");
      }

      const updatedProduct = data.product;

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id ? updatedProduct : item
        )
      );

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === product.id
            ? { ...updatedProduct, quantity: item.quantity }
            : item
        )
      );

      setInventoryAdjustments((current) => ({
        ...current,
        [product.id]: "",
      }));

      addInventoryHistory({
        product: updatedProduct,
        type: action === "add" ? "Stock Added" : "Stock Removed",
        quantity: amount,
        previousStock: currentStock,
        newStock,
        customerName: currentUser.name || "Admin",
      });

      alert(
        action === "add"
          ? `✅ ${amount} unit(s) added. New stock: ${newStock}`
          : `✅ ${amount} unit(s) removed. New stock: ${newStock}`
      );
    } catch (error) {
      console.error("Inventory update error:", error);
      alert(`❌ ${error.message || "Unable to update stock."}`);
    } finally {
      setInventoryUpdatingId(null);
    }
  };

  const filteredInventoryProducts = products.filter((product) => {
    const search = inventorySearch.trim().toLowerCase();

    const matchesSearch =
      !search ||
      String(product.product_code || "").toLowerCase().includes(search) ||
      String(product.name || "").toLowerCase().includes(search) ||
      String(product.fabric || "").toLowerCase().includes(search) ||
      String(product.color || "").toLowerCase().includes(search);

    const matchesStock =
      inventoryStockFilter === "All" ||
      getStockInfo(product.stock).key === inventoryStockFilter;

    return matchesSearch && matchesStock;
  });

  const totalInventoryQuantity = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const totalInventoryWholesaleValue = products.reduce(
    (total, product) =>
      total +
      Number(product.stock || 0) *
        Number(product.wholesale_price ?? product.price ?? 0),
    0
  );

  const totalInventoryRetailValue = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0) * Number(product.price || 0),
    0
  );

  const filteredInventoryHistory = inventoryHistory.filter((entry) => {
    if (inventoryHistoryFilter === "All") return true;
    return entry.type === inventoryHistoryFilter;
  });

  // =========================
  // ADMIN PRODUCT MANAGEMENT
  // =========================
  const openAdminProductsPage = () => {
    if (!currentUser || currentUser.role !== "admin") {
      openAdminLogin();
      return;
    }

    setShowAuthPage(false);
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);
    setEditingProduct(null);
    setShowAddProductForm(false);
    setShowAdminProductsPage(true);
    setShowDashboard(false);
    setShowInventoryPage(false);
    loadProducts();
  };

  const handleAddProductChange = (e) => {
    setAddProductForm({
      ...addProductForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetAddProductForm = () => {
    setAddProductForm({
      product_code: "",
      name: "",
      category_id: "",
      fabric: "",
      color: "",
      price: "",
      wholesale_price: "",
      stock: "",
      minimum_order_quantity: "1",
      description: "",
      status: "Active",
    });
    setAddProductImage(null);
    setAddProductVideo(null);
  };

  const handleAddProduct = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("❌ Only admin can add products.");
      return;
    }

    if (!addProductForm.product_code.trim()) {
      alert("Please enter product code.");
      return;
    }
    if (!addProductForm.name.trim()) {
      alert("Please enter product name.");
      return;
    }
    if (!addProductForm.category_id) {
      alert("Please enter category ID.");
      return;
    }
    if (Number(addProductForm.price || 0) < 0) {
      alert("Price cannot be negative.");
      return;
    }
    if (Number(addProductForm.stock || 0) < 0) {
      alert("Stock cannot be negative.");
      return;
    }
    if (Number(addProductForm.minimum_order_quantity || 1) < 1) {
      alert("Minimum order quantity must be at least 1.");
      return;
    }

    setIsAddingProduct(true);

    try {
      const params = new URLSearchParams();
      params.append("product_code", addProductForm.product_code.trim());
      params.append("name", addProductForm.name.trim());
      params.append("category_id", String(Number(addProductForm.category_id)));
      params.append("fabric", addProductForm.fabric.trim());
      params.append("color", addProductForm.color.trim());
      params.append("price", String(Number(addProductForm.price || 0)));
      params.append(
        "wholesale_price",
        addProductForm.wholesale_price === ""
          ? ""
          : String(Number(addProductForm.wholesale_price))
      );
      params.append("stock", String(Number(addProductForm.stock || 0)));
      params.append(
        "minimum_order_quantity",
        String(Number(addProductForm.minimum_order_quantity || 1))
      );
      params.append("description", addProductForm.description.trim());
      params.append("status", addProductForm.status);

      // The FastAPI POST /products endpoint expects these values
      // as query parameters, not as a form-encoded request body.
      const response = await fetch(
        `${API_URL}/products?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : data.detail;
        throw new Error(detail || "Failed to add product.");
      }

      const createdProduct = data.product;
      let imageUploaded = false;
      let videoUploaded = false;

      // Upload product image after the product has been created.
      if (addProductImage) {
        const imageFormData = new FormData();
        imageFormData.append("file", addProductImage);

        const imageResponse = await fetch(
          `${API_URL}/products/${createdProduct.id}/image`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const imageData = await imageResponse.json();
        if (!imageResponse.ok) {
          throw new Error(
            imageData.detail || "Product was added, but image upload failed."
          );
        }
        imageUploaded = true;
      }

      // Upload product video after the product has been created.
      if (addProductVideo) {
        const videoFormData = new FormData();
        videoFormData.append("file", addProductVideo);

        const videoResponse = await fetch(
          `${API_URL}/products/${createdProduct.id}/video`,
          {
            method: "POST",
            body: videoFormData,
          }
        );

        const videoData = await videoResponse.json();
        if (!videoResponse.ok) {
          throw new Error(
            videoData.detail || "Product was added, but video upload failed."
          );
        }
        videoUploaded = true;
      }

      if (imageUploaded && videoUploaded) {
        alert("✅ Product, image and video added successfully!");
      } else if (imageUploaded) {
        alert("✅ Product and image added successfully!");
      } else if (videoUploaded) {
        alert("✅ Product and video added successfully!");
      } else {
        alert("✅ Product added successfully!");
      }

      resetAddProductForm();
      setShowAddProductForm(false);
      await loadProducts();
    } catch (error) {
      console.error("Add product error:", error);
      alert(`❌ ${error.message || "Unable to add product."}`);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setEditProductImage(null);
    setEditProductVideo(null);
    setEditProductForm({
      product_code: product.product_code || "",
      name: product.name || "",
      category_id: product.category_id ?? "",
      fabric: product.fabric || "",
      color: product.color || "",
      price: product.price ?? "",
      wholesale_price: product.wholesale_price ?? "",
      stock: product.stock ?? "",
      minimum_order_quantity: product.minimum_order_quantity ?? 1,
      description: product.description || "",
      status: product.status || "Active",
    });
  };

  const handleEditProductChange = (e) => {
    setEditProductForm({
      ...editProductForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (!currentUser || currentUser.role !== "admin") {
      alert("❌ Only admin can update products.");
      return;
    }

    if (!editProductForm.product_code.trim()) {
      alert("Please enter product code.");
      return;
    }
    if (!editProductForm.name.trim()) {
      alert("Please enter product name.");
      return;
    }
    if (!editProductForm.category_id) {
      alert("Please enter category ID.");
      return;
    }

    setIsUpdatingProduct(true);

    try {
      const response = await fetch(
        `${API_URL}/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_code: editProductForm.product_code.trim(),
            name: editProductForm.name.trim(),
            category_id: Number(editProductForm.category_id),
            fabric: editProductForm.fabric.trim(),
            color: editProductForm.color.trim(),
            price: Number(editProductForm.price || 0),
            wholesale_price:
              editProductForm.wholesale_price === ""
                ? null
                : Number(editProductForm.wholesale_price),
            stock: Number(editProductForm.stock || 0),
            minimum_order_quantity: Number(
              editProductForm.minimum_order_quantity || 1
            ),
            description: editProductForm.description.trim(),
            status: editProductForm.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update product.");
      }

      const updatedProduct = data.product;
      let imageChanged = false;
      let videoChanged = false;

      // Upload a replacement image if the admin selected one.
      if (editProductImage) {
        const imageFormData = new FormData();
        imageFormData.append("file", editProductImage);
        const imageResponse = await fetch(
          `${API_URL}/products/${editingProduct.id}/image`,
          { method: "POST", body: imageFormData }
        );
        const imageData = await imageResponse.json();
        if (!imageResponse.ok) {
          throw new Error(
            imageData.detail || "Product updated, but image upload failed."
          );
        }
        imageChanged = true;
      }

      // Upload a replacement video if the admin selected one.
      if (editProductVideo) {
        const videoFormData = new FormData();
        videoFormData.append("file", editProductVideo);
        const videoResponse = await fetch(
          `${API_URL}/products/${editingProduct.id}/video`,
          { method: "POST", body: videoFormData }
        );
        const videoData = await videoResponse.json();
        if (!videoResponse.ok) {
          throw new Error(
            videoData.detail || "Product updated, but video upload failed."
          );
        }
        videoChanged = true;
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id ? updatedProduct : product
        )
      );

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === editingProduct.id
            ? { ...updatedProduct, quantity: item.quantity }
            : item
        )
      );

      if (imageChanged && videoChanged) {
        alert("✅ Product, image and video updated successfully!");
      } else if (imageChanged) {
        alert("✅ Product and image updated successfully!");
      } else if (videoChanged) {
        alert("✅ Product and video updated successfully!");
      } else {
        alert("✅ Product updated successfully!");
      }
      setEditProductImage(null);
      setEditProductVideo(null);
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      console.error("Update product error:", error);
      alert(`❌ ${error.message || "Unable to update product."}`);
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("❌ Only admin can delete products.");
      return;
    }

    const productToDelete = products.find(
      (product) => product.id === productId
    );
    const productName = productToDelete?.name || "this product";

    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${productId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete product");
      }

      alert("✅ Product deleted successfully!");
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
      );
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
      }
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Delete product error:", error);
      alert(`❌ ${error.message || "Unable to delete product."}`);
    }
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
          setShowAuthPage(false);
          setShowOrdersPage(false);
          setShowCartPage(false);
          setSelectedProduct(null);
          setShowOrderPopup(false);
          setShowAdminProductsPage(false);
          setShowInventoryPage(false);
          setShowDashboard(true);
          loadProducts();
          loadOrders();
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
    setShowDashboard(false);
    setShowAdminProductsPage(false);
    setShowInventoryPage(false);
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
  // OPEN ADMIN DASHBOARD
  // =========================
  const openDashboard = () => {
    if (!currentUser || currentUser.role !== "admin") {
      openAdminLogin();
      return;
    }

    setShowAuthPage(false);
    setShowOrdersPage(false);
    setShowCartPage(false);
    setSelectedProduct(null);
    setShowOrderPopup(false);
    setShowAdminProductsPage(false);
    setShowInventoryPage(false);
    setShowDashboard(true);
    loadProducts();
    loadOrders();
  };

  // =========================
  // CLOSE ADMIN DASHBOARD
  // =========================
  const closeDashboard = () => {
    setShowDashboard(false);
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
    setShowDashboard(false);
    setShowInventoryPage(false);

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

      const orderId = data.order?.id || null;
      const previousStock = Number(selectedProduct.stock || 0);
      const newStock = previousStock - orderedQuantity;

      addInventoryHistory({
        product: selectedProduct,
        type: "Customer Order",
        quantity: orderedQuantity,
        previousStock,
        newStock,
        orderId,
        customerName: orderForm.name,
      });

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

        const orderedQuantity = Number(item.quantity);
        const previousStock = Number(item.stock || 0);
        const newStock = previousStock - orderedQuantity;

        addInventoryHistory({
          product: item,
          type: "Customer Order",
          quantity: orderedQuantity,
          previousStock,
          newStock,
          orderId: data.order?.id || null,
          customerName: checkoutForm.name,
        });
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
  // ADVANCED ADMIN DASHBOARD
  // =========================
  if (showDashboard) {
    if (!currentUser || currentUser.role !== "admin") {
      return (
        <div className="app">
          <nav className="navbar">
            <h1 className="logo">DK TEXTILE</h1>
            <button className="login-btn" onClick={openAdminLogin}>
              Admin Login
            </button>
          </nav>
          <section className="auth-page">
            <div className="auth-container">
              <h2>Admin Access Required</h2>
              <p>Please login with an admin account to view the dashboard.</p>
              <button className="primary-btn" onClick={openAdminLogin}>
                Admin Login
              </button>
            </div>
          </section>
        </div>
      );
    }

  // =========================
  // STEP 6.3 + STEP 6.4 - SALES SUMMARY & FILTERS
  // =========================

  const getSalesFilteredOrders = () => {
    if (salesFilter === "all") return orders;

    const now = new Date();

    return orders.filter((order) => {
      // The date filter uses created_at when the backend provides it.
      // Older orders without a date remain available in All Time.
      if (!order.created_at) return false;

      const orderDate = new Date(order.created_at);
      if (Number.isNaN(orderDate.getTime())) return false;

      if (salesFilter === "today") {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (salesFilter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return orderDate >= startOfWeek && orderDate <= now;
      }

      if (salesFilter === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredSalesOrders = getSalesFilteredOrders();

  const dashboardFilteredTotalSales = filteredSalesOrders.reduce(
    (total, order) => total + Number(order.total_price || 0),
    0
  );

  const dashboardFilteredTotalQuantity = filteredSalesOrders.reduce(
    (total, order) => total + Number(order.quantity || 0),
    0
  );

  const dashboardFilteredDeliveredOrders = filteredSalesOrders.filter(
    (order) => (order.status || "Pending") === "Delivered"
  ).length;

  const dashboardFilteredPendingOrders = filteredSalesOrders.filter(
    (order) => (order.status || "Pending") === "Pending"
  ).length;

  const dashboardFilteredConfirmedOrders = filteredSalesOrders.filter(
    (order) => (order.status || "Pending") === "Confirmed"
  ).length;

  const dashboardFilteredProcessingOrders = filteredSalesOrders.filter(
    (order) => (order.status || "Pending") === "Processing"
  ).length;

  const dashboardFilteredDeliveredSales = filteredSalesOrders
    .filter((order) => (order.status || "Pending") === "Delivered")
    .reduce((total, order) => total + Number(order.total_price || 0), 0);

  const dashboardFilteredPendingSales = filteredSalesOrders
    .filter((order) => (order.status || "Pending") === "Pending")
    .reduce((total, order) => total + Number(order.total_price || 0), 0);

  const dashboardFilteredAverageOrderValue =
    filteredSalesOrders.length > 0
      ? dashboardFilteredTotalSales / filteredSalesOrders.length
      : 0;

  const dashboardFilteredProductSales = filteredSalesOrders.reduce(
    (result, order) => {
      const name = order.product_name || "Unknown Product";
      if (!result[name]) {
        result[name] = { quantity: 0, sales: 0 };
      }
      result[name].quantity += Number(order.quantity || 0);
      result[name].sales += Number(order.total_price || 0);
      return result;
    },
    {}
  );

  const dashboardFilteredSalesChartData = Object.entries(
    dashboardFilteredProductSales
  )
    .sort((a, b) => b[1].sales - a[1].sales)
    .slice(0, 7);

  const dashboardFilteredMaxSales = Math.max(
    1,
    ...dashboardFilteredSalesChartData.map(([, value]) => value.sales)
  );

  const dashboardFilteredDeliveredSalesValue = dashboardFilteredDeliveredSales;
  const dashboardFilteredPendingSalesValue = dashboardFilteredPendingSales;

  const dashboardFilteredRecentOrders = [...filteredSalesOrders]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 5);

  return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">DK TEXTILE</h1>

          <div className="nav-links">
            <span>Welcome, {currentUser.name}</span>
          </div>

          <div className="auth-buttons">
            <button className="login-btn" onClick={openAdminProductsPage}>
              📦 Admin Products
            </button>

            <button className="login-btn" onClick={openInventoryPage}>
              📊 Inventory
            </button>

            <button className="login-btn" onClick={openOrdersPage}>
              📋 Orders
            </button>

            <button className="login-btn" onClick={closeDashboard}>
              Back to Website
            </button>

            <button className="login-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <section
          className="products-section"
          style={{ background: "#f5f5f5", minHeight: "80vh" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "25px",
            }}
          >
            <div>
              <h2>📊 Advanced Admin Dashboard</h2>
              <p>DK TEXTILE Sales, Orders & Inventory Analytics</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                loadProducts();
                loadOrders();
              }}
            >
              🔄 Refresh Dashboard
            </button>
          </div>

          <div
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "12px",
              marginBottom: "25px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3>📅 Sales Period</h3>
                <p style={{ marginTop: "5px", color: "#666" }}>
                  Filter dashboard sales and orders by time period.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  ["all", "📊 All Time"],
                  ["today", "📅 Today"],
                  ["week", "📆 This Week"],
                  ["month", "🗓️ This Month"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={salesFilter === value ? "primary-btn" : "login-btn"}
                    onClick={() => setSalesFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {salesFilter !== "all" && filteredSalesOrders.length === 0 && (
              <p style={{ marginTop: "12px", color: "#777" }}>
                No orders with a recorded date were found for this period.
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "18px",
              marginBottom: "25px",
            }}
          >
            {[
              ["💰", "Total Sales", `₹${dashboardFilteredTotalSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`],
              ["📦", "Total Orders", orders.length],
              ["👕", "Total Products", products.length],
              ["🏭", "Total Stock", totalInventoryQuantity],
              ["🛒", "Units Ordered", dashboardFilteredTotalQuantity],
            ].map(([icon, title, value]) => (
              <div
                key={title}
                style={{
                  background: "white",
                  padding: "22px",
                  borderRadius: "12px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ fontSize: "28px" }}>{icon}</div>
                <p style={{ marginTop: "8px", color: "#666" }}>{title}</p>
                <h2 style={{ marginTop: "8px" }}>{value}</h2>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginBottom: "25px",
            }}
          >
            <div style={{ background: "white", padding: "22px", borderRadius: "12px" }}>
              <h3>📈 Average Order Value</h3>
              <h2 style={{ marginTop: "10px" }}>
                ₹{dashboardFilteredAverageOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div style={{ background: "white", padding: "22px", borderRadius: "12px" }}>
              <h3>✅ Delivered Sales</h3>
              <h2 style={{ marginTop: "10px" }}>
                ₹{dashboardFilteredDeliveredSalesValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div style={{ background: "white", padding: "22px", borderRadius: "12px" }}>
              <h3>⏳ Pending Sales</h3>
              <h2 style={{ marginTop: "10px" }}>
                ₹{dashboardFilteredPendingSalesValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div style={{ background: "white", padding: "22px", borderRadius: "12px" }}>
              <h3>⚠️ Low Stock</h3>
              <h2 style={{ marginTop: "10px" }}>{adminLowStockCount}</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>📊 Order Status Analytics</h2>

              {dashboardStatuses.map((status) => {
                const count = dashboardStatusCounts[status] || 0;
                const width = orders.length
                  ? Math.max(3, (count / orders.length) * 100)
                  : 3;

                return (
                  <div key={status} style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <strong>{status}</strong>
                      <span>{count}</span>
                    </div>

                    <div
                      style={{
                        height: "12px",
                        background: "#e9e9e9",
                        borderRadius: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${width}%`,
                          height: "100%",
                          background: "#222",
                          borderRadius: "20px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>🏆 Top-Selling Products</h2>

              {dashboardTopProducts.length === 0 ? (
                <p style={{ marginTop: "20px", color: "#777" }}>
                  No sales data available yet.
                </p>
              ) : (
                dashboardTopProducts.map(([name, value], index) => (
                  <div key={name} style={{ marginTop: "18px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <strong>
                        {index + 1}. {name}
                      </strong>
                      <span>{value.quantity} units</span>
                    </div>

                    <div
                      style={{
                        height: "12px",
                        background: "#e9e9e9",
                        borderRadius: "20px",
                        marginTop: "7px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(
                            5,
                            (value.quantity / dashboardMaxProductQuantity) * 100
                          )}%`,
                          height: "100%",
                          background: "#555",
                          borderRadius: "20px",
                        }}
                      />
                    </div>

                    <small>
                      Sales: ₹
                      {value.sales.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* STEP 6.2 - SALES ANALYTICS CHART */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "25px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2>📈 Sales Analytics</h2>
                <p>Top products by recorded sales value.</p>
              </div>
              <strong>
                Total Sales: ₹
                {dashboardFilteredTotalSales.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>

            {dashboardFilteredSalesChartData.length === 0 ? (
              <div
                style={{
                  marginTop: "25px",
                  padding: "25px",
                  background: "#f7f7f7",
                  borderRadius: "10px",
                  textAlign: "center",
                  color: "#777",
                }}
              >
                No sales data available yet. Place an order to see the chart.
              </div>
            ) : (
              <div style={{ marginTop: "25px" }}>
                {dashboardFilteredSalesChartData.map(([name, value], index) => {
                  const barWidth = Math.max(
                    4,
                    (value.sales / dashboardFilteredMaxSales) * 100
                  );

                  return (
                    <div key={name} style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "7px",
                        }}
                      >
                        <strong>
                          {index + 1}. {name}
                        </strong>
                        <span>
                          ₹
                          {value.sales.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "24px",
                          background: "#e9e9e9",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: "100%",
                            background: "#222",
                            borderRadius: "8px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>

                      <small style={{ display: "block", marginTop: "5px", color: "#666" }}>
                        {value.quantity} unit{value.quantity === 1 ? "" : "s"} ordered
                      </small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "25px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              overflowX: "auto",
            }}
          >
            <h2>🧾 Recent Orders</h2>

            {dashboardFilteredRecentOrders.length === 0 ? (
              <p style={{ marginTop: "20px", color: "#777" }}>
                No orders available.
              </p>
            ) : (
              <table className="orders-table" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardFilteredRecentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.product_name}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.quantity}</td>
                      <td>
                        ₹
                        {Number(order.total_price || 0).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{order.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "25px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2>💡 Business Summary</h2>
            <p style={{ marginTop: "12px" }}>
              DK TEXTILE currently has <strong>{products.length}</strong> products,
              <strong> {totalInventoryQuantity}</strong> units in stock and
              <strong> {orders.length}</strong> customer orders.
            </p>
            <p style={{ marginTop: "8px" }}>
              Total recorded order sales are
              <strong> ₹{dashboardFilteredTotalSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // =========================
  // INVENTORY MANAGEMENT PAGE
  // =========================
  if (showInventoryPage) {
    if (!currentUser || currentUser.role !== "admin") {
      return (
        <div className="app">
          <nav className="navbar">
            <h1 className="logo">DK TEXTILE</h1>
            <button className="login-btn" onClick={openAdminLogin}>Admin Login</button>
          </nav>
          <section className="auth-page">
            <div className="auth-container">
              <h2>Admin Access Required</h2>
              <p>Please login with an admin account to manage inventory.</p>
              <button className="primary-btn" onClick={openAdminLogin}>Admin Login</button>
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
            <span>Welcome, {currentUser.name}</span>
          </div>
          <div className="auth-buttons">
            <button className="login-btn" onClick={openAdminProductsPage}>📦 Admin Products</button>
            <button className="login-btn" onClick={openInventoryPage}>📊 Inventory</button>
            <button className="login-btn" onClick={openOrdersPage}>📋 Admin Orders</button>
            <button className="login-btn" onClick={openDashboard}>📊 Dashboard</button>
            <button
              className="login-btn"
              onClick={() => {
                setShowInventoryPage(false);
              }}
            >
              Back to Website
            </button>
            <button className="login-btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <section className="products-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2>📊 Inventory Management</h2>
              <p>Monitor stock, add stock, remove stock and track inventory value.</p>
            </div>
            <button className="primary-btn" onClick={loadProducts} disabled={productsLoading}>
              🔄 {productsLoading ? "Refreshing..." : "Refresh Inventory"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "15px", marginBottom: "25px" }}>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Total Products</h3>
              <p style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px" }}>{products.length}</p>
            </div>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Total Stock Units</h3>
              <p style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px" }}>{totalInventoryQuantity}</p>
            </div>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>In Stock</h3>
              <p style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px" }}>{adminInStockCount}</p>
            </div>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Low Stock</h3>
              <p style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px" }}>{adminLowStockCount}</p>
            </div>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Out of Stock</h3>
              <p style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px" }}>{adminOutOfStockCount}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px", marginBottom: "25px" }}>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Wholesale Inventory Value</h3>
              <p style={{ fontSize: "24px", fontWeight: "700", marginTop: "8px" }}>₹{totalInventoryWholesaleValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              <small>Stock × wholesale price</small>
            </div>
            <div className="auth-container" style={{ margin: 0, padding: "20px" }}>
              <h3>Retail Inventory Value</h3>
              <p style={{ fontSize: "24px", fontWeight: "700", marginTop: "8px" }}>₹{totalInventoryRetailValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              <small>Stock × retail price</small>
            </div>
          </div>

          {(adminLowStockCount > 0 || adminOutOfStockCount > 0) && (
            <div style={{ background: "#fff3cd", border: "1px solid #ffe69c", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
              ⚠️ <strong>Inventory Alert:</strong> {adminLowStockCount} low-stock product(s) and {adminOutOfStockCount} out-of-stock product(s) need attention.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "minmax(250px, 1fr) 200px", gap: "12px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔎 Search by code, name, fabric or color"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <select
              value={inventoryStockFilter}
              onChange={(e) => setInventoryStockFilter(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
            >
              <option value="All">All Stock</option>
              <option value="In">In Stock</option>
              <option value="Low">Low Stock</option>
              <option value="Out">Out of Stock</option>
            </select>
          </div>

          <p style={{ marginBottom: "15px" }}>Showing <strong>{filteredInventoryProducts.length}</strong> of <strong>{products.length}</strong> products</p>

          {productsLoading ? (
            <p className="loading-text">Loading inventory...</p>
          ) : products.length === 0 ? (
            <div className="auth-container">
              <h2>No Products Found</h2>
              <p>Add products first to manage inventory.</p>
              <button className="primary-btn" onClick={openAdminProductsPage}>Go to Admin Products</button>
            </div>
          ) : filteredInventoryProducts.length === 0 ? (
            <div className="auth-container">
              <h2>🔎 No Matching Products</h2>
              <p>Try a different search term or stock filter.</p>
              <button className="primary-btn" onClick={() => { setInventorySearch(""); setInventoryStockFilter("All"); }}>Clear Filters</button>
            </div>
          ) : (
            <div className="product-container">
              {filteredInventoryProducts.map((product) => {
                const stockInfo = getStockInfo(product.stock);
                const isUpdating = inventoryUpdatingId === product.id;
                const adjustment = inventoryAdjustments[product.id] ?? "";

                return (
                  <div className="product-card" key={product.id}>
                    {product.image_path ? (
                      <img src={getFileUrl(product.image_path)} alt={product.name} className="product-image" />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}

                    <h3>{product.name}</h3>
                    <p><strong>Product Code:</strong> {product.product_code}</p>
                    <p><strong>Fabric:</strong> {product.fabric || "-"}</p>
                    <p><strong>Color:</strong> {product.color || "-"}</p>
                    <p><strong>Current Stock:</strong> <span style={{ fontSize: "20px", fontWeight: "700" }}>{product.stock}</span></p>
                    <p><strong>Status:</strong> <span className={stockInfo.className} style={{ fontWeight: "700" }}>{stockInfo.label}</span></p>
                    <p><strong>Wholesale Price:</strong> ₹{product.wholesale_price ?? product.price ?? 0}</p>
                    <p><strong>Retail Price:</strong> ₹{product.price ?? 0}</p>

                    <div style={{ marginTop: "15px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                      <strong>Adjust Stock</strong>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Quantity"
                        value={adjustment}
                        onChange={(e) => handleInventoryAdjustmentChange(product.id, e.target.value)}
                        disabled={isUpdating}
                        style={{ width: "100%", marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
                      />
                      <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={() => handleAdjustStock(product, "add")}
                          disabled={isUpdating}
                          style={{ flex: "1 1 120px" }}
                        >
                          {isUpdating ? "Updating..." : "➕ Add Stock"}
                        </button>
                        <button
                          type="button"
                          className="login-btn"
                          onClick={() => handleAdjustStock(product, "remove")}
                          disabled={isUpdating}
                          style={{ flex: "1 1 120px", background: "#c62828", color: "white" }}
                        >
                          {isUpdating ? "Updating..." : "➖ Remove Stock"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="login-btn"
                      onClick={() => setSelectedProduct(product)}
                      style={{ marginTop: "12px", width: "100%" }}
                    >
                      👁️ View Product
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: "35px", paddingTop: "25px", borderTop: "2px solid #e5e5e5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "15px" }}>
              <div>
                <h2>📜 Stock History</h2>
                <p>Track stock additions, removals and customer orders.</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <select
                  value={inventoryHistoryFilter}
                  onChange={(e) => setInventoryHistoryFilter(e.target.value)}
                  style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
                >
                  <option value="All">All Activities</option>
                  <option value="Stock Added">Stock Added</option>
                  <option value="Stock Removed">Stock Removed</option>
                  <option value="Customer Order">Customer Order</option>
                </select>
                <button
                  type="button"
                  className="login-btn"
                  onClick={clearInventoryHistory}
                  disabled={inventoryHistory.length === 0}
                  style={{ background: "#c62828", color: "white" }}
                >
                  🗑️ Clear History
                </button>
              </div>
            </div>

            {inventoryHistory.length === 0 ? (
              <div className="auth-container" style={{ margin: 0 }}>
                <h3>No Stock History Yet</h3>
                <p>Inventory changes and successful customer orders will appear here.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Date & Time</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Product</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Activity</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Quantity</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Stock Change</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Order ID</th>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>By / Customer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventoryHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          {new Date(entry.created_at).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          <strong>{entry.product_name}</strong><br />
                          <small>{entry.product_code}</small>
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          <span style={{ fontWeight: "700" }}>{entry.type}</span>
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          {entry.quantity}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          {entry.previous_stock} → <strong>{entry.new_stock}</strong>
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          {entry.order_id ? `#${entry.order_id}` : "-"}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                          {entry.customer_name || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // =========================
  // ADMIN PRODUCT MANAGEMENT PAGE
  // =========================
  if (showAdminProductsPage) {
    if (!currentUser || currentUser.role !== "admin") {
      return (
        <div className="app">
          <nav className="navbar">
            <h1 className="logo">DK TEXTILE</h1>
            <button className="login-btn" onClick={openAdminLogin}>Admin Login</button>
          </nav>
          <section className="auth-page">
            <div className="auth-container">
              <h2>Admin Access Required</h2>
              <p>Please login with an admin account to manage products.</p>
              <button className="primary-btn" onClick={openAdminLogin}>Admin Login</button>
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
            <span>Welcome, {currentUser.name}</span>
          </div>
          <div className="auth-buttons">
            <button className="login-btn" onClick={openAdminProductsPage}>📦 Admin Products</button>
            <button className="login-btn" onClick={openInventoryPage}>📊 Inventory</button>
            <button className="login-btn" onClick={openOrdersPage}>📋 Admin Orders</button>
            <button className="login-btn" onClick={openDashboard}>📊 Dashboard</button>
            <button className="login-btn" onClick={() => { setShowAdminProductsPage(false); }}>Back to Website</button>
            <button className="login-btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <section className="products-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2>👨‍💼 Product Management</h2>
              <p>Add, view, edit and delete DK TEXTILE products.</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className="primary-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddProductForm(true);
                }}
              >
                ➕ Add Product
              </button>
              <button className="primary-btn" onClick={loadProducts}>🔄 Refresh Products</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "16px", borderRadius: "10px", background: "#eef6ff", border: "1px solid #d6e9ff" }}>
              <strong>Total Products</strong><div style={{ fontSize: "26px", fontWeight: "700", marginTop: "5px" }}>{products.length}</div>
            </div>
            <div style={{ padding: "16px", borderRadius: "10px", background: "#effaf1", border: "1px solid #d8eedb" }}>
              <strong>In Stock</strong><div style={{ fontSize: "26px", fontWeight: "700", marginTop: "5px" }}>{adminInStockCount}</div>
            </div>
            <div style={{ padding: "16px", borderRadius: "10px", background: "#fff8e6", border: "1px solid #f3e2ad" }}>
              <strong>Low Stock</strong><div style={{ fontSize: "26px", fontWeight: "700", marginTop: "5px" }}>{adminLowStockCount}</div>
            </div>
            <div style={{ padding: "16px", borderRadius: "10px", background: "#fff0f0", border: "1px solid #f1d2d2" }}>
              <strong>Out of Stock</strong><div style={{ fontSize: "26px", fontWeight: "700", marginTop: "5px" }}>{adminOutOfStockCount}</div>
            </div>
            <div style={{ padding: "16px", borderRadius: "10px", background: "#f5f0ff", border: "1px solid #e2d7f5" }}>
              <strong>Active</strong><div style={{ fontSize: "26px", fontWeight: "700", marginTop: "5px" }}>{adminActiveCount}</div>
            </div>
          </div>

          {adminLowStockCount > 0 && (
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "20px", background: "#fff8e6", border: "1px solid #f0d27a" }}>
              ⚠️ <strong>Low-stock warning:</strong> {adminLowStockCount} product{adminLowStockCount === 1 ? " is" : "s are"} at or below 20 units. Consider restocking.
            </div>
          )}

          <div style={{ background: "#f7f9fc", padding: "18px", borderRadius: "10px", marginBottom: "25px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ marginBottom: "12px" }}>🔍 Search & Filter Products</h3>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 2fr) repeat(3, minmax(150px, 1fr))", gap: "12px" }}>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by code, name, fabric or color..."
              />
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                <option value="All">All Stock</option>
                <option value="In">In Stock</option>
                <option value="Low">Low Stock</option>
                <option value="Out">Out of Stock</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {adminCategoryIds.map((categoryId) => (
                  <option key={categoryId} value={categoryId}>Category {categoryId}</option>
                ))}
              </select>
            </div>
            <p style={{ marginTop: "10px", marginBottom: 0 }}>Showing <strong>{filteredAdminProducts.length}</strong> of <strong>{products.length}</strong> products</p>
          </div>

          {showAddProductForm && (
            <div className="auth-container" style={{ maxWidth: "750px", margin: "0 auto 30px" }}>
              <h2>➕ Add New Product</h2>
              <p>Enter the details of the new DK TEXTILE product.</p>

              <label>Product Code</label>
              <input type="text" name="product_code" placeholder="e.g. DK002" value={addProductForm.product_code} onChange={handleAddProductChange} />

              <label>Product Name</label>
              <input type="text" name="name" placeholder="Enter product name" value={addProductForm.name} onChange={handleAddProductChange} />

              <label>Category ID</label>
              <input type="number" name="category_id" min="1" placeholder="Enter category ID" value={addProductForm.category_id} onChange={handleAddProductChange} />

              <label>Fabric</label>
              <input type="text" name="fabric" placeholder="e.g. Cotton" value={addProductForm.fabric} onChange={handleAddProductChange} />

              <label>Color</label>
              <input type="text" name="color" placeholder="e.g. Blue" value={addProductForm.color} onChange={handleAddProductChange} />

              <label>Price</label>
              <input type="number" name="price" min="0" step="0.01" placeholder="Enter retail price" value={addProductForm.price} onChange={handleAddProductChange} />

              <label>Wholesale Price</label>
              <input type="number" name="wholesale_price" min="0" step="0.01" placeholder="Enter wholesale price" value={addProductForm.wholesale_price} onChange={handleAddProductChange} />

              <label>Stock</label>
              <input type="number" name="stock" min="0" placeholder="Enter stock quantity" value={addProductForm.stock} onChange={handleAddProductChange} />

              <label>Minimum Order Quantity</label>
              <input type="number" name="minimum_order_quantity" min="1" value={addProductForm.minimum_order_quantity} onChange={handleAddProductChange} />

              <label>Description</label>
              <textarea name="description" rows="4" placeholder="Enter product description" value={addProductForm.description} onChange={handleAddProductChange} />

              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAddProductImage(e.target.files?.[0] || null)}
              />
              {addProductImage && (
                <p style={{ marginTop: "6px" }}>📷 Selected: {addProductImage.name}</p>
              )}

              <label>Product Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setAddProductVideo(e.target.files?.[0] || null)}
              />
              {addProductVideo && (
                <p style={{ marginTop: "6px" }}>🎥 Selected: {addProductVideo.name}</p>
              )}

              <label>Status</label>
              <select name="status" value={addProductForm.status} onChange={handleAddProductChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
                <button type="button" className="primary-btn" onClick={handleAddProduct} disabled={isAddingProduct}>
                  {isAddingProduct ? "Adding Product..." : "💾 Add Product"}
                </button>
                <button type="button" className="login-btn" onClick={() => { resetAddProductForm(); setShowAddProductForm(false); }} disabled={isAddingProduct}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {editingProduct && (
            <div className="auth-container" style={{ maxWidth: "750px", margin: "0 auto 30px" }}>
              <h2>✏️ Edit Product</h2>
              <p>Editing: <strong>{editingProduct.name}</strong></p>

              <label>Product Code</label>
              <input type="text" name="product_code" value={editProductForm.product_code} onChange={handleEditProductChange} />

              <label>Product Name</label>
              <input type="text" name="name" value={editProductForm.name} onChange={handleEditProductChange} />

              <label>Category ID</label>
              <input type="number" name="category_id" min="1" value={editProductForm.category_id} onChange={handleEditProductChange} />

              <label>Fabric</label>
              <input type="text" name="fabric" value={editProductForm.fabric} onChange={handleEditProductChange} />

              <label>Color</label>
              <input type="text" name="color" value={editProductForm.color} onChange={handleEditProductChange} />

              <label>Price</label>
              <input type="number" name="price" min="0" value={editProductForm.price} onChange={handleEditProductChange} />

              <label>Wholesale Price</label>
              <input type="number" name="wholesale_price" min="0" value={editProductForm.wholesale_price} onChange={handleEditProductChange} />

              <label>Stock</label>
              <input type="number" name="stock" min="0" value={editProductForm.stock} onChange={handleEditProductChange} />

              <label>Minimum Order Quantity</label>
              <input type="number" name="minimum_order_quantity" min="1" value={editProductForm.minimum_order_quantity} onChange={handleEditProductChange} />

              <label>Description</label>
              <textarea name="description" rows="4" value={editProductForm.description} onChange={handleEditProductChange} />

              <label>Change Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditProductImage(e.target.files?.[0] || null)}
              />
              {editProductImage && (
                <p style={{ marginTop: "6px" }}>📷 New image: {editProductImage.name}</p>
              )}

              <label>Change Product Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setEditProductVideo(e.target.files?.[0] || null)}
              />
              {editProductVideo && (
                <p style={{ marginTop: "6px" }}>🎥 New video: {editProductVideo.name}</p>
              )}

              <label>Status</label>
              <select name="status" value={editProductForm.status} onChange={handleEditProductChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
                <button type="button" className="primary-btn" onClick={handleUpdateProduct} disabled={isUpdatingProduct}>
                  {isUpdatingProduct ? "Updating..." : "💾 Save Changes"}
                </button>
                <button type="button" className="login-btn" onClick={() => setEditingProduct(null)} disabled={isUpdatingProduct}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {productsLoading ? (
            <p className="loading-text">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="auth-container">
              <h2>No Products Found</h2>
              <p>There are currently no products in the database.</p>
              <button className="primary-btn" onClick={loadProducts}>Refresh</button>
            </div>
          ) : filteredAdminProducts.length === 0 ? (
            <div className="auth-container">
              <h2>🔎 No Matching Products</h2>
              <p>Try a different search term or change the filters.</p>
              <button
                className="primary-btn"
                onClick={() => {
                  setProductSearch("");
                  setStockFilter("All");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="product-container">
              {filteredAdminProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  {product.image_path ? (
                    <img src={getFileUrl(product.image_path)} alt={product.name} className="product-image" />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                  <h3>{product.name}</h3>
                  <p><strong>Product ID:</strong> {product.id}</p>
                  <p><strong>Product Code:</strong> {product.product_code}</p>
                  <p><strong>Fabric:</strong> {product.fabric || "-"}</p>
                  <p><strong>Color:</strong> {product.color || "-"}</p>
                  <p><strong>Price:</strong> ₹{product.price}</p>
                  <p><strong>Wholesale:</strong> ₹{product.wholesale_price}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <p>
                    <strong>Stock Status:</strong>{" "}
                    <span className={getStockInfo(product.stock).className} style={{ fontWeight: "700" }}>
                      {getStockInfo(product.stock).label}
                    </span>
                  </p>
                  <p><strong>Minimum Order:</strong> {product.minimum_order_quantity}</p>
                  <p><strong>Status:</strong> {product.status || "Active"}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
                    <button type="button" className="primary-btn" onClick={() => setSelectedProduct(product)}>👁️ View</button>
                    <button type="button" className="login-btn" onClick={() => openEditProduct(product)} style={{ background: "#1565c0", color: "white" }}>✏️ Edit</button>
                    <button type="button" className="login-btn" onClick={() => handleDeleteProduct(product.id)} style={{ background: "#c62828", color: "white" }}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              onClick={openAdminProductsPage}
            >
              📦 Admin Products
            </button>

            <button
              className="login-btn"
              onClick={openInventoryPage}
            >
              📊 Inventory
            </button>

            <button
              className="login-btn"
              onClick={openDashboard}
            >
              📊 Dashboard
            </button>

            <button
              className="login-btn"
              onClick={closeOrdersPage}
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
                  <>
                    <button
                      className="login-btn"
                      onClick={openAdminProductsPage}
                    >
                      Admin Products
                    </button>
                    <button
                      className="login-btn"
                      onClick={openOrdersPage}
                    >
                      Admin Orders
                    </button>
                  </>
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
                  <>
                    <button
                      className="login-btn"
                      onClick={openAdminProductsPage}
                    >
                      Admin Products
                    </button>
                    <button
                      className="login-btn"
                      onClick={openOrdersPage}
                    >
                      Admin Orders
                    </button>
                  </>
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
                <>
                  <button
                    className="login-btn"
                    onClick={
                      openOrdersPage
                    }
                  >
                    Admin Orders
                  </button>

                  <button
                    className="login-btn"
                    onClick={
                      openDashboard
                    }
                  >
                    📊 Dashboard
                  </button>
                </>
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
        className="products-section catalogue-section"
        id="products"
      >
        <div className="catalogue-heading">
          <div>
            <span className="section-eyebrow">DK TEXTILE COLLECTION</span>
            <h2>Our Products</h2>
            <p>Explore our textile collection and find the right fabric for your business.</p>
          </div>
          <div className="catalogue-count">
            <strong>{filteredCatalogueProducts.length}</strong>
            <span>Products</span>
          </div>
        </div>

        <div className="catalogue-toolbar">
          <div className="catalogue-search-wrap">
            <span className="catalogue-search-icon">⌕</span>
            <input
              type="text"
              className="catalogue-search"
              placeholder="Search product, code, fabric or color..."
              value={catalogueSearch}
              onChange={(e) => setCatalogueSearch(e.target.value)}
            />
            {catalogueSearch && (
              <button
                type="button"
                className="catalogue-clear-search"
                onClick={() => setCatalogueSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select
            className="catalogue-filter"
            value={catalogueFabricFilter}
            onChange={(e) => setCatalogueFabricFilter(e.target.value)}
          >
            <option value="All">All Fabrics</option>
            {catalogueFabrics.map((fabric) => (
              <option key={fabric} value={fabric}>{fabric}</option>
            ))}
          </select>

          <select
            className="catalogue-filter"
            value={catalogueColorFilter}
            onChange={(e) => setCatalogueColorFilter(e.target.value)}
          >
            <option value="All">All Colors</option>
            {catalogueColors.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <select
            className="catalogue-filter"
            value={catalogueStockFilter}
            onChange={(e) => setCatalogueStockFilter(e.target.value)}
          >
            <option value="All">All Availability</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            className="catalogue-filter"
            value={catalogueSort}
            onChange={(e) => setCatalogueSort(e.target.value)}
          >
            <option value="featured">Sort: Featured</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-high">Stock: High to Low</option>
          </select>

          <button
            type="button"
            className="catalogue-reset-btn"
            onClick={clearCatalogueFilters}
          >
            Reset
          </button>
        </div>

        <div className="catalogue-results-row">
          <span>Showing <strong>{filteredCatalogueProducts.length}</strong> of <strong>{products.length}</strong> products</span>
          {(catalogueSearch || catalogueFabricFilter !== "All" || catalogueColorFilter !== "All" || catalogueStockFilter !== "All") && (
            <span className="catalogue-filter-active">Filters applied</span>
          )}
        </div>

        {productsLoading && products.length === 0 ? (
          <div className="catalogue-loading">
            <div className="catalogue-spinner" />
            <p>Loading DK TEXTILE products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="catalogue-empty">
            <div className="catalogue-empty-icon">▦</div>
            <h3>No products available</h3>
            <p>Products will appear here once they are added to the catalogue.</p>
          </div>
        ) : filteredCatalogueProducts.length === 0 ? (
          <div className="catalogue-empty">
            <div className="catalogue-empty-icon">⌕</div>
            <h3>No matching products</h3>
            <p>Try a different search term or change your filters.</p>
            <button type="button" className="primary-btn" onClick={clearCatalogueFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="catalogue-grid">
            {filteredCatalogueProducts.map((product) => {
              const stock = Number(product.stock || 0);
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 20;

              return (
                <article className="catalogue-card" key={product.id}>
                  <div className="catalogue-image-wrap">
                    {product.image_path ? (
                      <img
                        src={getFileUrl(product.image_path)}
                        alt={product.name}
                        className="catalogue-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="catalogue-image-placeholder"
                      style={{ display: product.image_path ? "none" : "flex" }}
                    >
                      <span>DK</span>
                      <small>IMAGE COMING SOON</small>
                    </div>

                    <span className="catalogue-code-badge">{product.product_code || `DK${String(product.id).padStart(3, "0")}`}</span>
                    <span className={`catalogue-stock-badge ${isOutOfStock ? "out" : isLowStock ? "low" : "in"}`}>
                      {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </div>

                  <div className="catalogue-card-body">
                    <div className="catalogue-product-meta">
                      <span>{product.fabric || "Textile"}</span>
                      <span>•</span>
                      <span>{product.color || "Standard"}</span>
                    </div>

                    <h3>{product.name}</h3>

                    <p className="catalogue-description">
                      {product.description || "Quality textile product from DK TEXTILE."}
                    </p>

                    <div className="catalogue-price-row">
                      <div>
                        <span className="catalogue-price-label">Retail Price</span>
                        <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="catalogue-moq">
                        <span>MOQ</span>
                        <strong>{product.minimum_order_quantity || 1}</strong>
                      </div>
                    </div>

                    <div className="catalogue-stock-line">
                      <span>Available stock</span>
                      <strong>{stock} units</strong>
                    </div>

                    <div className="catalogue-card-actions">
                      <button
                        type="button"
                        className="catalogue-view-btn"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details <span>→</span>
                      </button>
                      <button
                        type="button"
                        className="catalogue-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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