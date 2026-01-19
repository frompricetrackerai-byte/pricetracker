import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UserManagementTable from "@/components/admin/UserManagementTable"
import { Shield, Users, Crown, UserCheck, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const session = await auth()

    // @ts-ignore
    if (!session?.user?.isAdmin) {
        console.log(`[Admin Access Denied] ${session?.user?.email} is not an admin`);
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            subscriptionEndDate: true,
        }
    })

    // Stats
    const totalUsers = users.length
    const premiumUsers = users.filter(u => u.subscriptionTier === 'premium').length
    const activeSubscriptions = users.filter(u => u.subscriptionStatus === 'active' && u.subscriptionTier === 'premium').length

    const totalProducts = await prisma.product.count()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    Admin Dashboard
                </h1>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
                    <p className="text-zinc-500 text-sm">Manage users, subscriptions, and products.</p>
                    <Link href="/dashboard/admin/tracking">
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold shadow-sm">
                            <ShoppingCart className="mr-2 h-4 w-4" /> View Tracking Overview <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {/* Total Users */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{totalUsers}</p>
                                <p className="text-sm text-zinc-500 font-medium">Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium Users */}
                <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg">
                                <Crown className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{premiumUsers}</p>
                                <p className="text-sm text-zinc-500 font-medium">Premium Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Subscriptions */}
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{activeSubscriptions}</p>
                                <p className="text-sm text-zinc-500 font-medium">Active Subscriptions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Total Products Stat (New) */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-all hidden md:block">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{totalProducts}</p>
                                <p className="text-sm text-zinc-500 font-medium">Tracked Products</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Management Table */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-white shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        User Management
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UserManagementTable users={users} />
                </CardContent>
            </Card>
        </div>
    )
}
