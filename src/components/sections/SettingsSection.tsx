import { Moon, Bell, Shield, Info } from "lucide-react";

export function SettingsSection() {
  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-bold text-foreground scroll-fade-in">Settings</h2>

      <div className="space-y-3 mt-4">
        {[
          { icon: Bell, label: "Notifications", desc: "Manage alert preferences" },
          { icon: Moon, label: "Appearance", desc: "Theme & display options" },
          { icon: Shield, label: "Privacy", desc: "Data & security settings" },
          { icon: Info, label: "About MedFlow", desc: "Version 2.0.0" },
        ].map((item, i) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3.5 rounded-2xl frosted-glass border border-white/20 backdrop-blur-md p-4 text-left press-zoom scroll-fade-in hover-lift hover:bg-white/40 transition-all shadow-soft"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-primary/20 flex items-center justify-center shrink-0 border border-primary/20 backdrop-blur-sm">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
