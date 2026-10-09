"use client";

import { useState } from "react";

import { usePurchaseOrders } from "@/src/hooks/purchase-orders/usePurchaseOrders";

import PurchaseOrderTable from "@/src/components/purchase-orders/PurchaseOrderTable";
import ViewPurchaseOrderDialog from "@/src/components/purchase-orders/ViewPurchaseOrderDialog";
import ViewPurchaseOrderAttachmentDialog from "@/src/components/purchase-orders/ViewPurchaseOrderAttachmentDialog";

import ReviewPurchaseOrderDialog from "@/src/components/admin/purchase-orders/ReviewPurchaseOrderDialog";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

export default function PurchaseOrdersPage() {
    const [
        selectedPurchaseOrder,
        setSelectedPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        reviewPurchaseOrder,
        setReviewPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        attachmentPurchaseOrder,
        setAttachmentPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const {
        purchaseOrders,
        loading,
        error,
        refetch,
    } = usePurchaseOrders();

    const handleReviewed =
        async () => {
            setReviewPurchaseOrder(
                null
            );

            await refetch();
        };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Purchase Orders
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Review and manage purchase order requests submitted by branch coordinators.
                </p>
            </div>

            {/* Purchase Orders */}
            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading purchase orders...
                    </p>
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <PurchaseOrderTable
                    purchaseOrders={purchaseOrders}
                    onUpdated={refetch}
                    onView={setSelectedPurchaseOrder}
                    onReview={setReviewPurchaseOrder}
                    onViewAttachment={setAttachmentPurchaseOrder}
                />
            )}

            {/* View Purchase Order Dialog */}
            <ViewPurchaseOrderDialog
                purchaseOrder={
                    selectedPurchaseOrder
                }
                open={
                    selectedPurchaseOrder !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedPurchaseOrder(
                            null
                        );
                    }
                }}
            />

            {/* View Purchase Order Attachment Dialog */}
            <ViewPurchaseOrderAttachmentDialog
                purchaseOrder={
                    attachmentPurchaseOrder
                }
                open={
                    attachmentPurchaseOrder !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setAttachmentPurchaseOrder(
                            null
                        );
                    }
                }}
            />

            {/* Review Purchase Order Dialog */}
            <ReviewPurchaseOrderDialog
                purchaseOrder={
                    reviewPurchaseOrder
                }
                open={
                    reviewPurchaseOrder !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setReviewPurchaseOrder(
                            null
                        );
                    }
                }}
                onReviewed={
                    handleReviewed
                }
            />
        </div>
    );
}