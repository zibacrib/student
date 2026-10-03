export default function ApplicationLogo({ className = '', showText = true }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img src="/favicon.png" alt="ZibaCrib Logo" className="h-full w-auto object-contain" />
            {showText && <span className="text-xl font-black text-orange-600 tracking-tight">ZibaCrib</span>}
        </div>
    );
}
