"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    ProductRanking,
} from "@/src/services/productRankingService";

interface AdminProductDemandRankingProps {
    rankings: ProductRanking[];
    loading: boolean;
}

interface ChartItem {
    rank: number;
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    percentage: number;
}

function truncateText(
    value: string,
    maxLength: number
) {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}...`;
}

function formatNumber(value: number) {
    return value.toLocaleString("en-PH", {
        maximumFractionDigits: 2,
    });
}

/*
|--------------------------------------------------------------------------
| Custom Y-Axis Tick
|--------------------------------------------------------------------------
|
| Important:
| We intentionally use a single translated <g> with predictable
| coordinates instead of large negative x values.
|
| This prevents the rank badge from overlapping the product name.
|
*/

function ProductYAxisTick({
    x,
    y,
    payload,
}: {
    x?: number;
    y?: number;
    payload?: {
        value: string;
    };
}) {
    if (
        x === undefined ||
        y === undefined ||
        !payload
    ) {
        return null;
    }

    return (
        <g
            transform={`translate(${x - 235}, ${y})`}
        >
            {/* Rank badge */}

            <rect
                x={0}
                y={-13}
                width={30}
                height={26}
                rx={8}
                fill="#eff6ff"
            />

            <text
                x={15}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#2563eb"
                fontSize={11}
                fontWeight={700}
            >
                #{payload.value}
            </text>

            {/* Product name */}

            <text
                x={42}
                y={0}
                textAnchor="start"
                dominantBaseline="middle"
                fill="#334155"
                fontSize={12}
                fontWeight={500}
            >
                {truncateText(
                    payload.value,
                    24
                )}
            </text>
        </g>
    );
}

/*
|--------------------------------------------------------------------------
| Custom Product Tick
|--------------------------------------------------------------------------
|
| Recharts gives the YAxis tick only the product name.
| We need the actual rank, so the chart uses a separate rank map.
|
*/

function createRankMap(
    data: ChartItem[]
) {
    return new Map(
        data.map((item) => [
            item.name,
            item.rank,
        ])
    );
}

/*
|--------------------------------------------------------------------------
| Tooltip
|--------------------------------------------------------------------------
*/

function ProductTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{
        payload: ChartItem;
        value: number;
    }>;
}) {
    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const item =
        payload[0]?.payload;

    if (!item) {
        return null;
    }

    return (
        <div className="min-w-[250px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
            {/* Header */}

            <div className="flex items-start gap-3 px-4 py-3.5">
                <div
                    className={
                        item.rank === 1
                            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white"
                            : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600"
                    }
                >
                    #{item.rank}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {item.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                        SKU: {item.sku}
                    </p>
                </div>
            </div>

            {/* Metrics */}

            <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                        Requested quantity
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                        {formatNumber(
                            item.quantity
                        )}{" "}
                        <span className="font-medium text-slate-500">
                            {item.unit}
                        </span>
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                        Share of displayed demand
                    </span>

                    <span className="text-xs font-semibold text-blue-600">
                        {item.percentage.toFixed(
                            1
                        )}
                        %
                    </span>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

export default function AdminProductDemandRanking({
    rankings,
    loading,
}: AdminProductDemandRankingProps) {
    /*
    |--------------------------------------------------------------------------
    | Chart Data
    |--------------------------------------------------------------------------
    */

    const chartData: ChartItem[] =
        rankings
            .slice(0, 10)
            .map((item) => ({
                rank: item.rank,
                name:
                    item.product_name ??
                    "Unknown Product",
                sku:
                    item.sku ?? "—",
                quantity:
                    Number(
                        item.total_quantity
                    ),
                unit:
                    item.unit ?? "",
                percentage: 0,
            }));

    /*
    |--------------------------------------------------------------------------
    | Total Demand
    |--------------------------------------------------------------------------
    */

    const totalDemand =
        chartData.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    /*
    |--------------------------------------------------------------------------
    | Percentage
    |--------------------------------------------------------------------------
    */

    const normalizedChartData =
        chartData.map((item) => ({
            ...item,
            percentage:
                totalDemand > 0
                    ? (item.quantity /
                          totalDemand) *
                      100
                    : 0,
        }));

    /*
    |--------------------------------------------------------------------------
    | KPI Data
    |--------------------------------------------------------------------------
    */

    const topProduct =
        normalizedChartData[0] ?? null;

    /*
    |--------------------------------------------------------------------------
    | Rank Lookup
    |--------------------------------------------------------------------------
    */

    const rankMap =
        createRankMap(
            normalizedChartData
        );

    return (
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
            {/* =========================================================
                Header
            ========================================================= */}

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* Title */}

                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                            </div>

                            <h2 className="text-base font-semibold tracking-tight text-slate-900">
                                Product Demand Ranking
                            </h2>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-500">
                            Products most requested
                            through branch purchase
                            orders.
                        </p>
                    </div>

                    {/* KPIs */}

                    {!loading &&
                        normalizedChartData.length >
                            0 && (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {/* Products */}

                                <div className="min-w-[120px] rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                        Products
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {
                                            normalizedChartData.length
                                        }
                                    </p>
                                </div>

                                {/* Total Demand */}

                                <div className="min-w-[140px] rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-2.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-500">
                                        Total Demand
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {formatNumber(
                                            totalDemand
                                        )}{" "}
                                        <span className="text-xs font-medium text-slate-500">
                                            units
                                        </span>
                                    </p>
                                </div>

                                {/* Top Demand */}

                                <div className="min-w-[190px] rounded-xl border border-blue-100 bg-white px-3.5 py-2.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-500">
                                        Top Demand
                                    </p>

                                    <div className="mt-1 flex min-w-0 items-center gap-2">
                                        <p className="min-w-0 truncate text-sm font-semibold text-slate-800">
                                            {
                                                topProduct?.name
                                            }
                                        </p>

                                        <span className="shrink-0 text-xs font-semibold text-blue-600">
                                            {formatNumber(
                                                topProduct?.quantity ??
                                                    0
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* =========================================================
                Chart
            ========================================================= */}

            <div className="px-3 py-5 sm:px-5 lg:px-6">
                {loading ? (
                    <div className="flex h-[390px] items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                            <p className="mt-3 text-sm text-slate-400">
                                Loading product demand...
                            </p>
                        </div>
                    </div>
                ) : normalizedChartData.length ===
                  0 ? (
                    <div className="flex h-[390px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-6 w-6 text-blue-500"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 19V5M4 19H20M8 16V11M12 16V8M16 16V5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-700">
                            No purchase order data
                            available
                        </p>

                        <p className="mt-1 max-w-sm text-center text-xs leading-5 text-slate-400">
                            Product demand will
                            appear here once
                            qualifying purchase
                            orders are available.
                        </p>
                    </div>
                ) : (
                    <div className="h-[390px] w-full">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={
                                    normalizedChartData
                                }
                                layout="vertical"
                                margin={{
                                    top: 8,
                                    right: 76,
                                    left: 12,
                                    bottom: 8,
                                }}
                                barCategoryGap="22%"
                            >
                                <CartesianGrid
                                    stroke="#e2e8f0"
                                    strokeDasharray="3 4"
                                    horizontal={
                                        false
                                    }
                                />

                                {/* X Axis */}

                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={(
                                        value
                                    ) =>
                                        formatNumber(
                                            Number(
                                                value
                                            )
                                        )
                                    }
                                />

                                {/* Y Axis */}

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={250}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={(props) => {
                                        const productName =
                                            String(
                                                props
                                                    .payload
                                                    ?.value ??
                                                    ""
                                            );

                                        const rank =
                                            rankMap.get(
                                                productName
                                            );

                                        if (
                                            !rank
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <g
                                                transform={`translate(${Number(props.x ?? 0) - 250}, ${Number(props.y ?? 0)})`}
                                            >
                                                {/* Rank badge */}

                                                <rect
                                                    x={0}
                                                    y={-13}
                                                    width={30}
                                                    height={26}
                                                    rx={8}
                                                    fill="#eff6ff"
                                                />

                                                <text
                                                    x={15}
                                                    y={0}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fill="#2563eb"
                                                    fontSize={11}
                                                    fontWeight={700}
                                                >
                                                    #
                                                    {
                                                        rank
                                                    }
                                                </text>

                                                {/* Product name */}

                                                <text
                                                    x={42}
                                                    y={0}
                                                    textAnchor="start"
                                                    dominantBaseline="middle"
                                                    fill="#334155"
                                                    fontSize={12}
                                                    fontWeight={500}
                                                >
                                                    {truncateText(
                                                        productName,
                                                        24
                                                    )}
                                                </text>
                                            </g>
                                        );
                                    }}
                                />

                                {/* Tooltip */}

                                <Tooltip
                                    cursor={{
                                        fill: "#f8fafc",
                                    }}
                                    content={
                                        <ProductTooltip />
                                    }
                                />

                                {/* Bars */}

                                <Bar
                                    dataKey="quantity"
                                    radius={[
                                        0,
                                        8,
                                        8,
                                        0,
                                    ]}
                                    background={{
                                        fill: "#f8fafc",
                                        radius: 8,
                                    }}
                                    maxBarSize={34}
                                >
                                    {normalizedChartData.map(
                                        (
                                            item
                                        ) => (
                                            <Cell
                                                key={`${item.rank}-${item.name}`}
                                                fill={
                                                    item.rank ===
                                                    1
                                                        ? "#1d4ed8"
                                                        : "#2563eb"
                                                }
                                            />
                                        )
                                    )}

                                    {/* Quantity */}

                                    <LabelList
                                        dataKey="quantity"
                                        position="right"
                                        formatter={(
                                            value
                                        ) =>
                                            formatNumber(
                                                Number(
                                                    value
                                                )
                                            )
                                        }
                                        className="fill-slate-600 text-[11px] font-semibold"
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* =========================================================
                Footer
            ========================================================= */}

            {!loading &&
                normalizedChartData.length >
                    0 && (
                    <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
                        <div className="flex flex-col gap-2.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            {/* Basis */}

                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-600">
                                    Demand basis:
                                </span>

                                <span>
                                    Branch purchase
                                    order quantities
                                </span>
                            </div>

                            {/* Summary */}

                            <div className="flex items-center gap-4">
                                <span>
                                    Total displayed:
                                    {" "}
                                    <strong className="font-semibold text-slate-700">
                                        {formatNumber(
                                            totalDemand
                                        )}
                                    </strong>{" "}
                                    units
                                </span>

                                <span className="hidden text-slate-300 sm:inline">
                                    |
                                </span>

                                <span>
                                    Top{" "}
                                    {
                                        normalizedChartData.length
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}
        </section>
    );
}