'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  FileSpreadsheet,
  CheckSquare,
  Square,
  MinusSquare,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | Date;
  render?: (row: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: keyof T | ((row: T, index: number) => string | number);
  
  // Search & Filter
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;

  // Sorting
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;

  // Selection
  selectable?: boolean;
  selectedRowKeys?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[], selectedRows: T[]) => void;
  isRowSelectable?: (row: T) => boolean;

  // Pagination
  paginated?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];

  // Styling & States
  compact?: boolean;
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;

  // Toolbar Actions
  toolbarActions?: React.ReactNode;
  exportCsvFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchFilter,
  defaultSort,
  onSortChange,
  selectable = false,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange,
  isRowSelectable,
  paginated = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  compact = false,
  loading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your search or filters to find what you are looking for.',
  className,
  onRowClick,
  toolbarActions,
  exportCsvFilename,
}: DataTableProps<T>) {
  // --- Search state ---
  const [searchQuery, setSearchQuery] = React.useState('');

  // --- Sort state ---
  const [sortState, setSortState] = React.useState<{ key: string; dir: 'asc' | 'desc' } | null>(
    defaultSort ?? null
  );

  // --- Selection state (uncontrolled fallback) ---
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<(string | number)[]>([]);
  const isControlledSelection = controlledSelectedKeys !== undefined;
  const selectedKeys = isControlledSelection ? controlledSelectedKeys : internalSelectedKeys;

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Helper to extract row key
  const getRowKey = React.useCallback(
    (row: T, index: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row, index);
      }
      return row[rowKey];
    },
    [rowKey]
  );

  // 1. Filtered Data
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();

    if (searchFilter) {
      return data.filter((row) => searchFilter(row, query));
    }

    // Default search over all primitive values in the object
    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFilter]);

  // 2. Sorted Data
  const sortedData = React.useMemo(() => {
    if (!sortState) return filteredData;

    const { key, dir } = sortState;
    const col = columns.find((c) => c.key === key);

    return [...filteredData].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (col?.sortValue) {
        valA = col.sortValue(a);
        valB = col.sortValue(b);
      } else {
        valA = a[key];
        valB = b[key];
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA instanceof Date && valB instanceof Date) {
        return dir === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }

      return dir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [filteredData, sortState, columns]);

  // Reset page when search or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortState, pageSize]);

  // 3. Paginated Data
  const totalPages = paginated ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const paginatedData = React.useMemo(() => {
    if (!paginated) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, paginated, currentPage, pageSize]);

  // Sort toggle handler
  const handleSort = (columnKey: string, isSortable?: boolean) => {
    if (isSortable === false) return;

    let newSort: { key: string; dir: 'asc' | 'desc' } | null = null;
    if (!sortState || sortState.key !== columnKey) {
      newSort = { key: columnKey, dir: 'asc' };
    } else if (sortState.dir === 'asc') {
      newSort = { key: columnKey, dir: 'desc' };
    } else {
      newSort = null;
    }

    setSortState(newSort);
    if (onSortChange && newSort) {
      onSortChange(newSort.key, newSort.dir);
    }
  };

  // Selection handlers
  const selectableRows = React.useMemo(() => {
    if (!isRowSelectable) return paginatedData;
    return paginatedData.filter(isRowSelectable);
  }, [paginatedData, isRowSelectable]);

  const allSelectableKeysOnPage = React.useMemo(() => {
    return selectableRows.map((r, i) => getRowKey(r, i));
  }, [selectableRows, getRowKey]);

  const isAllSelected =
    allSelectableKeysOnPage.length > 0 &&
    allSelectableKeysOnPage.every((k) => selectedKeys.includes(k));

  const isSomeSelected =
    allSelectableKeysOnPage.some((k) => selectedKeys.includes(k)) && !isAllSelected;

  const toggleSelectAll = () => {
    let nextKeys: (string | number)[];
    if (isAllSelected) {
      // Unselect page keys
      nextKeys = selectedKeys.filter((k) => !allSelectableKeysOnPage.includes(k));
    } else {
      // Add all page keys
      const toAdd = allSelectableKeysOnPage.filter((k) => !selectedKeys.includes(k));
      nextKeys = [...selectedKeys, ...toAdd];
    }

    if (!isControlledSelection) {
      setInternalSelectedKeys(nextKeys);
    }
    if (onSelectionChange) {
      const selectedRows = data.filter((row, i) => nextKeys.includes(getRowKey(row, i)));
      onSelectionChange(nextKeys, selectedRows);
    }
  };

  const toggleSelectRow = (key: string | number, row: T) => {
    const isSelected = selectedKeys.includes(key);
    const nextKeys = isSelected
      ? selectedKeys.filter((k) => k !== key)
      : [...selectedKeys, key];

    if (!isControlledSelection) {
      setInternalSelectedKeys(nextKeys);
    }
    if (onSelectionChange) {
      const selectedRows = data.filter((r, i) => nextKeys.includes(getRowKey(r, i)));
      onSelectionChange(nextKeys, selectedRows);
    }
  };

  // CSV Export utility
  const handleExportCsv = () => {
    if (sortedData.length === 0) return;
    const headers = columns.map((col) => `"${String(col.header).replace(/"/g, '""')}"`);
    const rows = sortedData.map((row, idx) => {
      return columns
        .map((col) => {
          let val = col.sortValue ? col.sortValue(row) : row[col.key];
          if (val === null || val === undefined) val = '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportCsvFilename || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <div className={cn('w-full flex flex-col space-y-3', className)}>
      {/* Top Toolbar */}
      {(searchable || toolbarActions || exportCsvFilename || selectedKeys.length > 0) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          {/* Search Box & Selection Notice */}
          <div className="flex flex-1 items-center gap-2">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-9 pr-8 h-9 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {selectedKeys.length > 0 && (
              <Badge variant="indigo" className="font-semibold text-xs py-1 px-2.5">
                {selectedKeys.length} selected
              </Badge>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2">
            {exportCsvFilename && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="h-9 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                Export CSV
              </Button>
            )}
            {toolbarActions}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {selectable && (
                  <th className="w-10 px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-500 hover:text-indigo-600 focus:outline-none"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                      ) : isSomeSelected ? (
                        <MinusSquare className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col) => {
                  const isSortable = col.sortable !== false;
                  const isSorted = sortState?.key === col.key;
                  return (
                    <th
                      key={col.key}
                      style={col.width ? { width: col.width } : undefined}
                      className={cn(
                        'px-4 py-3 select-none',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.headerClassName
                      )}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.key, col.sortable)}
                          className={cn(
                            'inline-flex items-center gap-1.5 hover:text-indigo-600 focus:outline-none transition-colors group',
                            col.align === 'center' && 'justify-center',
                            col.align === 'right' && 'justify-end'
                          )}
                        >
                          <span>{col.header}</span>
                          {isSorted ? (
                            sortState.dir === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      ) : (
                        <span>{col.header}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-slate-500"
                  >
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <p className="mt-2 text-xs text-slate-500 font-medium">Loading records...</p>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-slate-50 rounded-full text-slate-400">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{emptyTitle}</p>
                      <p className="text-xs text-slate-500 max-w-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const key = getRowKey(row, index);
                  const isSelected = selectedKeys.includes(key);
                  const isSelectable = !isRowSelectable || isRowSelectable(row);

                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick && onRowClick(row, index)}
                      className={cn(
                        'transition-colors hover:bg-slate-50/70',
                        isSelected && 'bg-indigo-50/50 hover:bg-indigo-50/70',
                        onRowClick && 'cursor-pointer',
                        compact ? 'h-10 text-xs' : 'h-12 text-sm'
                      )}
                    >
                      {selectable && (
                        <td
                          className="w-10 px-4 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            disabled={!isSelectable}
                            onClick={() => toggleSelectRow(key, row)}
                            className={cn(
                              'text-slate-400 hover:text-indigo-600 focus:outline-none',
                              !isSelectable && 'opacity-40 cursor-not-allowed'
                            )}
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-indigo-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => {
                        const cellVal = col.render ? col.render(row, index) : row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={cn(
                              'px-4 py-2.5',
                              col.align === 'center' && 'text-center',
                              col.align === 'right' && 'text-right tabular-nums',
                              col.cellClassName
                            )}
                          >
                            {cellVal ?? <span className="text-slate-300">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {paginated && sortedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/60 border-t border-slate-200 text-xs text-slate-600">
            {/* Range Text & Page Size Selector */}
            <div className="flex items-center gap-3">
              <span>
                Showing <strong className="font-semibold text-slate-900">{startRecord}</strong> to{' '}
                <strong className="font-semibold text-slate-900">{endRecord}</strong> of{' '}
                <strong className="font-semibold text-slate-900">{sortedData.length}</strong> entries
              </span>
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
                >
                  {pageSizeOptions.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
                title="First Page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
                title="Previous Page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <div className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
                title="Next Page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
                title="Last Page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
