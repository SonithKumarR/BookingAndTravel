// Storage keys
const STORAGE_KEYS = {
    USERS: 'travelEase_users',
    CURRENT_USER: 'travelEase_currentUser',
    BOOKINGS: 'travelEase_bookings',
    WISHLIST: 'travelEase_wishlist',
    TRAVEL_HISTORY: 'travelEase_travelHistory'
  };
  
  // Initialize storage if empty
  const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      // Create some demo users
      const demoUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123', // In real app, this would be hashed
          phone: '+1 234 567 8900',
          address: '123 Main St, New York, NY',
          preferences: {
            newsletter: true,
            smsNotifications: false,
            language: 'English',
            currency: 'USD'
          },
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'password123',
          phone: '+1 987 654 3210',
          address: '456 Park Ave, Los Angeles, CA',
          preferences: {
            newsletter: true,
            smsNotifications: true,
            language: 'English',
            currency: 'USD'
          },
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
    }
  
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
  
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
  
    if (!localStorage.getItem(STORAGE_KEYS.TRAVEL_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.TRAVEL_HISTORY, JSON.stringify([]));
    }
  };
  
  // User Management
  export const userService = {
    // Initialize
    init: () => {
      initializeStorage();
    },
  
    // Get all users
    getUsers: () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    },
  
    // Register new user
    register: (userData) => {
      const users = userService.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
  
      // Create new user
      const newUser = {
        id: users.length + 1,
        ...userData,
        preferences: {
          newsletter: true,
          smsNotifications: false,
          language: 'English',
          currency: 'USD'
        },
        createdAt: new Date().toISOString()
      };
  
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Auto login after registration
      userService.login(userData.email, userData.password);
      
      return newUser;
    },
  
    // Login user
    login: (email, password) => {
      const users = userService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
  
      // Store current user (without password)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    },
  
    // Logout user
    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },
  
    // Get current user
    getCurrentUser: () => {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    },
  
    // Update user profile
    updateProfile: (userId, updates) => {
      const users = userService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
  
      // Update user
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
      // Update current user if it's the same user
      const currentUser = userService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const { password: _, ...userWithoutPassword } = users[userIndex];
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      }
  
      return users[userIndex];
    }
  };
  
  // Booking Management
  export const bookingService = {
    // Get all bookings
    getBookings: () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    },
  
    // Get bookings for specific user
    getUserBookings: (userId) => {
      const bookings = bookingService.getBookings();
      return bookings.filter(booking => booking.userId === userId);
    },
  
    // Create new booking
    createBooking: (bookingData) => {
      const bookings = bookingService.getBookings();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User must be logged in to create booking');
      }
  
      const newBooking = {
        id: bookings.length + 1,
        ...bookingData,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        bookingNumber: `TE-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
  
      bookings.push(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
      // Add to travel history
      travelHistoryService.addHistory({
        type: 'hotel_booking',
        bookingId: newBooking.id,
        hotelId: bookingData.hotelId,
        hotelName: bookingData.hotelName,
        date: new Date().toISOString(),
        details: `Booked ${bookingData.roomType} at ${bookingData.hotelName}`
      });
  
      return newBooking;
    },
  
    // Cancel booking
    cancelBooking: (bookingId) => {
      const bookings = bookingService.getBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
  
      bookings[bookingIndex].status = 'cancelled';
      bookings[bookingIndex].cancelledAt = new Date().toISOString();
      
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
      // Add to travel history
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        travelHistoryService.addHistory({
          type: 'booking_cancelled',
          bookingId: bookingId,
          hotelId: bookings[bookingIndex].hotelId,
          hotelName: bookings[bookingIndex].hotelName,
          date: new Date().toISOString(),
          details: `Cancelled booking at ${bookings[bookingIndex].hotelName}`
        });
      }
  
      return bookings[bookingIndex];
    }
  };
  
  // Wishlist Management
  export const wishlistService = {
    // Get wishlist
    getWishlist: () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    },
  
    // Add to wishlist
    addToWishlist: (hotelId, hotelName) => {
      const wishlist = wishlistService.getWishlist();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User must be logged in to add to wishlist');
      }
  
      // Check if already in wishlist
      const exists = wishlist.some(item => 
        item.hotelId === hotelId && item.userId === currentUser.id
      );
      
      if (exists) {
        throw new Error('Hotel already in wishlist');
      }
  
      const wishlistItem = {
        id: wishlist.length + 1,
        hotelId,
        hotelName,
        userId: currentUser.id,
        addedAt: new Date().toISOString()
      };
  
      wishlist.push(wishlistItem);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  
      return wishlistItem;
    },
  
    // Remove from wishlist
    removeFromWishlist: (hotelId) => {
      const wishlist = wishlistService.getWishlist();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User must be logged in');
      }
  
      const newWishlist = wishlist.filter(item => 
        !(item.hotelId === hotelId && item.userId === currentUser.id)
      );
      
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(newWishlist));
      return newWishlist;
    },
  
    // Check if hotel is in wishlist
    isInWishlist: (hotelId) => {
      const wishlist = wishlistService.getWishlist();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) return false;
      
      return wishlist.some(item => 
        item.hotelId === hotelId && item.userId === currentUser.id
      );
    },
  
    // Get user's wishlist
    getUserWishlist: () => {
      const wishlist = wishlistService.getWishlist();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) return [];
      
      return wishlist.filter(item => item.userId === currentUser.id);
    }
  };
  
  // Travel History
  export const travelHistoryService = {
    // Get travel history
    getHistory: () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAVEL_HISTORY)) || [];
    },
  
    // Get user's travel history
    getUserHistory: () => {
      const history = travelHistoryService.getHistory();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) return [];
      
      return history.filter(item => item.userId === currentUser.id);
    },
  
    // Add to travel history
    addHistory: (historyItem) => {
      const history = travelHistoryService.getHistory();
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser) return;
  
      const newHistoryItem = {
        id: history.length + 1,
        userId: currentUser.id,
        ...historyItem
      };
  
      history.push(newHistoryItem);
      localStorage.setItem(STORAGE_KEYS.TRAVEL_HISTORY, JSON.stringify(history));
      return newHistoryItem;
    }
  };
  
  // Initialize storage on import
  initializeStorage();
  
  export default {
    userService,
    bookingService,
    wishlistService,
    travelHistoryService
  };