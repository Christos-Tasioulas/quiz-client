import React, { useState, useMemo } from "react";
import type { Column } from "../types/BasicTypes.tsx";

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (event: React.MouseEvent<HTMLTableRowElement>, row: T) => void;
}

type SortDirection = "asc" | "desc";

export default function Table<T extends object>({
                                                    data,
                                                    columns,
                                                    onRowClick,
                                                }: TableProps<T>) {
    const [sortColumn, setSortColumn] = useState<Column<T> | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sortedData = useMemo(() => {
        if (!sortColumn || !sortColumn.sortable) return data;

        const sorted = [...data].sort((a, b) => {
            // support custom sortValue first
            const aValue = sortColumn.sortValue?.(a) ??
                (sortColumn.key ? (a[sortColumn.key] as unknown as string | number | Date) : null);
            const bValue = sortColumn.sortValue?.(b) ??
                (sortColumn.key ? (b[sortColumn.key] as unknown as string | number | Date) : null);

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue);
            }

            if (aValue > bValue) return 1;
            if (aValue < bValue) return -1;
            return 0;
        });

        return sortDirection === "asc" ? sorted : sorted.reverse();
    }, [data, sortColumn, sortDirection]);

    const handleSort = (col: Column<T>) => {
        if (!col.sortable) return;
        if (sortColumn === col) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    const tableHeaders = columns.map((col) => {
        const isSorted = sortColumn === col;
        return (
            <th
                key={(col.key as string) ?? col.label}
                onClick={() => handleSort(col)}
                className={`cursor-pointer select-none ${
                    col.sortable ? "hover:text-blue-500" : ""
                }`}
            >
                <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && isSorted && (
                        <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                </div>
            </th>
        );
    });

    const tableElements = sortedData.map((row, i) => (
        <tr
            key={i}
            onClick={(event) => onRowClick?.(event, row)}
            className="user-table-row hover:bg-gray-100 cursor-pointer"
        >
            {columns.map((col) => {
                let cellContent: React.ReactNode = "-";

                if (col.render) {
                    cellContent = col.render(row);
                } else if (col.format && col.key) {
                    const value = row[col.key as keyof T];
                    cellContent = col.format(value, row);
                } else if (col.key) {
                    const value = row[col.key as keyof T];
                    cellContent = (value as React.ReactNode) ?? "-";
                }

                return (
                    <td key={(col.key as string) ?? col.label}>{cellContent}</td>
                );
            })}
        </tr>
    ));

    return (
        <div className="scroll-container">
            <table className="scroll">
                <thead>
                <tr>{tableHeaders}</tr>
                </thead>
                <tbody className="scroll-body">{tableElements}</tbody>
            </table>
        </div>
    );
}
