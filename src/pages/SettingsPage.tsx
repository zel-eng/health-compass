import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your preferences</p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-6">
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Full Name</Label>
            <Input defaultValue="Dr. Sarah Smith" className="bg-muted" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input defaultValue="sarah@medflow.com" className="bg-muted" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Critical alerts</p>
            <p className="text-xs text-muted-foreground">Get notified for high-risk patients</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Appointment reminders</p>
            <p className="text-xs text-muted-foreground">30 minutes before each appointment</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Weekly reports</p>
            <p className="text-xs text-muted-foreground">Summary every Monday morning</p>
          </div>
          <Switch />
        </div>
      </div>

      <Button>Save Changes</Button>
    </div>
  );
}
