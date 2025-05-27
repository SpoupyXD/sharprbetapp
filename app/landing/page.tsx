"use client"

import { Logo } from "@/components/logo"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import { RegisterForm } from "@/components/register-form"
import { LoginForm } from "@/components/login-form"
import { BarChart3, Wallet, Calendar, Trophy, Zap, CheckCircle2, ArrowRight } from "lucide-react"

export default function LandingPage() {
  // 🟢 All your state hooks go **inside** the function!
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true)
  const closeLoginModal = () => setLoginModalOpen(false)

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      {/* Navigation/Header */}
<header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
    <div className="flex items-center gap-2">
    <Logo className="h-8" />
    </div>
    <nav className="hidden md:flex gap-6">
      <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Features
      </a>
      <a href="#benefits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Benefits
      </a>
      <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Testimonials
      </a>
      <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Pricing
      </a>
    </nav>
    <div className="flex items-center gap-4">
      <Button variant="ghost" className="text-sm" onClick={openLoginModal}>
        Log in
      </Button>
      <Button
  className="text-sm"
  onClick={() => {
    const section = document.getElementById("pricing")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }}
>
  Get Started
</Button>


    </div>
  </div>
</header>


      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-7xl lg:text-6xl font-bold tracking-tight">
              Track, Analyze, <span className="text-primary">Win</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              SharpR helps you track your bets, analyze your performance, and maximize your profits with powerful tools
              designed for serious bettors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
  size="lg"
  className="w-full sm:w-auto"
  onClick={() =>
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }
>
  Start Tracking
</Button>

<Button
  size="lg"
  variant="outline"
  className="w-full sm:w-auto"
  asChild
>
  <a href="#features">
    Explore Features
  </a>
</Button>

            </div>
          </div>
          <div className="flex-1 w-full max-w-[600px] rounded-lg overflow-hidden shadow-xl border bg-muted/10 flex items-center justify-center min-h-[320px]">
            {/* Replace with a real image if you have one */}
            <Image
              src="/dashboard-features.png"
              alt="SharpR Dashboard"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-muted/50 py-24 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Serious Bettors</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Everything you need to track, analyze, and improve your betting performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Track your ROI, win rate, and profit across bookmakers, sports, and bet types to identify your
                strengths.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bankroll Management</h3>
              <p className="text-muted-foreground">
                Monitor your balances across bookmakers and track deposits, withdrawals, and bonus bets.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bet Calendar</h3>
              <p className="text-muted-foreground">
                View your pending bets in a calendar format to manage your action and never miss a game.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bonus Bet Tracker</h3>
              <p className="text-muted-foreground">
                Track all your bonus bets, their expiration dates, and conversion rates to maximize value.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kelly Calculator</h3>
              <p className="text-muted-foreground">
                Optimize your bet sizing with built-in Kelly Criterion calculator for proper bankroll management.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dutching Calculator</h3>
              <p className="text-muted-foreground">
                Calculate optimal stake distribution across multiple outcomes to guarantee profits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SharpR?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">Make Data-Driven Decisions</h3>
                  <p className="text-muted-foreground">
                    Stop relying on gut feelings. Use actual performance data to improve your betting strategy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">Track All Your Accounts</h3>
                  <p className="text-muted-foreground">
                    Manage multiple bookmaker accounts in one place with real-time balance tracking.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">Maximize Bonus Value</h3>
                  <p className="text-muted-foreground">
                    Never let a bonus bet expire again. Track and optimize the value of your promotional offers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your betting data stays private and secure. We never share your information with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[600px]">
            <div className="rounded-lg overflow-hidden shadow-xl border bg-muted/10 flex items-center justify-center min-h-[320px]">
              {/* Replace with a real image if you have one */}
              <Image
                src="/analytics-features.png"
                alt="Betting Analysis"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="w-full bg-muted/50 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Join thousands of bettors who have improved their results with SharpR
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">James D.</h4>
                  <p className="text-sm text-muted-foreground">Sports Bettor</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "SharpR helped me identify that I was actually losing money on NFL bets but profitable on NBA. I've
                adjusted my strategy and my ROI has improved by 8% in just two months."
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-muted-foreground">Horse Racing Enthusiast</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The bonus bet tracker alone is worth the subscription. I was letting so many bonus bets expire before I
                started using SharpR. Now I'm converting them at nearly 80% value."
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">RK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ryan K.</h4>
                  <p className="text-sm text-muted-foreground">Professional Bettor</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As someone who places over 500 bets a year across 8 bookmakers, SharpR has been a game-changer for my
                record keeping. The performance analytics have helped me refine my approach."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Choose the plan that fits your betting style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto items-start justify-center">
            <div className="bg-background p-6 rounded-lg border shadow-sm flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-muted-foreground">Forever</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Track up to 50 bets</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Basic performance stats</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Kelly calculator</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Track 3 bookmakers</span>
                </li>
              </ul>
              <div className="mt-auto">
  <Link href="/register?plan=free">
    <Button className="w-full">Sign Up</Button>
  </Link>
</div>

            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm relative flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">$9.99</div>
                <p className="text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Unlimited bet tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Bonus bet tracker</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Track unlimited bookmakers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Dutching calculator</span>
                </li>
              </ul>
              <div className="mt-auto">
  <Link href="/register?plan=pro">
    <Button className="w-full">Sign Up</Button>
  </Link>
</div>

            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
  Already have an account?{" "}
  <button
    onClick={() => setLoginModalOpen(true)}
    className="text-primary underline hover:text-primary/80"
  >
    Log in
  </button>
</p>

      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary text-primary-foreground py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your Betting Results?</h2>
          <p className="text-xl max-w-[800px] mx-auto mb-8 text-primary-foreground/90">
            Join thousands of bettors who are tracking, analyzing, and winning with SharpR.
          </p>
          <Button
  size="lg"
  variant="secondary"
  className="text-primary"
  onClick={() =>
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }
>
  Get Started Free
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-muted/50 py-12 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <Image src="/sharpr-logo.png" alt="SharpR" width={120} height={40} className="h-8 w-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                The ultimate betting tracker for serious bettors. Track, analyze, and improve your betting performance.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Facebook
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Instagram
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} SharpR. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Login / Register Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogTitle className="text-center text-lg font-semibold">Log In to SharpR</DialogTitle>
    <LoginForm onSuccess={closeLoginModal} />
  </DialogContent>
</Dialog>




    </div>
    
  )
}
