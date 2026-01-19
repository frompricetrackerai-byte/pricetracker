import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductTrackingTable from "@/components/admin/ProductTrackingTable"
import { ShoppingCart, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

export default async function AdminTrackingPage() {
    const session = await auth()

    // @ts-ignore
    if (!session?.user?.isAdmin) {
        redirect("/dashboard");
    }

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-2">
                        <Link href="/dashboard/admin" className="flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft className="h-4 w-4" /> Back to Admin
                        </Link>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8 text-blue-600" />
                        Tracking Overview
                    </h1>
                    <p className="text-zinc-500 text-sm">Monitor all products being tracked across the platform.</p>
                </div>

                <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
                    <CardContent className="py-3 px-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-zinc-900">{products.length}</p>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Products</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tracking Table Section */}
            <Card className="border-2 border-blue-100 shadow-xl overflow-hidden">
                <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        Live Product Tracking
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-6">
                        <ProductTrackingTable products={products as any} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
