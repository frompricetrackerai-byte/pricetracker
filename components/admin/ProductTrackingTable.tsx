'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, Filter, ShoppingCart, User, IndianRupee } from "lucide-react";
import { format } from "date-fns";

type TrackedProduct = {
    id: string;
    title: string | null;
    url: string;
    imageUrl: string | null;
    currentPrice: any;
    currency: string;
    alertThreshold: any;
    lastCheckedAt: Date | null;
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
    };
};

export default function ProductTrackingTable({ products }: { products: TrackedProduct[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('all');

    const filteredProducts = products.filter(p => {
        const matchesSearch =
            (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        if (storeFilter === 'all') return matchesSearch;
        return matchesSearch && p.url.includes(storeFilter);
    });

    const getStoreName = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            return hostname.replace('www.', '').split('.')[0];
        } catch (e) {
            return 'Unknown';
        }
    };

    const getCurrencySymbol = (currency: string) => {
        const symbols: Record<string, string> = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹'
        };
        return symbols[currency] || currency;
    };

    const stores = Array.from(new Set(products.map(p => getStoreName(p.url))));

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search products or users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-zinc-500" />
                    <select
                        className="bg-white border border-zinc-200 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                        value={storeFilter}
                        onChange={(e) => setStoreFilter(e.target.value)}
                    >
                        <option value="all">All Stores</option>
                        {stores.map(store => (
                            <option key={store} value={store}>{store.charAt(0).toUpperCase() + store.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product Info</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Last Check</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-zinc-500">
                                    No tracked products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((p) => (
                                <TableRow key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <ShoppingCart className="h-5 w-5 text-zinc-400" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[250px] space-y-1">
                                            <p className="font-bold text-sm text-zinc-900 truncate" title={p.title || 'Untitled'}>
                                                {p.title || 'Untitled Product'}
                                            </p>
                                            <p className="text-xs text-zinc-400 flex items-center gap-1">
                                                Added {format(new Date(p.createdAt), 'PP')}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium text-zinc-900">{p.user.name || 'N/A'}</p>
                                            <p className="text-xs text-zinc-500">{p.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize bg-zinc-50 border-zinc-200">
                                            {getStoreName(p.url)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                                                {getCurrencySymbol(p.currency)}{p.currentPrice?.toString() || '-'}
                                                <span className="text-[10px] font-normal text-zinc-400 uppercase">{p.currency}</span>
                                            </div>
                                            {p.alertThreshold && (
                                                <div className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit">
                                                    Target: {getCurrencySymbol(p.currency)}{p.alertThreshold.toString()}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-xs text-zinc-500">
                                            {p.lastCheckedAt ? format(new Date(p.lastCheckedAt), 'p, PP') : 'Never'}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-blue-600">
                                            <a href={p.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
