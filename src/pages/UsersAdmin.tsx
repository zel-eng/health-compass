import { Badge } from "@/components/ui/badge";

const users = [
  { name: "Dr. Sarah Smith", email: "sarah@medflow.com", role: "Admin", active: true },
  { name: "Dr. James Wilson", email: "james@medflow.com", role: "Doctor", active: true },
  { name: "Nurse Amy Brown", email: "amy@medflow.com", role: "Nurse", active: true },
  { name: "Dr. Lisa Park", email: "lisa@medflow.com", role: "Doctor", active: false },
];

export default function UsersAdmin() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage team access</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                <td className="p-3">
                  <span className={`text-xs font-medium ${u.active ? "text-success" : "text-muted-foreground"}`}>
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
