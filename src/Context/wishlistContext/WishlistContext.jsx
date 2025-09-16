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

export const wishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const { userLogin } = useContext(userContext);

  const [wishlistDetails, setWishlistDetails] = useState([]);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishCurrentID, setWishCurrentID] = useState(null);

  // ✅ Memoize headers so they don’t get rebuilt on every render
  const headers = useMemo(() => ({ token: userLogin }), [userLogin]);

  // ✅ Centralized API client
  const api = axios.create({
    baseURL: "https://ecommerce.routemisr.com/api/v1",
    headers,
  });

  // Fetch wishlist items
  const getWishlistItem = useCallback(async () => {
    if (!userLogin) {
      toast.info("You are not logged in.");
      return;
    }
    try {
      const { data } = await api.get("/wishlist");
      if (data?.status === "success") {
        setWishlistDetails(data.data);
      } else {
        toast.error("Error fetching wishlist items.");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Error fetching wishlist. Please login again.");
    }
  }, [api, userLogin]);

  // Add to wishlist
  const addProductToWishlist = useCallback(
    async (productId) => {
      if (!userLogin) {
        toast.error("You need to be logged in to add items.");
        return;
      }
      try {
        const { data } = await api.post("/wishlist", { productId });
        return data;
      } catch (err) {
        console.error("Error adding to wishlist:", err);
        toast.error("Error adding to wishlist.");
        throw err;
      }
    },
    [api, userLogin]
  );

  // Delete from wishlist
  const deleteProductFromWishlist = useCallback(
    async (productId) => {
      try {
        const { data } = await api.delete(`/wishlist/${productId}`);
        return data;
      } catch (err) {
        console.error("Error deleting wishlist item:", err);
        toast.error("Error deleting from wishlist.");
        throw err;
      }
    },
    [api]
  );

  // Toggle wishlist
  const handleWishlistToggle = useCallback(
    async (id) => {
      if (!userLogin) {
        toast.error("Please login to manage wishlist.");
        return;
      }

      setWishLoading(true);
      setWishCurrentID(id);

      try {
        const isInWishlist = wishlistDetails.some((item) => item.id === id);
        const response = isInWishlist
          ? await deleteProductFromWishlist(id)
          : await addProductToWishlist(id);

        if (response?.status === "success") {
          toast.success(
            isInWishlist
              ? "Product removed from wishlist"
              : "Product added to wishlist"
          );
          await getWishlistItem(); // ✅ Refresh once instead of manual states
        } else {
          toast.error("Wishlist action failed.");
        }
      } catch {
        toast.error("Error updating wishlist.");
      } finally {
        setWishLoading(false);
        setWishCurrentID(null);
      }
    },
    [
      wishlistDetails,
      userLogin,
      deleteProductFromWishlist,
      addProductToWishlist,
      getWishlistItem,
    ]
  );

  // Auto-fetch wishlist when logged in
  useEffect(() => {
    if (userLogin) {
      getWishlistItem();
    } else {
      setWishlistDetails([]);
    }
  }, [userLogin, getWishlistItem]);

  // ✅ Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      wishlistDetails,
      wishCount: wishlistDetails.length,
      wishLoading,
      wishCurrentID,
      addProductToWishlist,
      deleteProductFromWishlist,
      getWishlistItem,
      handleWishlistToggle,
    }),
    [
      wishlistDetails,
      wishLoading,
      wishCurrentID,
      addProductToWishlist,
      deleteProductFromWishlist,
      getWishlistItem,
      handleWishlistToggle,
    ]
  );

  return (
    <wishlistContext.Provider value={contextValue}>
      {children}
    </wishlistContext.Provider>
  );
}
