import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, CheckCircle2, Mail, ShoppingBag, TrendingDown, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="bg-blue-600 text-white p-1 rounded-lg">
              <TrendingDown className="h-5 w-5" />
            </div>
            Price Tracker AI
          </div>
          <nav className="flex gap-4">
            {/* Removed redundant Dashboard/Login link */}
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40">
                Login / Signup
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-32 lg:pb-28 bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden relative">
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-wander"></div>

          {/* Floating Icons Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[8%] text-blue-500 opacity-30 animate-wander-slow">
              <ShoppingBag className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <div className="absolute top-24 right-[12%] text-green-500 opacity-30 animate-wander-delayed">
              <div className="text-4xl md:text-5xl font-bold">$</div>
            </div>
            <div className="absolute bottom-1/4 left-[6%] text-purple-500 opacity-30 animate-wander">
              <Zap className="h-10 w-10 md:h-14 md:w-14" />
            </div>
            <div className="absolute top-1/3 right-[8%] text-orange-500 opacity-30 animate-wander-slow">
              <Bell className="h-10 w-10 md:h-12 md:w-12" />
            </div>
            <div className="absolute bottom-16 left-[18%] text-pink-500 opacity-30 animate-wander-delayed">
              <div className="text-3xl md:text-4xl font-bold">%</div>
            </div>
            <div className="absolute top-1/2 right-[20%] text-cyan-500 opacity-25 animate-wander">
              <TrendingDown className="h-10 w-10 md:h-12 md:w-12" />
            </div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center rounded-full border-2 border-blue-500 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                AI-Powered Price Tracking
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Never Miss a{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    Price Drop
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                    <path d="M0 6C75 1 225 1 300 6C225 11 75 11 0 6Z" fill="url(#gradient)" opacity="0.6" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed">
                Track products from Amazon, Flipkart, and 100+ stores. Get instant alerts when prices drop. Save money effortlessly with AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/40 rounded-full group">
                    Start Tracking Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Notification Channels */}
              <div className="flex flex-col items-center gap-3 pt-6 animate-fade-in-up delay-200">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">We notify via</p>
                <div className="flex items-center gap-6">
                  {/* WhatsApp */}
                  <div className="group relative flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#25D366] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                  </div>

                  {/* Telegram */}
                  <div className="group relative flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0088cc] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,136,204,0.4)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-[#0088cc] transition-colors">Telegram</span>
                  </div>

                  {/* Mail */}
                  <div className="group relative flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-red-500 transition-colors">Email</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Supported Stores Section */}
        <section className="w-full py-12 bg-white border-b border-gray-100">
          <div className="container px-4 md:px-6">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
              Trusted by shoppers on major platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Amazon */}
              <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <span className="text-[#FF9900]">Amazon</span>
              </div>
              {/* Flipkart */}
              <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <span className="text-[#2874F0]">Flipkart</span>
              </div>
              {/* Myntra */}
              <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <span className="text-[#E40046]">Myntra</span>
              </div>
              {/* Ajio */}
              <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <span className="text-[#2C4152]">Ajio</span>
              </div>
              {/* Croma */}
              <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <span className="text-[#00BFA5]">Croma</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">Start saving money in 3 simple steps. No complicated setup required.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-2">1</div>
                <h3 className="text-xl font-bold">Copy Product Link</h3>
                <p className="text-gray-600">Find a product you like on Amazon, Flipkart, or any other store and copy its URL.</p>
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-300 -z-10"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mb-2">2</div>
                <h3 className="text-xl font-bold">Paste & Track</h3>
                <p className="text-gray-600">Paste the link into Price Tracker AI and set your desired target price.</p>
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-300 -z-10"></div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mb-2">3</div>
                <h3 className="text-xl font-bold">Get Notified</h3>
                <p className="text-gray-600">Relax! We'll send you an instant alert via WhatsApp or Email when the price drops.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section (Existing but polished) */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Add Any Product</h3>
                    <p className="text-gray-600">Simply paste the product URL and we'll start tracking</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-lg hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white mb-4 shadow-lg">
                      <TrendingDown className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Real-Time Tracking</h3>
                    <p className="text-gray-600">AI monitors prices 24/7 across all major stores</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-6 shadow-lg hover:shadow-2xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg">
                      <Bell className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Instant Alerts</h3>
                    <p className="text-gray-600">Get notified the moment prices drop below your target</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="w-full py-20 bg-white border-t border-gray-100" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="flex flex-col p-8 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 transition-colors shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Free Starter</h3>
                  <p className="text-gray-500 text-sm mt-1">Perfect for casual shoppers</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Track up to 3 products
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Automated price updates
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Email alerts
                  </li>
                </ul>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="relative flex flex-col p-8 bg-white border-2 border-blue-600 rounded-2xl shadow-xl scale-105 z-10">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Pro Saver</h3>
                  <p className="text-blue-600 text-sm mt-1 font-medium">For serious deal hunters</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">$6</span>
                    <span className="text-gray-400 line-through text-lg">$12</span>
                  </div>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-900">Track 100 products</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-900">Faster price updates</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                    Priority WhatsApp & Telegram alerts
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                    Price history charts
                  </li>
                </ul>
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-gray-50" id="faq">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Q1 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is this service free?</h3>
                <p className="text-gray-600">Yes! You can track a limited number of products for free forever. We also offer premium plans for power users who want to track unlimited items.</p>
              </div>
              {/* Q2 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How fast will I get notified?</h3>
                <p className="text-gray-600">Our AI checks prices frequently. You will receive an alert via WhatsApp, Telegram, or Email typically within minutes of a price drop.</p>
              </div>
              {/* Q3 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Which websites do you support?</h3>
                <p className="text-gray-600">We support all major e-commerce platforms including Amazon, Flipkart, Myntra, Ajio, Croma, and over 100+ other online stores.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">Why Choose Price Tracker AI?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">We provide the most accurate and timely price tracking features to help you save more.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Real-time Updates</h3>
                <p className="text-gray-500">
                  Our advanced scraping engine checks prices frequently to ensure you never miss a deal.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Instant Notifications</h3>
                <p className="text-gray-500">
                  Receive alerts via email or push notification the second a price drops below your target.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Universal Support</h3>
                <p className="text-gray-500">
                  Works with Amazon, Flipkart, Myntra, and hundreds of other online retailers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            Price Tracker AI
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Price Tracker AI. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Price Tracker AI",
            "applicationCategory": "ShoppingApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "description": "Track prices from Amazon, Flipkart, Myntra and get instant alerts on WhatsApp and Telegram.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1200"
            }
          })
        }}
      />
    </div>
  )
}
