"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, LogOut, Shield, Users, LogIn, Clock } from "lucide-react";

type ActivityLog = {
  id: string;
  action: string;
  createdAt: string;
  user: { name: string | null; email: string };
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  activityLogs: { action: string; createdAt: string }[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [userList, setUserList] = useState<UserRow[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 401) {
        router.push("/yonetim/login");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setTotalUsers(json.data.totalUsers);
        setUserList(json.data.users);
        setRecentLogs(json.data.recentLogs);
        setLastUpdate(Date.now());
      }
    } catch {
      // silently fail
    } finally {
      setUsersLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/yonetim/login");
  };

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <header className="sticky top-0 z-50 bg-[#030711]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
                <p className="text-xs text-white/40">Tresaurio Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock className="w-3.5 h-3.5" />
                {new Date(lastUpdate).toLocaleTimeString("tr-TR")}
              </div>

              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Users</h2>
            {totalUsers !== null && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                {totalUsers} total
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 text-sm font-medium text-white/60">
                Registered Users
              </div>
              <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                {usersLoading && userList.length === 0 && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">Loading...</div>
                )}
                {!usersLoading && userList.length === 0 && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">No users yet</div>
                )}
                {userList.map((u) => {
                  const lastLog = u.activityLogs[0];
                  return (
                    <div key={u.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{u.name || u.email}</div>
                        {u.name && <div className="text-xs text-white/40">{u.email}</div>}
                        <div className="text-xs text-white/30 mt-0.5">
                          Joined {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                      {lastLog && (
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                            lastLog.action === "login"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-white/40 bg-white/5 border-white/10"
                          }`}>
                            <LogIn className="w-3 h-3" />
                            {lastLog.action}
                          </span>
                          <div className="text-xs text-white/30 mt-1">
                            {new Date(lastLog.createdAt).toLocaleString("tr-TR")}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 text-sm font-medium text-white/60">
                Recent Activity (last 50)
              </div>
              <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                {usersLoading && recentLogs.length === 0 && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">Loading...</div>
                )}
                {!usersLoading && recentLogs.length === 0 && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">No activity yet</div>
                )}
                {recentLogs.map((log) => (
                  <div key={log.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        log.action === "login" ? "bg-emerald-400" : "bg-white/30"
                      }`} />
                      <div>
                        <span className="text-sm">{log.user.name || log.user.email}</span>
                        <span className={`ml-2 text-xs ${
                          log.action === "login" ? "text-emerald-400" : "text-white/40"
                        }`}>{log.action}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/30 shrink-0">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
