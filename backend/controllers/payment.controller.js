
import User from "../models/user.model.js"
import Payment from "../models/payment.model.js"

// 1. User submits UPI transaction reference (UTR)
export const submitUpiPayment = async (req, res) => {
    try {
        const userId = req.user._id
        const { utr } = req.body

        if (!utr || !utr.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your UTR number"
            })
        }

        const cleanUtr = utr.trim()

        if (!/^[a-zA-Z0-9]{8,30}$/.test(cleanUtr)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid UTR/reference number"
            })
        }

        const existingPayment = await Payment.findOne({ utr: cleanUtr })

        if (existingPayment) {
            return res.status(409).json({
                success: false,
                message: "This UTR has already been submitted"
            })
        }

        const existingPending = await Payment.findOne({
            userId,
            status: "pending"
        })

        if (existingPending) {
            return res.status(409).json({
                success: false,
                message: "You already have a payment awaiting verification"
            })
        }

        const payment = await Payment.create({
            userId,
            utr: cleanUtr,
            amount: 129,
            currency: "INR",
            paymentMethod: "upi",
            status: "pending",
            plan: "premium_lifetime"
        })

        return res.status(201).json({
            success: true,
            message: "Payment submitted. Awaiting admin verification.",
            payment
        })
    } catch (error) {
        console.error("UPI payment submission error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to submit payment"
        })
    }
}

// 2. Admin gets all payment requests
export const getTotalPayments = async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments({
            status: "completed"
        })

        const totalAmountResult = await Payment.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ])

        const totalAmount = totalAmountResult[0]?.totalAmount || 0

        const paymentDetails = await Payment.find()
            .populate("userId", "name email")
            .populate("verifiedBy", "name email")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            totalPayments,
            totalAmount,
            currency: "INR",
            paymentDetails
        })
    } catch (error) {
        console.error("Get payments error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to get payments"
        })
    }
}

// 3. Admin approves or rejects a payment
export const verifyUpiPayment = async (req, res) => {
    try {
        const { paymentId, action } = req.body

        if (!paymentId || !["approve", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID or action"
            })
        }

        const payment = await Payment.findById(paymentId)

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            })
        }

        if (payment.status !== "pending") {
            return res.status(409).json({
                success: false,
                message: "This payment has already been processed"
            })
        }

        if (action === "approve") {
            const user = await User.findById(payment.userId)

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Payment user not found"
                })
            }

            user.isPremium = true
            user.premiumPurchaseDate = new Date()
            await user.save()

            payment.status = "completed"
            payment.verifiedAt = new Date()
            payment.verifiedBy = req.user._id
        } else {
            payment.status = "failed"
            payment.verifiedAt = new Date()
            payment.verifiedBy = req.user._id
        }

        await payment.save()

        return res.status(200).json({
            success: true,
            message: action === "approve"
                ? "Payment approved. Premium activated."
                : "Payment rejected.",
            payment
        })
    } catch (error) {
        console.error("UPI verification error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to process payment"
        })
    }
}

// 4. Logged-in user checks premium/payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("isPremium premiumPurchaseDate")

        const latestPayment = await Payment.findOne({
            userId: req.user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            isPremium: user?.isPremium || false,
            premiumPurchaseDate: user?.premiumPurchaseDate || null,
            paymentStatus: latestPayment?.status || null
        })
    } catch (error) {
        console.error("Payment status error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to get payment status"
        })
    }
}
