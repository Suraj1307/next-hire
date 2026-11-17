
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'

import { usePaymentStore } from '../store/payment.store.js'
import { useAuthStore } from '../store/auth.store.js'
import { useToastStore } from '../store/toast.store.js'

const UPI_ID = '8789162493@ptaxis'

const UPI_LINK =
    `upi://pay?pa=${UPI_ID}&pn=NextHire&am=129&cu=INR&tn=Premium%20Access`

const Premium = () => {
    const [utr, setUtr] = useState('')
    const [qrCode, setQrCode] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const {
        submitUpiPayment,
        getPaymentStatus,
        isLoading,
        error,
        paymentStatus,
        clearError
    } = usePaymentStore()

    const { user } = useAuthStore()
    const { showToast } = useToastStore()
    const navigate = useNavigate()

    // Generate UPI QR code
    useEffect(() => {
        QRCode.toDataURL(UPI_LINK, {
            width: 250,
            margin: 2,
            errorCorrectionLevel: 'H'
        })
            .then(setQrCode)
            .catch(() => showToast('Failed to generate QR code', 'error'))
    }, [showToast])

    // Check existing payment status
    useEffect(() => {
        getPaymentStatus().catch(() => {})
    }, [getPaymentStatus])

    // Redirect premium users
    useEffect(() => {
        if (user?.isPremium) {
            navigate('/profile')
        }
    }, [user, navigate])

    const copyUpiId = async () => {
        try {
            await navigator.clipboard.writeText(UPI_ID)
            showToast('UPI ID copied successfully!', 'success')
        } catch {
            showToast('Unable to copy UPI ID', 'error')
        }
    }

    const handleSubmitPayment = async (e) => {
        e.preventDefault()

        if (!utr.trim()) {
            showToast('Please enter your UTR number', 'error')
            return
        }

        setIsProcessing(true)
        clearError()

        try {
            await submitUpiPayment(utr.trim())
            setUtr('')
            showToast(
                'Payment submitted! Awaiting admin verification.',
                'success'
            )
            await getPaymentStatus()
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Payment submission failed',
                'error'
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const pending = paymentStatus === 'pending'

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
            <div className="max-w-4xl mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Upgrade to Premium
                    </h1>
                    <p className="text-xl text-gray-400">
                        Unlock unlimited job searches and premium features
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Free Plan */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Free Plan
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="text-green-400 mr-3">✓</span>
                                <span className="text-gray-300">
                                    3 job searches per day
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="text-3xl font-bold text-white">
                                Free
                            </div>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-lg p-8 text-white relative">

                        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                            POPULAR
                        </div>

                        <h2 className="text-2xl font-bold mb-6">
                            Premium Plan
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="text-green-200 mr-3">✓</span>
                                <span>Unlimited job searches</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="text-3xl font-bold">₹129</div>
                            <div className="text-green-100">
                                One-time payment
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded-xl p-5 text-gray-900">

                            <h3 className="text-lg font-bold text-center mb-3">
                                Pay using UPI
                            </h3>

                            {qrCode ? (
                                <div className="flex justify-center">
                                    <img
                                        src={qrCode}
                                        alt="NextHire UPI Payment QR Code"
                                        className="w-56 h-56 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-56 h-56 mx-auto flex items-center justify-center text-gray-500">
                                    Generating QR...
                                </div>
                            )}

                            <p className="text-center text-sm text-gray-600 mt-2">
                                Scan using Google Pay, PhonePe or Paytm
                            </p>

                            <div className="mt-5 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-500">
                                    UPI ID
                                </p>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm break-all">
                                        {UPI_ID}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={copyUpiId}
                                        className="text-green-700 font-semibold text-sm shrink-0"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 bg-green-50 rounded-lg p-3 text-sm text-green-800">
                                <p className="font-semibold">
                                    Amount: ₹129
                                </p>
                                <p className="mt-1">
                                    Complete your UPI payment and enter the
                                    transaction reference number below.
                                </p>
                            </div>

                            {/* UTR Submission */}
                            {pending ? (
                                <div className="mt-5 bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
                                    <p className="font-bold text-yellow-800">
                                        Payment Verification Pending
                                    </p>
                                    <p className="text-sm text-yellow-700 mt-2">
                                        Your UTR has been submitted. Premium
                                        will activate after admin verification.
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmitPayment}
                                    className="mt-5"
                                >
                                    <label className="block text-sm font-semibold mb-2">
                                        UTR / Transaction Reference Number
                                    </label>

                                    <input
                                        type="text"
                                        value={utr}
                                        onChange={(e) => setUtr(e.target.value)}
                                        placeholder="Enter your UTR number"
                                        maxLength={30}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            isLoading ||
                                            isProcessing ||
                                            !utr.trim()
                                        }
                                        className="w-full mt-4 bg-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading || isProcessing
                                            ? 'Submitting...'
                                            : 'Submit Payment Details'}
                                    </button>
                                </form>
                            )}

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Payment is subject to manual verification.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Premium
