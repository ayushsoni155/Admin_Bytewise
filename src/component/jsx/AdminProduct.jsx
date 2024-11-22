import React, { useState, useEffect } from "react";
import "../css/AdminProduct.css";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

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
      console.log(data);
      setProducts(Array.isArray(data) ? data : []);  // Ensure it's an array
       console.log(products); // Debug log
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://server-admin-bytewise.vercel.app/api/product/${editProduct.subject_code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setEditProduct(null);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleCancel = () => {
    setEditProduct(null);
  };

  return (
    <div id="admin-product-container">
      <h2 id="admin-product-heading">Product Management</h2>
      <table className="admin-product-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Name</th>
            <th>Pages</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.map((product) => (
            <tr key={product.subject_code}>
              <td>{product.subject_code}</td>
              <td>{product.product_name}</td>
              <td>
                {editProduct && editProduct.subject_code === product.subject_code ? (
                  <input
                    type="number"
                    className="admin-product-input"
                    name="pages"
                    value={editProduct.pages}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.pages
                )}
              </td>
              <td>
                {editProduct && editProduct.subject_code === product.subject_code ? (
                  <input
                    type="number"
                    className="admin-product-input"
                    name="cost_price"
                    value={editProduct.cost_price}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.cost_price
                )}
              </td>
              <td>
                {editProduct && editProduct.subject_code === product.subject_code ? (
                  <input
                    type="number"
                    className="admin-product-input"
                    name="selling_price"
                    value={editProduct.selling_price}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.selling_price
                )}
              </td>
              <td>
                {editProduct && editProduct.subject_code === product.subject_code ? (
                  <>
                    <button
                      className="admin-product-btn save-btn"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                    <button
                      className="admin-product-btn cancel-btn"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="admin-product-btn edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
