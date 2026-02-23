import { usePage } from "@inertiajs/react";

export function UserInfo() {
  const page = usePage();
  const user: any = (page.props as any)?.auth?.user ?? null;

  // ✅ Guest fallback (no login)
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="leading-tight">
          <div className="text-sm font-semibold">Pet Registration Management</div>
          <div className="text-xs text-gray-500">Walk-in system</div>
        </div>
      </div>
    );
  }

  // ✅ Normal mode (if login is enabled later)
  return (
    <div className="flex items-center gap-3">
      <img
        src={user?.avatar ?? "https://via.placeholder.com/40"}
        alt="avatar"
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="leading-tight">
        <div className="text-sm font-semibold">{user?.name ?? "User"}</div>
        <div className="text-xs text-gray-500">{user?.email ?? ""}</div>
      </div>
    </div>
  );
}

export default UserInfo;
