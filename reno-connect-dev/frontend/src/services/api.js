import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication
export const login = async (credentials) => {
    const response = await axiosInstance.post('/api/v1/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const registerHomeOwner = async (userData) => {
    return axiosInstance.post("/auth/homeowner/register", userData);
};

export const registerServiceProvider = async (userData) => {
    return axiosInstance.post("/auth/provider/register", userData);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// User Management
export const fetchUsers = async (userType = 'ALL', email = '') => {
    const response = await axiosInstance.get('/api/v1/admin/users/filter', {
        params: { userType, email }
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/api/v1/admin/users/${userId}`);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axiosInstance.put(`/api/v1/admin/users/${userId}`, userData);
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await axiosInstance.put('/users/profile', userData);
    return response.data;
};

// Provider Management
export const getAllProviders = async () => {
    const response = await axiosInstance.get('/service-providers');
    return response.data;
};

export const getProviderById = async (id) => {
    const response = await axiosInstance.get(`/service-providers/${id}`);
    return response.data;
};

export const getProviderServices = async (id) => {
    const response = await axiosInstance.get(`/providers/${id}/services`);
    return response.data;
};

export const getProviderReviews = async (providerId) => {
    const response = await axiosInstance.get(`/service-providers/${providerId}/reviews`);
    return response.data;
};

export const updateServiceProviderProfile = async (providerId, profileData) => {
    const response = await axiosInstance.put(`/api/v1/service-providers/${providerId}`, profileData);
    return response.data;
};

// Booking Management
export const createBooking = async (bookingData) => {
    const response = await axiosInstance.post('/api/v1/bookings', bookingData);
    return response.data;
};

export const getUserBookings = async () => {
    const response = await axiosInstance.get('/api/v1/bookings/user');
    return response.data;
};

export const getProviderBookings = async () => {
    const response = await axiosInstance.get('/api/v1/bookings/provider');
    return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
    const response = await axiosInstance.put(`/api/v1/bookings/${bookingId}`, { status });
    return response.data;
};

export const deleteBooking = async (bookingId) => {
    const response = await axiosInstance.delete(`/api/v1/bookings/${bookingId}`);
    return response.data;
};

// Chat Management
export const getChatForBooking = async (bookingId) => {
    const response = await axiosInstance.get(`/api/v1/chat/booking/${bookingId}`);
    return response.data;
};

export const postMessageToChatLog = async (chatLogId, messageText) => {
    const response = await axiosInstance.post(`/api/v1/chat/log/${chatLogId}/messages`, { messageText });
    return response.data;
};

export const getChats = async () => {
    const response = await axiosInstance.get('/api/v1/chats');
    return response.data;
};

export const getChatMessages = async (chatId) => {
    const response = await axiosInstance.get(`/api/v1/chats/${chatId}/messages`);
    return response.data;
};

export const sendMessage = async (chatId, message) => {
    const response = await axiosInstance.post(`/api/v1/chats/${chatId}/messages`, { message });
    return response.data;
};

// Service Management
export const getAllServices = async () => {
    const response = await axiosInstance.get('/services/all');
    return response.data;
};

export const getServiceById = async (id) => {
    const response = await axiosInstance.get(`/api/v1/services/${id}`);
    return response.data;
};

export const createService = async (serviceData) => {
    const response = await axiosInstance.post('/services', serviceData);
    return response.data;
};

export const updateService = async (serviceId, serviceData) => {
    const response = await axiosInstance.put(`/services/${serviceId}`, serviceData);
    return response.data;
};

export const deleteService = async (serviceId) => {
    const response = await axiosInstance.delete(`/services/${serviceId}`);
    return response.data;
};

// Review Management
export const createReview = async (reviewData) => {
    const response = await axiosInstance.post("/api/v1/reviews", reviewData);
    return response.data;
};

// Subscription Management
export const subscribeProvider = async (subscriptionData) => {
    const response = await axiosInstance.post('/api/v1/subscriptions/subscribe', subscriptionData);
    return response.data;
};

export const unsubscribeProvider = async () => {
    const response = await axiosInstance.post('/api/v1/subscriptions/unsubscribe');
    return response.data;
};

export const getSubscriptionStatus = async () => {
    const response = await axiosInstance.get('/api/v1/subscriptions/status');
    return response.data;
};

// Service Sponsorship
export const sponsorService = async (serviceId) => {
    const response = await axiosInstance.put(`/api/v1/services/${serviceId}/sponsor`);
    return response.data;
};

export const unsponsorService = async (serviceId) => {
    const response = await axiosInstance.delete(`/api/v1/services/${serviceId}/sponsor`);
    return response.data;
};

export default axiosInstance;

export const api = {
    // Authentication
    async login(credentials) {
        const response = await axiosInstance.post('/api/v1/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); 
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    },

    async registerHomeOwner(userData) {
        return axiosInstance.post("/api/v1/auth/homeowner/register", userData);
    },

    async registerServiceProvider(userData) {
        return axiosInstance.post("/api/v1/auth/provider/register", userData);
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async getCurrentProviderProfile() {
        const response = await axiosInstance.get('/api/v1/service-providers/me');
        return response.data;
    },

    // User Management
    async createHomeOwner(homeOwner) {
        const response = await axiosInstance.post('/api/v1/users', homeOwner);
        return response.data;
    },

    async getAllHomeOwners() {
        const response = await axiosInstance.get('/api/v1/users');
        return response.data;
    },

    async getUserProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Extract role from token
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);
            const role = tokenPayload.role;
            console.log('Role from token:', role);

            // Determine endpoint based on role
            let endpoint;
            if (role === 'HOMEOWNER') {
                endpoint = '/api/v1/homeowner/profile';
            } else if (role === 'PROVIDER') {
                endpoint = '/api/v1/service-providers/me';
            } else {
                throw new Error('Invalid user role');
            }

            console.log('Using endpoint:', endpoint);
            const response = await axiosInstance.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            throw error;
        }
    },

    async getUserBookings() {
        const response = await axiosInstance.get('/api/v1/bookings/user');
        return response.data;
    },

    async updateUserProfile(userData) {
        const response = await axiosInstance.put('/api/v1/users/profile', userData);
        return response.data;
    },

    // Provider Management
    async getAllProviders() {
        const response = await axiosInstance.get('/api/v1/service-providers');
        return response.data;
    },

    async getProviderById(id) {
        const response = await axiosInstance.get(`/api/v1/service-providers/${id}`);
        return response.data;
    },

    async getProviderServices(id) {
        const response = await axiosInstance.get(`/providers/${id}/services`);
        return response.data;
    },

    async getProviderReviews(providerId) {
        const response = await axiosInstance.get(`/service-providers/${providerId}/reviews`);
        return response.data;
    },

    // Booking Management
    async createBooking(bookingData) {
        const response = await axiosInstance.post('/api/v1/bookings', bookingData);
        return response.data;
    },

    async getBookings() { // This might be for homeowners
        const response = await axiosInstance.get('/api/v1/bookings/user');
        return response.data;
    },
    
    async getProviderBookings() {
        const response = await axiosInstance.get('/api/v1/bookings/provider');
        return response.data;
    },

    async updateBookingStatus(bookingId, status) {
        const response = await axiosInstance.put(`/api/v1/bookings/${bookingId}`, { status });
        return response.data;
    },

    async deleteBooking(bookingId) {
        const response = await axiosInstance.delete(`/api/v1/bookings/${bookingId}`);
        return response.data;
    },

    // Chat Management
    async getChatForBooking(bookingId) {
        const response = await axiosInstance.get(`/api/v1/chat/booking/${bookingId}`);
        return response.data;
    },

    async postMessageToChatLog(chatLogId, messageText) {
        const response = await axiosInstance.post(`/api/v1/chat/log/${chatLogId}/messages`, { messageText });
        return response.data;
    },

    async getChats() {
        const response = await axiosInstance.get('/api/v1/chats');
        return response.data;
    },

    async getChatMessages(chatId) {
        const response = await axiosInstance.get(`/api/v1/chats/${chatId}/messages`);
        return response.data;
    },

    async sendMessage(chatId, message) {
        const response = await axiosInstance.post(`/api/v1/chats/${chatId}/messages`, { message });
        return response.data;
    },

    // Search and Filtering
    async searchProviders(query) {
        const response = await axiosInstance.get('/service-providers/search', { params: query });
        return response.data;
    },

    async getServiceCategories() {
        const response = await axiosInstance.get('/services/categories');
        return response.data;
    },

    // Reviews and Ratings
    async getReviewsForService(serviceId) {
        const response = await axiosInstance.get(`/api/v1/services/${serviceId}/reviews`);
        return response.data;
    },

    async getProviderReviews(providerId) {
        const response = await axiosInstance.get(`/api/v1/service-providers/${providerId}/reviews`);
        return response.data;
    },

    async createReview(reviewData) {
        const response = await axiosInstance.post("/api/v1/reviews", reviewData);
        return response.data;
    },

    // Subscription Management
    async subscribeProvider(subscriptionData) {
        const response = await axiosInstance.post('/api/v1/subscriptions/subscribe', subscriptionData);
        return response.data;
    },

    async unsubscribeProvider() {
        const response = await axiosInstance.post('/api/v1/subscriptions/unsubscribe');
        return response.data;
    },

    async getSubscriptionStatus() {
        const response = await axiosInstance.get('/api/v1/subscriptions/status');
        return response.data;
    },

    // Service Sponsorship
    async sponsorService(serviceId) {
        const response = await axiosInstance.put(`/api/v1/services/${serviceId}/sponsor`);
        return response.data;
    },

    async unsponsorService(serviceId) {
        const response = await axiosInstance.delete(`/api/v1/services/${serviceId}/sponsor`);
        return response.data;
    },

    // Service Management
    async getServices() {
        const response = await axiosInstance.get('/api/v1/services/all');
        return response.data;
    },

    async getServiceById(id) {
        const response = await axiosInstance.get(`/api/v1/services/${id}`);
        return response.data;
    },
    
    async getProviderServices() {
        const response = await axiosInstance.get('/api/v1/services/provider');
        return response.data;
    },

    async createService(serviceData) {
        const response = await axiosInstance.post('/api/v1/services', serviceData);
        return response.data;
    },

    async deleteService(serviceId) {
        const response = await axiosInstance.delete(`/services/${serviceId}`);
        return response.data;
    },

    async updateService(serviceId, serviceData) {
        try {
            const response = await axiosInstance.put(`/services/${serviceId}`, serviceData);
            return response.data;
        } catch (error) {
            console.error('Error updating service:', error.response?.data || error.message);
            throw error;
        }
    },

    async getAllServices() {
        try {
            const response = await axiosInstance.get('/api/v1/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error.response?.data || error.message);
            throw error;
        }
    },

    // Added for ProviderDashboard to update their own profile--------------------------------------!!
    async updateServiceProviderProfile(providerId, profileData) {
        const response = await axiosInstance.put(`/api/v1/service-providers/${providerId}`, profileData);
        return response.data;
    },

    // Admin specific APIs
    async adminGetAllUsers() {
        const response = await axiosInstance.get("/api/v1/admin/users");
        return response.data;
    },

    async adminDeleteUser(userId) {
        const response = await axiosInstance.delete(`/api/v1/admin/users/${userId}`);
        return response;
    },

    // Admin endpoints
    async getFilteredUsers(userType, email) {
        const params = new URLSearchParams();
        if (userType) params.append('userType', userType);
        if (email) params.append('email', email);
        
        const response = await axiosInstance.get(`/api/v1/admin/users/filter?${params.toString()}`);
        return response.data;
    },

    async deleteUser(userId) {
        const response = await axiosInstance.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Admin Management
    async createAdmin(adminData) {
        try {
            const response = await axiosInstance.post('/api/v1/admin/users', adminData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

// Admin Management
export const createAdmin = async (adminData) => {
    try {
        const response = await axiosInstance.post('/api/v1/admin/users', adminData);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 