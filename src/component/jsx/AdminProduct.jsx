import React, { useState, useEffect } from "react";
import "../css/AdminProduct.css";
import Notification from "../jsx/Notification"; // Import your custom notification component

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSubjectCode, setSearchSubjectCode] = useState("");
  const [filteredProduct, setFilteredProduct] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification
  const [selectedField, setSelectedField] = useState("selling_price");
  const [newValue, setNewValue] = useState("");

  // Fetch product details
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/productData");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      console.log(products)
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearch = () => {
    const product = products.find(
      (product) => product.subject_code === searchSubjectCode.toUpperCase()
    );
    if (product) {
      setFilteredProduct(product);
    } else {
      setFilteredProduct(null);
      setNotification({ message: "Product not found!", type: "error" });
    }
  };

  // Handle Update Field
 const handleUpdateField = async () => {
  if (!filteredProduct) {
    setNotification({ message: "Please search for a valid product first.", type: "error" });
    return;
  }

  if (!newValue) {
    setNotification({ message: "Please provide a new value.", type: "error" });
    return;
  }

  try {
    const response = await fetch(`https://server-admin-bytewise.vercel.app/api/product/${searchSubjectCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field: selectedField, value: newValue }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update product");
    }

    setNotification({ message: "Product updated successfully!", type: "success" });

    // Update the state to reflect the change
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.subject_code === searchSubjectCode
          ? { ...product, [selectedField]: newValue }
          : product
      )
    );
    setFilteredProduct(null);
    setSearchSubjectCode("");
    setNewValue("");
  } catch (error) {
    console.error("Error updating product:", error);
    setNotification({ message: error.message || "Failed to update product.", type: "error" });
  }
};

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <div id="admin-product-container">
      <h2 id="admin-product-heading">Product Management</h2>

      {/* Notification Display */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Search and Update Section */}
      <div className="admin-product-actions">
        <input
          type="text"
          placeholder="Search by Subject Code"
          value={searchSubjectCode}
          onChange={(e) => setSearchSubjectCode(e.target.value)}
          className="search-box"
        />
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="field-dropdown"
        >
          <option value="product_name">Name</option>
          <option value="costPrice">Cost Price</option>
          <option value="sellingPrice">Selling Price</option>
          <option value="pages">Pages</option>
        </select>
        <input
          type="text"
          placeholder="New Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="value-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={handleUpdateField} className="update-btn">
          Update
        </button>
      </div>

      {/* Products Table */}
      <table className="admin-product-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Name</th>
            <th>Pages</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {(filteredProduct ? [filteredProduct] : products).map((product) => (
            <tr key={product.subject_code}>
              <td>{product.subject_code}</td>
              <td>{product.product_name}</td>
              <td>{product.pages}</td>
              <td>{product.costPrice}</td>
              <td>{product.sellingPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
