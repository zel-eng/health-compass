import { useState, useRef, useEffect } from "react";
import { Heart, ArrowRight, Users, Zap, Shield, BarChart3, Bell, TrendingUp, Activity, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PhonePosition {
  rotateX: number;
  rotateY: number;
}

export default function Landing() {
  const [phonePos, setPhonePos] = useState<PhonePosition>({ rotateX: 0, rotateY: 0 });
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse follow for phone tilt and custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (!phoneContainerRef.current) return;

      const rect = phoneContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY = ((e.clientX - centerX) / rect.width) * 15;
      const rotateX = -((e.clientY - centerY) / rect.height) * 15;

      setPhonePos({ rotateX, rotateY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden selection:bg-blue-100 selection:text-slate-900">
      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-[9999] mix-blend-multiply"
        style={{
          left: `${mousePos.x - 12}px`,
          top: `${mousePos.y - 12}px`,
          transform: "translate(0, 0)",
        }}
      >
        <div className="w-3 h-3 bg-blue-500 rounded-full opacity-70 blur-sm" />
        <div className="absolute w-6 h-6 border-2 border-blue-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glassmorphic-nav border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border border-blue-400/30 shadow-glow neumorphic-button">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-900">MedFlow</span>
          </div>
          <Link to="/login">
            <Button className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-glow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              Ingia
            </Button>
          </Link>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated gradient blobs - Grey and Blue */}
        <div className="absolute top-0 -right-40 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl animate-float opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-slate-400/15 blur-3xl animate-float-slow opacity-60" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-blue-300/10 blur-3xl animate-float opacity-50" style={{ animationDelay: "3s" }} />
        
        {/* Particle effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section - Mobile First */}
      <section 
        className="relative pt-20 sm:pt-32 pb-8 sm:pb-0 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center justify-center z-10"
        style={{
          backgroundImage: `url('/1 (2).png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          animation: `zoom-in-out 6s ease-in-out infinite`,
        }}
      >
        {/* Background overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-blue-50/80 to-transparent" />
        
        <div className="w-full max-w-6xl mx-auto relative z-20">
          {/* Mobile-optimized grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-1">
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                <div className="inline-block">
                  <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-100/60 px-3 sm:px-4 py-2 rounded-full border border-blue-200/50 neumorphic-badge backdrop-blur-sm">
                    ✨ Mfumo wa Afya wa Kisasa
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900">
                    Kusimamia Afya
                    <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-slate-600 bg-clip-text text-transparent animate-gradient"> Kwa Uhakika</span>
                  </h1>
                  <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-lg">
                    MedFlow ni mfumo wa kisasa wa kusimamia wagonjwa, kufuatilia vitals, na kupeana arifa haraka katika wakati halisi.
                  </p>
                </div>

                {/* CTA Buttons - Mobile First */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full rounded-xl h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-glow transition-all duration-300 hover:shadow-xl neumorphic-button hover:-translate-y-1">
                      Jaribu Sasa
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </Button>
                  </Link>
                  <button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-white/40 text-slate-900 border border-white/60 font-semibold hover:bg-white/60 transition-all hover-lift backdrop-blur-md neumorphic-button">
                    Tazama Demo
                  </button>
                </div>

                {/* Stats Row - Mobile Friendly */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-slate-200/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">99.9%</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">5000+</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Wagonjwa</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">24/7</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Monitoring</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side is now the background image - removed container */}
          </div>
        </div>
      </section>

      {/* Features Section with Neumorphism */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12 sm:space-y-16">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6">
                Sifa za <span className="bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">MedFlow</span>
              </h2>
              <p className="text-sm sm:text-lg text-slate-600">
                Zana kamili za kusimamia wagonjwa na kudhibiti afya yao
              </p>
            </div>

            {/* Features Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: Users,
                  title: "Usimamizi wa Wagonjwa",
                  desc: "Shughuli yote ya wagonjwa katika nafasi moja",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: Activity,
                  title: "Kufuatilia Vitals",
                  desc: "Weka kumbuka vitals kila saa na tikeleza arifa",
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  icon: BarChart3,
                  title: "Data Analytics",
                  desc: "Kupata ndoto ya afya kwa data-driven insights",
                  color: "from-blue-600 to-slate-600"
                },
                {
                  icon: Bell,
                  title: "Smart Alerts",
                  desc: "Arifa za instant kwa koses zisizotaka kare",
                  color: "from-slate-600 to-blue-500"
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group animate-fade-in-up neumorphic-card"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-slate-300/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                  {/* Card */}
                  <div className="relative rounded-2xl border border-white/60 bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-xl p-4 sm:p-6 transition-all duration-300 group-hover:border-blue-300/40 group-hover:shadow-floating group-hover:-translate-y-1">
                    <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 neumorphic-icon">
                      <feature.icon className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.desc}</p>

                    {/* Hover arrow effect */}
                    <div className="mt-3 sm:mt-4 flex items-center gap-2 text-blue-600 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Jifunze zaidi
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image 2 Section - Strategic Placement */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            {/* Image */}
            <div className="relative h-56 sm:h-96 rounded-3xl overflow-hidden shadow-floating border border-white/50 animate-fade-in-up order-2 lg:order-1">
              <img
                src="/2 (2).png"
                alt="Health Features"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up order-1 lg:order-2">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                Teknolojia ya Kisasa
                <span className="block text-blue-600">kwa Matokeo Bora</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tumia zana za AI na machine learning kuchanganua data ya wagonjwa mfupi mfupi na kuboresha huduma.
              </p>
              <div className="space-y-3 sm:space-y-4 pt-2">
                {[
                  "Real-time analytics na insights",
                  "Predictive alerts kwa hatari",
                  "Cloud-based secure storage"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-slate-700 neumorphic-list">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-glow transition-all hover:shadow-xl hover:-translate-y-1 neumorphic-button">
                Jifunze Zaidi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Glassmorphism */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-white/60 bg-gradient-to-br from-blue-100/40 via-white/40 to-slate-100/40 backdrop-blur-xl overflow-hidden animate-fade-in-up glassmorphic-cta">
            {/* Background glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-slate-400/20 rounded-full blur-3xl opacity-50" />

            {/* Content */}
            <div className="relative p-8 sm:p-12 lg:p-16 text-center space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4">
                  Kuanza Leo Hivi
                </h2>
                <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
                  Jiunge na hospitali na kliniki zaidi ya 500 zinazotumaini MedFlow kwa kusimamia wagonjwa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-glow transition-all hover:shadow-xl neumorphic-button hover:-translate-y-1">
                    Jaribu Libre
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </Button>
                </Link>
                <button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-white/40 text-slate-900 border border-white/60 font-semibold hover:bg-white/60 transition-all backdrop-blur-md neumorphic-button">
                  Muhtasari wa Ubora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/40 backdrop-blur-xl z-10 py-8 sm:py-12 px-4 sm:px-6 bg-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">Bidhaa</p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">Sifa</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Ubao wa Bei</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Usalama</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">Kampeni</p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">Habari</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Kazi</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">Kisheria</p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">Sera ya Faragha</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Masharti</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">Wasiliana</p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">Support</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/40 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-600">
            <p>&copy; 2026 MedFlow. Haki zote zimehifadhiwa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
