
import { useEffect } from 'react'
import { usePaymentStore } from '../store/payment.store.js'
import { useToastStore } from '../store/toast.store.js'

const AdminPayments = () => {
    const {
        getTotalPayments,
        verifyUpiPayment,
        paymentDetails,
        isLoading
    } = usePaymentStore()

    const { showToast } = useToastStore()

    useEffect(() => {
        getTotalPayments().catch((error) => {
            showToast(
                error.response?.data?.message || 'Failed to load payments',
                'error'
            )
        })
    }, [getTotalPayments, showToast])

    const handleVerification = async (paymentId, action) => {
        const confirmed = window.confirm(
            action === 'approve'
                ? 'Have you confirmed receiving ₹129 in your bank account? Approve this payment?'
                : 'Are you sure you want to reject this payment?'
        )

        if (!confirmed) return

        try {
            const result = await verifyUpiPayment(paymentId, action)

            showToast(result.message, 'success')
            await getTotalPayments()
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Verification failed',
                'error'
            )
        }
    }

    const pendingPayments = paymentDetails.filter(
        payment => payment.status === 'pending'
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Admin Payment Dashboard
                </h1>

                <p className="text-gray-400 mb-8">
                    Review and verify UPI payment requests.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
                        <p className="text-gray-400">Pending Requests</p>
                        <h2 className="text-3xl font-bold mt-2 text-yellow-400">
                            {pendingPayments.length}
                        </h2>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
                        <p className="text-gray-400">Completed Payments</p>
                        <h2 className="text-3xl font-bold mt-2 text-green-400">
                            {paymentDetails.filter(p => p.status === 'completed').length}
                        </h2>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
                        <p className="text-gray-400">Total Records</p>
                        <h2 className="text-3xl font-bold mt-2">
                            {paymentDetails.length}
                        </h2>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold">
                        Payment Requests
                    </h2>

                    <button
                        onClick={() => getTotalPayments()}
                        disabled={isLoading}
                        className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {isLoading && paymentDetails.length === 0 ? (
                    <p className="text-gray-400">Loading payments...</p>
                ) : paymentDetails.length === 0 ? (
                    <div className="bg-[#1a1a1a] p-8 rounded-lg text-center text-gray-400">
                        No payment requests found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paymentDetails.map(payment => (
                            <div
                                key={payment._id}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5"
                            >
                                <div className="flex flex-wrap justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {payment.userId?.name || 'Unknown User'}
                                        </h3>

                                        <p className="text-gray-400 text-sm">
                                            {payment.userId?.email || 'User unavailable'}
                                        </p>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-sm h-fit ${
                                        payment.status === 'pending'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : payment.status === 'completed'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {payment.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                                    <p>
                                        <span className="text-gray-400">UTR: </span>
                                        <span className="font-mono break-all">
                                            {payment.utr}
                                        </span>
                                    </p>

                                    <p>
                                        <span className="text-gray-400">Amount: </span>
                                        ₹{payment.amount}
                                    </p>

                                    <p>
                                        <span className="text-gray-400">Method: </span>
                                        {payment.paymentMethod?.toUpperCase()}
                                    </p>

                                    <p>
                                        <span className="text-gray-400">Submitted: </span>
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {payment.status === 'pending' && (
                                    <div className="flex gap-3 mt-5">
                                        <button
                                            onClick={() => handleVerification(payment._id, 'approve')}
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleVerification(payment._id, 'reject')}
                                            disabled={isLoading}
                                            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {payment.status !== 'pending' && (
                                    <p className="text-gray-500 text-sm mt-4">
                                        Verified at: {
                                            payment.verifiedAt
                                                ? new Date(payment.verifiedAt).toLocaleString()
                                                : 'N/A'
                                        }
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPayments
