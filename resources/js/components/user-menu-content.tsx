import { useMobileNavigation } from "@/hooks/use-mobile-navigation";

export function UserMenuContent() {
  const { close } = useMobileNavigation();

  return (
    <div className="py-1">
      <div className="px-4 py-2 text-sm text-gray-700">
        Pet Registration Management
      </div>

      <div className="border-t border-gray-200 my-1" />

      <button
        onClick={close}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Close Menu
      </button>
    </div>
  );
}
