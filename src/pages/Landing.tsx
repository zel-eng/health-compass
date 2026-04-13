import { Heart, ArrowRight, CheckCircle, Users, Zap, Shield, BarChart3, Bell, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 frosted-glass border-b border-white/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">MedFlow</span>
          </div>
          <Link to="/login">
            <Button className="rounded-lg">Ingia</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-5 overflow-hidden">
        {/* Animated gradient background blobs */}
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float opacity-40" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-info/10 blur-3xl animate-float-slow opacity-40" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto scroll-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Jibu Bora la Kusimamia <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">Afya ya Wagonjwa</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              MedFlow ni mfumo wa kisasa wa kusimamia wagonjwa, kufuatilia vitals, na kupeana arifa haraka. Jibu kamili la digital health kwa hospitali na kliniki.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/login">
                <Button size="lg" className="rounded-xl h-12 px-8 text-base">
                  Jaribu Sasa
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <button className="h-12 px-8 rounded-xl bg-white/10 text-foreground border border-white/20 font-medium hover:bg-white/20 transition-all hover-lift">
                Tazama Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="rounded-xl frosted-glass border border-white/20 p-4 scroll-scale-in" style={{ animationDelay: "100ms" }}>
                <p className="text-2xl font-bold text-foreground">99%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="rounded-xl frosted-glass border border-white/20 p-4 scroll-scale-in" style={{ animationDelay: "150ms" }}>
                <p className="text-2xl font-bold text-foreground">5000+</p>
                <p className="text-xs text-muted-foreground">Wagonjwa</p>
              </div>
              <div className="rounded-xl frosted-glass border border-white/20 p-4 scroll-scale-in" style={{ animationDelay: "200ms" }}>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Image Gallery */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4 scroll-fade-in">
            Jinsi MedFlow Inavyofanya Kazi
          </h2>
          <p className="text-muted-foreground text-center mb-12 scroll-fade-in" style={{ animationDelay: "100ms" }}>
            Taratibu rahisi za kusimamia afya yenye uzuri
          </p>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: "/1.png", title: "Kuona Wagonjwa", desc: "Tikiliza ukutani wa wagonjwa wako kwa haraka" },
              { img: "/2.png", title: "Kufuatilia Vitals", desc: "Weka kumbuka vitals kila saa na tikeleza arifa" },
              { img: "/3.png", title: "Kupeana Maamuzi", desc: "Fanya maamuzi ya uce kwa data-driven insights" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl frosted-glass border border-white/20 overflow-hidden scroll-scale-in hover-lift transition-all shadow-soft group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden bg-muted/50 relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Phone Mockup */}
      <section className="py-20 px-5 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 rounded-3xl" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Phone Mockup */}
            <div className="flex justify-center scroll-slide-left" style={{ animationDelay: "100ms" }}>
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-64 bg-black rounded-3xl border-8 border-black shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-20" />
                  {/* Screen */}
                  <div className="aspect-video bg-gradient-soft relative overflow-hidden">
                    <img
                      src="/1.png"
                      alt="App Preview"
                      className="w-full h-full object-cover animate-pulse"
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-info/20 opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                {/* Glow halo */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-info/30 rounded-3xl blur-2xl -z-10 animate-pulse" />
              </div>
            </div>

            {/* Right: Features */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground scroll-fade-in">
                Sifa za MedFlow
              </h2>

              {[
                {
                  icon: Users,
                  title: "Usimamizi wa Wagonjwa",
                  desc: "Tikiliza ukutani wa wagonjwa kulikofaa, kila mtu anapokuteleza vizuri"
                },
                {
                  icon: BarChart3,
                  title: "Analytics & Trends",
                  desc: "Mchoro wa vitals kwa saa, siku, na mwezi - soma patterns haraka"
                },
                {
                  icon: Bell,
                  title: "Arifa za Haraka",
                  desc: "Pata arifa haraka wakati vitals vinaporejea vizuri au kama jambo kubwa"
                },
                {
                  icon: Shield,
                  title: "Usalama wa Data",
                  desc: "Wacha data yako salama na kuendelea kwa HIPAA standards"
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex gap-4 scroll-slide-right"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4 scroll-fade-in">
            Mipango Rahisi
          </h2>
          <p className="text-muted-foreground text-center mb-12 scroll-fade-in" style={{ animationDelay: "100ms" }}>
            Chagua mipango inayofaa kwa hospitali yako
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Mwanzo", price: "Bure", features: ["Hadi 50 wagonjwa", "Analytics za msingi", "Email support"] },
              { name: "Pro", price: "$99", features: ["Hadi 500 wagonjwa", "Advanced analytics", "Priority support", "Custom branding"], highlight: true },
              { name: "Enterprise", price: "Custom", features: ["Unlimited wagonjwa", "API access", "24/7 support", "On-premise option"] },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl scroll-scale-in transition-all ${
                  plan.highlight
                    ? "frosted-glass border-2 border-primary bg-primary/5 shadow-floating"
                    : "frosted-glass border border-white/20 shadow-soft"
                } p-6 hover-lift`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-foreground mb-4">
                  {plan.price}
                  {plan.price !== "Custom" && plan.price !== "Bure" && <span className="text-lg text-muted-foreground">/mwezi</span>}
                </div>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant={plan.highlight ? "default" : "outline"} className="w-full rounded-lg">
                  Jaribu Sasa
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl" />
        <div className="relative max-w-4xl mx-auto text-center scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kuanza na MedFlow Leo
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Jisajili bure na kuanza kusimamia wagonjwa wako kwa njia nzuri sana
          </p>
          <Link to="/login">
            <Button size="lg" className="rounded-xl h-12 px-8 text-base">
              Jaribu Bure - Waliko Akaunti
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">MedFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">Jibu bora la kusimamia afya</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Kuhusu</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">Habari</a></li>
              <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Fanya</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">Hati</a></li>
              <li><a href="#" className="hover:text-foreground transition">Docs</a></li>
              <li><a href="#" className="hover:text-foreground transition">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Kusongeana</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-foreground transition">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 MedFlow. Haki zote zimehifadhiwa.</p>
        </div>
      </footer>
    </div>
  );
}
