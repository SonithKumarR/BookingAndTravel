export const hotels = [
    {
      id: 1,
      name: "Grand Luxury Hotel",
      city: "New York",
      country: "USA",
      price: 299,
      rating: 4.8,
      reviews: 1245,
      image: "/images/hotels/hotel1.jpg",
      description: "Luxury hotel in the heart of Manhattan with breathtaking city views.",
      amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Parking"],
      rooms: [
        { type: "Deluxe Room", price: 299, available: 5 },
        { type: "Executive Suite", price: 499, available: 2 },
        { type: "Presidential Suite", price: 899, available: 1 }
      ]
    },
    {
      id: 2,
      name: "Beach Paradise Resort",
      city: "Miami",
      country: "USA",
      price: 189,
      rating: 4.5,
      reviews: 892,
      image: "/images/hotels/hotel2.jpg",
      description: "Beachfront resort with private beach access and tropical gardens.",
      amenities: ["Beach Access", "Pool", "Spa", "Bar", "WiFi", "Breakfast"],
      rooms: [
        { type: "Standard Room", price: 189, available: 10 },
        { type: "Ocean View", price: 289, available: 4 }
      ]
    },
    {
      id: 3,
      name: "Mountain Retreat Lodge",
      city: "Swiss Alps",
      country: "Switzerland",
      price: 349,
      rating: 4.9,
      reviews: 567,
      image: "/images/hotel3.jpg",
      description: "Cozy lodge with panoramic mountain views and ski-in/ski-out access.",
      amenities: ["Fireplace", "Ski Storage", "Sauna", "Restaurant", "WiFi"],
      rooms: [
        { type: "Mountain View Room", price: 349, available: 3 },
        { type: "Chalet Suite", price: 549, available: 1 }
      ]
    }
  ];
  
  export const cities = [
    { id: 1, name: "New York", country: "USA", image: "/images/ny.jpg" },
    { id: 2, name: "Paris", country: "France", image: "/images/paris.jpg" },
    { id: 3, name: "Tokyo", country: "Japan", image: "/images/tokyo.jpg" },
    { id: 4, name: "Dubai", country: "UAE", image: "/images/dubai.jpg" },
    { id: 5, name: "Sydney", country: "Australia", image: "/images/sydney.jpg" }
  ];