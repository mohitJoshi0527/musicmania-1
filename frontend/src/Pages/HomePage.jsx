import { loadRazorpay } from "../utils/loadRazorpay";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useSongStore } from "../stores/useSongStore";
import { useState, useEffect } from "react";
import useUserStore from "../stores/useUserStore";

const HomePage = () => {
  const { user, fetchUserData } = useUserStore();
  const { songs, fetchSongs, loading, error } = useSongStore();
  const [currentPlaying, setCurrentPlaying] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const handlePlay = (songId) => {
    setCurrentPlaying(currentPlaying === songId ? null : songId);
  };

  const handlePayment = async (songId) => {
    try {
      if (!user) {
        toast.error("Please log in to download");
        return;
      }
      await loadRazorpay();

      // Check if already purchased
      if (user?.purchasedFiles?.includes(songId)) {
        const song = songs.find((s) => s._id === songId);
        window.open(song.file_url, "_blank");
        return;
      }

      // Create an order on the backend
      const response = await fetch("https://musicmania-t7rb.onrender.com/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) throw new Error("Failed to create Razorpay order");

      const options = {
        key: 'rzp_test_Gb7fZ9Bayj2cVg',
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your Music App",
        description: `Purchase ${songs.find(s => s._id === songId)?.title || "Song"}`,
        order_id: data.order.id,
        handler: async (paymentResponse) => {
          const verificationResponse = await fetch("https://musicmania-t7rb.onrender.com/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              songId
            }),
            credentials: "include",
          });

          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            window.open(verificationData.file_url, "_blank");
            await fetchUserData();
          } else {
            alert(`Payment verification failed: ${verificationData.error || "Unknown error"}`);
          }
        },
        theme: { color: "#FF3D00" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  if (loading) return <div className="text-center mt-8 text-gray-400">Loading songs...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-black to-red-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">All Songs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <div key={song._id} className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-red-500">
              <img src={song.thumbnail_url} alt={song.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h2 className="text-xl font-semibold">{song.title}</h2>
              <p className="text-gray-300 mt-2">{song.artist}</p>
              <p className="text-red-400 text-sm mt-2">{song.genre}</p>

              <div className="mt-4 flex justify-between items-center">
                <button onClick={() => handlePlay(song._id)} className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md">
                  {currentPlaying === song._id ? "Pause" : "Play"}
                </button>

                <button onClick={() => handlePayment(song._id)} className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-md">
                  {user?.purchasedFiles?.includes(song._id) ? "Download" : `Buy (₹${song.price})`}
                </button>
              </div>

              {currentPlaying === song._id && <audio className="w-full mt-4" controls controlsList="nodownload" autoPlay src={song.file_url} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
