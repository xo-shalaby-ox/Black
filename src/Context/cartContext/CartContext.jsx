import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import { userContext } from "../userContext/UserContext";

export const CartContext = createContext();

const API_BASE = "https://ecommerce.routemisr.com/api/v1";

export default function CartContextProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [count, setCount] = useState(0);

  const { userLogin } = useContext(userContext);

  // ✅ Memoize headers to avoid re-creation on each render
  const headers = useMemo(() => ({ token: userLogin }), [userLogin]);

  // ---------- API FUNCTIONS ----------

  const addProductToCart = useCallback(
    async (productId) => {
      if (!headers.token) {
        toast.error("You need to be logged in to add items to your cart.");
        return null;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/cart`,
          { productId },
          { headers }
        );
        return response;
      } catch (err) {
        console.error("Error adding product to cart:", err);
        toast.error("Error adding product to cart.");
        throw err;
      }
    },
    [headers]
  );

  const getLoggedCart = useCallback(async () => {
    if (!headers.token) return null;

    try {
      const response = await axios.get(`${API_BASE}/cart`, { headers });
      setCartId(response.data?.data?._id || null);
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error fetching cart. Please login again.");
      return null;
    }
  }, [headers]);

  const updateCartProductQuantity = useCallback(
    async (productId, newCount) => {
      try {
        const res = await axios.put(
          `${API_BASE}/cart/${productId}`,
          { count: newCount },
          { headers }
        );
        return res;
      } catch (err) {
        console.error("Error updating product:", err);
        return null;
      }
    },
    [headers]
  );

  const deleteProductFromCart = useCallback(
    async (productId) => {
      try {
        return await axios.delete(`${API_BASE}/cart/${productId}`, { headers });
      } catch (err) {
        console.error("Error deleting product:", err);
        return null;
      }
    },
    [headers]
  );

  const clearCartProducts = useCallback(async () => {
    try {
      return await axios.delete(`${API_BASE}/cart`, { headers });
    } catch (err) {
      console.error("Error clearing cart:", err);
      return null;
    }
  }, [headers]);

  const checkOut = useCallback(
    async (cartId, url, formData) => {
      try {
        return await axios.post(
          `${API_BASE}/orders/checkout-session/${cartId}?url=${url}`,
          { shippingAddress: formData },
          { headers }
        );
      } catch (err) {
        console.error("Checkout error:", err);
        return null;
      }
    },
    [headers]
  );

  // ---------- STATE UPDATERS ----------

  const updateProductQuantity = useCallback(
    async (id, qty) => {
      if (!id || !qty) return;
      setCurrentId(id);
      setLoading(true);

      const response = await updateCartProductQuantity(id, qty);
      if (response?.data?.status === "success") {
        setCartDetails(response.data.data);
        setCount(response.data.numOfCartItems);
        toast.success("Product updated successfully");
      } else {
        toast.error("Error updating product.");
      }
      setLoading(false);
    },
    [updateCartProductQuantity]
  );

  const addToCart = useCallback(
    async (id) => {
      if (!id) return;
      setLoading(true);
      setCurrentId(id);

      try {
        const response = await addProductToCart(id);
        if (response?.data?.status === "success") {
          toast.success(response.data.message);
          setCount(response.data.numOfCartItems);
        } else {
          toast.error(
            response?.data?.message || "Error adding product to cart."
          );
        }
      } catch {
        toast.error("Error adding product to cart.");
      } finally {
        setLoading(false);
      }
    },
    [addProductToCart]
  );

  const getCartItem = useCallback(async () => {
    const response = await getLoggedCart();
    if (response?.data?.status === "success") {
      setCartDetails(response.data.data);
      setCount(response.data.numOfCartItems);
    } else if (response) {
      toast.error("Error fetching cart items.");
    }
  }, [getLoggedCart]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (userLogin) {
      getCartItem();
    }
  }, [userLogin, getCartItem]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getCartItem,
        updateProductQuantity,
        deleteProductFromCart,
        clearCartProducts,
        checkOut,
        setCartDetails,
        setLoading,
        setCurrentId,
        setCount,
        cartDetails,
        loading,
        currentId,
        count,
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
