
import { create } from "zustand"
import axiosInstance from "../utils/axios.js"

export const usePaymentStore = create((set) => ({
    isLoading: false,
    error: null,
    paymentStatus: null,
    paymentDetails: [],

    submitUpiPayment: async (utr) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post(
                "/api/payment/submit-upi",
                { utr }
            )

            set({ paymentStatus: "pending" })
            return response.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to submit payment"
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    getPaymentStatus: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/api/payment/status")
            set({ paymentStatus: response.data.paymentStatus })
            return response.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to get payment status"
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    getTotalPayments: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/api/payment/total")

            set({ paymentDetails: response.data.paymentDetails })
            return response.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch payments"
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    verifyUpiPayment: async (paymentId, action) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post(
                "/api/payment/verify-upi",
                { paymentId, action }
            )

            return response.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Payment verification failed"
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    clearError: () => set({ error: null }),
    clearPaymentStatus: () => set({ paymentStatus: null })
}))
