import React, { useState, useRef, useEffect } from 'react';
import './inventory.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { communication, getServerUrl } from '../../services/communication';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState();

  const [formData, setFormData] = useState({
    name: '',
    attachment: null,
    description: '',
    units: '',
    unitPrice: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getProductList();
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const getProductList = async () => {
    try {
      const response = await communication.getProductList("", "");
      console.log(response)
      if (response?.data?.status === "SUCCESS") {
        setProducts(response?.data?.result);
      }
    } catch (error) {
      console.error("Failed to fetch product list:", error);
    }
  };

  const addProduct = async (newProduct) => {
    try {
      if (file) {
        console.log(file)
        const formData = new FormData();
        // Construct your product data without the file
        const productData = {
          name: newProduct.name,
          description: newProduct.description,
          quantity: newProduct.units,
          unitPrice: newProduct.unitPrice,
        };

        formData.append("attachment", file);
        formData.append("data", JSON.stringify(productData));
        const response = await communication.createProduct(formData);
        console.log(response)

        if (response?.data?.status === "SUCCESS") {
          toast.success("Product added to inventory");
          getProductList(); // refresh the list
        } else {
          toast.error("Failed to add product");
        }
      }


      // Append the full JSON as a string under key "data"
      // formDataToSend.append("data", JSON.stringify(productData));
      // if (newProduct.attachment) {
      //   formDataToSend.append("attachment", newProduct.attachment);
      // }


      // for (let [key, value] of formDataToSend.entries()) {
      //   if (key === "attachment") {
      //     attachment = value?.name
      //     // console.log(`${key}:`, value.name); // just print the filename
      //   } else {
      //     dataToSend = value
      //     // console.log(`${key}:`, value);
      //   }
      // }

      // dataToSend.append(productData, attachment)

    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Something went wrong while adding product");
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setFile(file)
    // if (file) {
    //   setFormData((prev) => ({
    //     ...prev,
    //     attachment: file,
    //   }));
    // }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: isEditing ? editId : Date.now(),
      name: formData.name,
      attachment: formData.attachment,
      description: formData.description,
      units: formData.units,
      unitPrice: formData.unitPrice,
    };

    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? newProduct : p))
      );
      toast.success('Product updated successfully');
      setIsEditing(false);
      setEditId(null);
    } else {
      setProducts((prev) => [...prev, newProduct]);
      addProduct(newProduct);  // Send FormData to API
      toast.success('Product added successfully');
    }

    // setFormData({ name: '', attachment: null, description: '', units: '', unitPrice: '' });
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = '';
    // }
  };




  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productInCart = existingCart.find(item => item.id === productId);

    let updatedCart;
    if (productInCart) {
      updatedCart = existingCart.map(item =>
        item.id === productId ? { ...item } : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="inventory-container">
      <form onSubmit={handleSubmit} className="inventory-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="units"
          placeholder="Units"
          value={formData.units}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unitPrice"
          placeholder="Unit Price"
          value={formData.unitPrice}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditId(null);
              setFormData({ name: '', attachment: null, description: '', units: '', unitPrice: '' });
              fileInputRef.current.value = '';
              toast('Edit cancelled');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="units">Units</option>
          <option value="unitPrice">Unit Price</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />

      <h3>Electronics Store</h3>
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-wrapper">
                {product?.image ? (
                  <img src={`${getServerUrl()}/getFiles/${product?.image}`} alt={product.name} className="product-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-details">
                <h4>{product.name}</h4>
                <p>₹ {product.unitPrice}</p>
                <p>{product.units}</p>
                <p>{product.description}</p>
                <button className="add-to-cart" onClick={() => addToCart(product.id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

    </div>
  );
};

export default Inventory;
