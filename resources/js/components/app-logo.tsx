
export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/images/logo.png"
                alt="Pet Registration Logo"
                className="h-10 w-10 object-contain"
            />
            <span className="font-semibold text-lg">
                PetRegistry
            </span>
        </div>
    );
}
