
import express from "express"

import {
    submitUpiPayment,
    verifyUpiPayment,
    getPaymentStatus,
    getTotalPayments
} from "../controllers/payment.controller.js"

import verifyToken from "../middlewares/verifyToken.js"
import adminMiddleware from "../middlewares/adminMiddleware.js"

const router = express.Router()

// User submits UPI transaction reference
router.post("/submit-upi", verifyToken, submitUpiPayment)

// User checks payment status
router.get("/status", verifyToken, getPaymentStatus)

// Admin-only routes
router.get("/total", verifyToken, adminMiddleware, getTotalPayments)
router.post("/verify-upi", verifyToken, adminMiddleware, verifyUpiPayment)

export default router
