"use client";

import { useState } from "react";

import { usePurchaseOrders } from "@/src/hooks/purchase-orders/usePurchaseOrders";
import { useProcessPurchaseOrder } from "@/src/hooks/purchase-orders/useProcessPurchaseOrder";
import {
    useReleasePurchaseOrder,
} from "@/src/hooks/purchase-orders/useReleasePurchaseOrder";

import type {
    PurchaseOrder,
    ReleasePurchaseOrderPayload,
} from "@/src/services/purchaseOrderService";
import { useCompletePurchaseOrder } from "@/src/hooks/purchase-orders/useCompletePurchaseOrder";

import PurchaseOrderTable from "@/src/components/purchase-orders/PurchaseOrderTable";
import ViewPurchaseOrderDialog from "@/src/components/purchase-orders/ViewPurchaseOrderDialog";
import ReleasePurchaseOrderDialog from "@/src/components/purchase-orders/ReleasePurchaseOrderDialog";
import ViewPurchaseOrderAttachmentDialog from "@/src/components/purchase-orders/ViewPurchaseOrderAttachmentDialog";

export default function PurchaseOrdersPage() {
    const {
        purchaseOrders,
        loading,
        error,
        refetch,
    } = usePurchaseOrders();

    const {
        process,
        loading: processing,
        error: processError,
    } = useProcessPurchaseOrder();

    const {
        release,
        loading: releasing,
        error: releaseError,
    } = useReleasePurchaseOrder();

    const {
        complete,
        loading: completing,
        error: completeError,
    } = useCompletePurchaseOrder();

    const [
        selectedPurchaseOrder,
        setSelectedPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        releasePurchaseOrder,
        setReleasePurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        attachmentPurchaseOrder,
        setAttachmentPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const handleProcess =
        async () => {
            if (
                !selectedPurchaseOrder
            ) {
                return;
            }

            const updatedPurchaseOrder =
                await process(
                    selectedPurchaseOrder.id
                );

            if (
                !updatedPurchaseOrder
            ) {
                return;
            }

            setSelectedPurchaseOrder(
                null
            );

            await refetch();
        };

    const handleReleaseRequest =
        () => {
            if (
                !selectedPurchaseOrder
            ) {
                return;
            }

            setReleasePurchaseOrder(
                selectedPurchaseOrder
            );
        };

    const handleRelease =
        async (
            data: ReleasePurchaseOrderPayload
        ) => {
            if (
                !releasePurchaseOrder
            ) {
                return;
            }

            const updatedPurchaseOrder =
                await release(
                    releasePurchaseOrder.id,
                    data
                );

            if (
                !updatedPurchaseOrder
            ) {
                return;
            }

            setReleasePurchaseOrder(
                null
            );

            setSelectedPurchaseOrder(
                null
            );

            await refetch();
        };

    const handleComplete =
        async () => {
            if (
                !selectedPurchaseOrder
            ) {
                return;
            }

            const updatedPurchaseOrder =
                await complete(
                    selectedPurchaseOrder.id
                );

            if (
                !updatedPurchaseOrder
            ) {
                return;
            }

            setSelectedPurchaseOrder(
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
                    View and manage purchase order requests assigned to your warehouse.
                </p>
            </div>

            {/* Process Error */}
            {processError && (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {processError}
                    </p>
                </div>
            )}

            {/* Release Error */}
            {releaseError && (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {releaseError}
                    </p>
                </div>
            )}

            {/* Complete Error */}
            {completeError && (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {completeError}
                    </p>
                </div>
            )}

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
                    purchaseOrders={
                        purchaseOrders
                    }
                    onView={
                        setSelectedPurchaseOrder
                    }
                    onViewAttachment={
                        setAttachmentPurchaseOrder
                    }
                />
            )}

            {/* Purchase Order Details */}
            <ViewPurchaseOrderDialog
                purchaseOrder={
                    selectedPurchaseOrder
                }
                open={
                    selectedPurchaseOrder !==
                    null
                }
                showPrint={true}
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedPurchaseOrder(
                            null
                        );
                    }
                }}
                onProcess={
                    handleProcess
                }
                processing={
                    processing
                }
                onRelease={
                    handleReleaseRequest
                }
                releasing={
                    releasing
                }
                onComplete={
                    handleComplete
                }
                completing={
                    completing
                }
            />

            {/* Release Purchase Order */}
            <ReleasePurchaseOrderDialog
                purchaseOrder={
                    releasePurchaseOrder
                }
                open={
                    releasePurchaseOrder !==
                    null
                }
                loading={
                    releasing
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setReleasePurchaseOrder(
                            null
                        );
                    }
                }}
                onSubmit={
                    handleRelease
                }
            />

            {/* View Purchase Order Attachment */}
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
        </div>
    );
}