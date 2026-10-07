"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
    DataTablePagination,
} from "@/components/ui/data-table-pagination";

import type {
    Product,
} from "@/src/services/productService";

import {
    useToggleProductStatus,
} from "@/src/hooks/products/useToggleProductStatus";

import ProductTableToolbar from "@/src/components/products/ProductTableToolbar";

import ViewProductDialog from "@/src/components/products/ViewProductDialog";
import EditProductDialog from "@/src/components/products/EditProductDialog";
import DeleteProductDialog from "@/src/components/products/DeleteProductDialog";

interface ProductTableProps {
    products: Product[];

    categories: {
        id: number;
        name: string;
    }[];

    onProductUpdated: () => void;
}

type ProductStatus =
    Product["status"];

export default function ProductTable({
    products,
    categories,
    onProductUpdated,
}: ProductTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [categoryId, setCategoryId] =
        useState<number | "all">("all");

    const [status, setStatus] =
        useState<ProductStatus | "all">("all");

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);

    const [deletingProduct, setDeletingProduct] =
        useState<Product | null>(null);

    const {
        toggle,
        loading: statusLoading,
        error: statusError,
    } = useToggleProductStatus();

    const filteredProducts =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            return products.filter(
                (product) => {
                    const matchesSearch =
                        !normalizedSearch ||
                        product.name
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        (product.product_code ?? "")
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        product.sku
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        (
                            product.description ?? ""
                        )
                            .toLowerCase()
                            .includes(normalizedSearch)

                    const matchesCategory =
                        categoryId === "all" ||
                        product.category_id ===
                            categoryId;

                    const matchesStatus =
                        status === "all" ||
                        product.status ===
                            status;

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesStatus
                    );
                }
            );
        }, [
            products,
            search,
            categoryId,
            status,
        ]);

    const totalPages = Math.ceil(
        filteredProducts.length /
            pageSize
    );

    useEffect(() => {
        setCurrentPage((page) =>
            Math.min(
                Math.max(page, 1),
                Math.max(
                    totalPages,
                    1
                )
            )
        );
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        categoryId,
        status,
        pageSize,
    ]);

    const startIndex =
        (currentPage - 1) *
        pageSize;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + pageSize
        );

    const handleStatusChange = async (
        productId: number
    ) => {
        const response =
            await toggle(productId);

        if (!response) {
            return;
        }

        onProductUpdated();
    };

    return (
        <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
            <ProductTableToolbar
                search={search}
                categoryId={categoryId}
                status={status}
                categories={categories}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                totalItems={
                    filteredProducts.length
                }
                onSearchChange={setSearch}
                onCategoryChange={
                    setCategoryId
                }
                onStatusChange={setStatus}
            />

            {/* Status Error */}
            {statusError && (
                <div
                    className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    role="alert"
                >
                    {statusError}
                </div>
            )}

            {/* Table */}
            {filteredProducts.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No products found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Product Name
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Product Code
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    SKU
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Category
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Unit
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    SRP
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Status
                                </TableHead>

                                <TableHead className="w-16 whitespace-nowrap text-right text-xs font-semibold text-blue-900">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedProducts.map(
                                (product) => (
                                    <TableRow
                                        key={
                                            product.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell className="font-medium text-slate-900">
                                            {
                                                product.name
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {product.product_code ?? "—"}
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                product.sku
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                product
                                                    .category
                                                    ?.name ??
                                                "Uncategorized"
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                product.unit
                                            }
                                        </TableCell>

                                        <TableCell className="font-medium text-slate-900">
                                            ₱
                                            {Number(
                                                product.srp
                                            ).toLocaleString(
                                                "en-PH",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={
                                                        product.status ===
                                                        "active"
                                                    }
                                                    onCheckedChange={() =>
                                                        handleStatusChange(
                                                            product.id
                                                        )
                                                    }
                                                    disabled={
                                                        statusLoading
                                                    }
                                                    aria-label={`Toggle ${product.name} status`}
                                                />

                                                <span className="text-sm capitalize text-slate-600">
                                                    {
                                                        product.status
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                        />
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />

                                                    <span className="sr-only">
                                                        Open actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setSelectedProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditingProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setDeletingProduct(
                                                                product
                                                            )
                                                        }
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    <DataTablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={
                            filteredProducts.length
                        }
                        pageSize={pageSize}
                        pageSizeOptions={[
                            10,
                            25,
                            50,
                            100,
                        ]}
                        onPageChange={
                            setCurrentPage
                        }
                        onPageSizeChange={
                            setPageSize
                        }
                    />
                </>
            )}

            {/* View Product */}
            <ViewProductDialog
                product={selectedProduct}
                open={
                    selectedProduct !== null
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedProduct(
                            null
                        );
                    }
                }}
            />

            {/* Edit Product */}
            <EditProductDialog
                product={editingProduct}
                categories={categories}
                open={
                    editingProduct !== null
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingProduct(null);
                    }
                }}
                onUpdated={
                    onProductUpdated
                }
            />

            {/* Delete Product */}
            <DeleteProductDialog
                product={deletingProduct}
                open={
                    deletingProduct !== null
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingProduct(
                            null
                        );
                    }
                }}
                onDeleted={
                    onProductUpdated
                }
            />
        </div>
    );
}