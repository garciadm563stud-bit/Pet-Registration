
export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/images/final.png"
                alt="Pet Registration Logo"
                className="h-14 w-14 object-contain"
            />
            <span className="font-semibold text-lg">
                Pet Registration
            </span>
        </div>
    );
}
