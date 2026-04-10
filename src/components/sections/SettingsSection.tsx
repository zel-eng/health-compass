import { Moon, Bell, Shield, Info } from "lucide-react";

export function SettingsSection() {
  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-bold text-foreground scroll-fade-in">Settings</h2>

      <div className="space-y-2.5 mt-4">
        {[
          { icon: Bell, label: "Notifications", desc: "Manage alert preferences" },
          { icon: Moon, label: "Appearance", desc: "Theme & display options" },
          { icon: Shield, label: "Privacy", desc: "Data & security settings" },
          { icon: Info, label: "About MedFlow", desc: "Version 2.0.0" },
        ].map((item, i) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3.5 rounded-2xl border bg-card p-4 text-left press-zoom scroll-fade-in hover:bg-accent/50 transition-colors"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
