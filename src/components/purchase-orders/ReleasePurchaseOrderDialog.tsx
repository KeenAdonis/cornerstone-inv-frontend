"use client";

import {
    useEffect,
    useState,
} from "react";

import { format } from "date-fns";
import { Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DatePicker } from "@/components/ui/date-picker";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    DeliveryType,
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface ReleasePurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        delivery_type: DeliveryType;
        ship_out_date: string;
    }) => void;
}

const deliveryTypeOptions: {
    value: DeliveryType;
    label: string;
}[] = [
    {
        value: "in_house",
        label: "In-House",
    },
    {
        value: "trucking",
        label: "Trucking",
    },
    {
        value: "bus",
        label: "Bus (Victory D&G)",
    },
    {
        value: "air_cargo",
        label: "Air Cargo (A-Best)",
    },
    {
        value: "forwarding",
        label: "Forwarding (Southsea)",
    },
];

export default function ReleasePurchaseOrderDialog({
    purchaseOrder,
    open,
    loading = false,
    onOpenChange,
    onSubmit,
}: ReleasePurchaseOrderDialogProps) {
    const [
        deliveryType,
        setDeliveryType,
    ] = useState<DeliveryType | "">("");

    const [
        shipOutDate,
        setShipOutDate,
    ] = useState("");

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setDeliveryType("");
            setShipOutDate("");
            setValidationError(null);
        }
    }, [open]);

    const handleSubmit = () => {
        if (!deliveryType) {
            setValidationError(
                "Please select a delivery type."
            );

            return;
        }

        if (!shipOutDate) {
            setValidationError(
                "Please select the ship out date."
            );

            return;
        }

        setValidationError(null);

        onSubmit({
            delivery_type: deliveryType,
            ship_out_date: shipOutDate,
        });
    };

    const handleOpenChange = (
        nextOpen: boolean
    ) => {
        if (loading) {
            return;
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-md">
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <Truck className="h-5 w-5 text-blue-600" />

                        Out for Delivery
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Provide the delivery details before releasing this purchase order.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {purchaseOrder && (
                        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3">
                            <p className="text-xs text-slate-500">
                                Purchase Order
                            </p>

                            <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                                {
                                    purchaseOrder.reference_number
                                }
                            </p>
                        </div>
                    )}

                    <div className="space-y-5 py-2">
                        {/* Delivery Type */}
                        <div className="space-y-2">
                            <label
                                htmlFor="delivery-type"
                                className="text-sm font-medium text-slate-700"
                            >
                                Delivery Type

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <Select
                                value={
                                    deliveryType
                                }
                                onValueChange={(
                                    value
                                ) => {
                                    setDeliveryType(
                                        value as DeliveryType
                                    );

                                    setValidationError(
                                        null
                                    );
                                }}
                                disabled={
                                    loading
                                }
                            >
                                <SelectTrigger
                                    id="delivery-type"
                                    className="w-full border-slate-200 bg-white"
                                >
                                    <SelectValue placeholder="Select delivery type">
                                        {(value: string | null) => {
                                            const selectedOption =
                                                deliveryTypeOptions.find(
                                                    (option) =>
                                                        option.value === value
                                                );
                                            
                                            return selectedOption?.label ??
                                                "Select delivery type";
                                        }}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {deliveryTypeOptions.map(
                                        (
                                            option
                                        ) => (
                                            <SelectItem
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ship Out Date */}
                        <div className="space-y-2">
                            <label
                                htmlFor="ship-out-date"
                                className="text-sm font-medium text-slate-700"
                            >
                                Ship Out Date

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <DatePicker
                                value={
                                    shipOutDate
                                        ? new Date(
                                              `${shipOutDate}T00:00:00`
                                          )
                                        : undefined
                                }
                                onChange={(
                                    date
                                ) => {
                                    setShipOutDate(
                                        date
                                            ? format(
                                                  date,
                                                  "yyyy-MM-dd"
                                              )
                                            : ""
                                    );

                                    setValidationError(
                                        null
                                    );
                                }}
                                placeholder="Select ship out date"
                                disabled={
                                    loading
                                }
                            />
                        </div>

                        {/* Validation Error */}
                        {validationError && (
                            <div
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-2"
                                role="alert"
                            >
                                <p className="text-sm text-red-600">
                                    {
                                        validationError
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        disabled={
                            loading
                        }
                        className="rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            loading
                        }
                        className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Truck className="h-4 w-4" />

                        {loading
                            ? "Releasing..."
                            : "Out for Delivery"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}