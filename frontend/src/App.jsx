/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
    Home,
    Listings,
    Detail,
    Sell,
    Finance,
    About,
    Contact,
    AdminLogin,
    AdminDashboard
} from './pages';

// Language Context for basic localization support in navbar/footer
export const LanguageContext = createContext();

const translations = {
    en: {
        "nav-home": "Home",
        "nav-browse": "Browse",
        "nav-sell": "Sell",
        "nav-finance": "Finance",
        "nav-about": "About Us",
        "nav-contact": "Contact",
        "nav-admin": "Admin Portal",
        "lang-btn": "नेपाली",
        "footer-desc": "Redefining pre-owned luxury and reconditioned trust across Kathmandu and Nepal.",
        "footer-collection": "THE COLLECTION",
        "footer-suv": "Luxury SUVs",
        "footer-pickup": "Premium Pickups",
        "footer-ev": "Electric Vehicles",
        "footer-services": "SERVICES",
        "footer-val": "Valuation Service",
        "footer-calc": "Finance Calculator",
        "footer-sell": "Sell Your Vehicle",
        "footer-centers": "Service Centers",
        "footer-locations": "LOCATIONS",
        "footer-loc1": "Showroom: Balkhu, Kathmandu",
        "footer-loc2": "Service: Balkhu, Kathmandu",
        "footer-copyright": "© 2026 RAAZ AUTO. PRECISION ENGINEERED IN KATHMANDU."
    },
    ne: {
        "nav-home": "गृहपृष्ठ",
        "nav-browse": "खोज्नुहोस्",
        "nav-sell": "बिक्री गर्नुहोस्",
        "nav-finance": "ऋण र वित्त",
        "nav-about": "हाम्रो बारेमा",
        "nav-contact": "सम्पर्क",
        "nav-admin": "एडमिन प्यानल",
        "lang-btn": "ENGLISH",
        "footer-desc": "काठमाडौं र नेपालभरि रिकन्डिसन कार बजारमा पारदर्शिता र विश्वसनीयता कायम गर्दै।",
        "footer-collection": "सङ्कलन",
        "footer-suv": "विलासी एसयूभीहरू",
        "footer-pickup": "प्रिमियम पिकअपहरू",
        "footer-ev": "विद्युतीय सवारीहरू",
        "footer-services": "सेवाहरू",
        "footer-val": "मूल्याङ्कन सेवा",
        "footer-calc": "वित्तीय क्यालकुलेटर",
        "footer-sell": "सवारी बिक्री गर्नुहोस्",
        "footer-centers": "सेवा केन्द्रहरू",
        "footer-locations": "स्थानहरू",
        "footer-loc1": "शोरूम: बल्खु, काठमाडौं",
        "footer-loc2": "सेवा केन्द्र: बल्खु, काठमाडौं",
        "footer-copyright": "© २०२६ राज अटो। काठमाडौंमा निर्मित।"
    }
};

// Main Layout Wrapper
const AppLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lang, setLang } = React.useContext(LanguageContext);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [settings, setSettings] = useState({ facebook: '', instagram: '', tiktok: '' });

    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Error fetching settings:", err));
    }, []);

    // Hide Header/Footer for admin pages
    const isAdminPage = location.pathname.startsWith('/admin');

    const t = (key) => translations[lang][key] || key;

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'ne' : 'en');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-on-background font-sans selection:bg-primary-container selection:text-on-primary-container">
            {/* Top Navigation Bar */}
            {!isAdminPage && (
                <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/80">
                    <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
                        <div className="flex items-center gap-4">
                            <span 
                                className="material-symbols-outlined text-primary cursor-pointer lg:hidden hover:text-white transition-colors" 
                                onClick={() => setMobileNavOpen(true)}
                            >
                                menu
                            </span>
                            <Link className="flex items-center gap-2 select-none" to="/">
                                <svg className="h-10 w-auto" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="#ff571a">
                                        <path d="M190 77C191.5 73.5 193.5 70.5 196 68L202 73.5C200.5 75.5 199 77.5 198 80L190 77Z" />
                                        <path d="M201 64C203.5 61 206.5 58.5 210 56.5L215.5 63C213 64.5 210.5 66.5 208.5 69L201 64Z" />
                                        <path d="M216 52.5C219.5 50 223.5 48.5 228 47.5L232 54.5C228.5 55.5 225 56.5 222 58.5L216 52.5Z" />
                                        <path d="M234 45.5C238.5 44.5 243.5 44 248.5 44.5L250.5 52C246.5 51.5 242.5 52 238.5 52.5L234 45.5Z" />
                                        <path d="M255 45.5C260 46 265 47.5 269.5 49.5L269.5 57C265.5 55 261.5 54 257 53.5L255 45.5Z" />
                                        <path d="M276.5 51C281.5 53.5 286 57 289.5 61L287.5 68.5C284.5 65.5 281 62.5 277 60.5L276.5 51Z" />
                                        <path d="M295.5 63C299.5 67 302.5 72 305 77L301 83C299 79 296.5 75 293 71.5L295.5 63Z" />
                                    </g>
                                    <path d="M145 92C230 45 350 78 455 88C410 81 330 65 240 78C195 84.5 160 90.5 145 92Z" fill="url(#silver-grad-nav)" />
                                    <path d="M25 125C130 90 280 92 375 105C415 109 460 120 478 135C450 115 390 102 345 99C250 93 115 103 25 125Z" fill="url(#orange-grad-nav)" />
                                    <path d="M85 106C75 110 50 120 28 127C45 120 70 112 85 106Z" fill="url(#silver-grad-nav)" />
                                    <text x="95" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="900" fontStyle="italic" fill="url(#silver-text-grad-nav)" letterSpacing="1">RAAZ</text>
                                    <text x="285" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="950" fontStyle="italic" fill="url(#orange-text-grad-nav)">Auto</text>
                                    <text x="200" y="202" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" fontStyle="italic" fill="#ff571a" letterSpacing="2">Center</text>
                                    <defs>
                                        <linearGradient id="silver-grad-nav" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#b0b0b0" />
                                            <stop offset="50%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#808080" />
                                        </linearGradient>
                                        <linearGradient id="silver-text-grad-nav" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="50%" stopColor="#cccccc" />
                                            <stop offset="100%" stopColor="#8c8c8c" />
                                        </linearGradient>
                                        <linearGradient id="orange-grad-nav" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ff7c4d" />
                                            <stop offset="100%" stopColor="#ff3b30" />
                                        </linearGradient>
                                        <linearGradient id="orange-text-grad-nav" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#ff9500" />
                                            <stop offset="100%" stopColor="#ff3b30" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </Link>
                        </div>
                        <div className="hidden lg:flex gap-8 items-center">
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/">{t("nav-home")}</Link>
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/listings' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/listings">{t("nav-browse")}</Link>
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/sell' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/sell">{t("nav-sell")}</Link>
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/finance' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/finance">{t("nav-finance")}</Link>
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/about' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/about">{t("nav-about")}</Link>
                            <Link className={`font-display text-xs font-bold tracking-widest uppercase transition-colors ${location.pathname === '/contact' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} to="/contact">{t("nav-contact")}</Link>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <button 
                                onClick={toggleLanguage}
                                className="px-2.5 py-1 text-[10px] font-bold rounded border border-primary-container/40 text-primary hover:bg-primary-container hover:text-on-primary transition-all duration-300 tracking-wider select-none font-display"
                            >
                                {t("lang-btn")}
                            </button>
                            <span 
                                className="material-symbols-outlined text-primary cursor-pointer hover:text-white transition-colors" 
                                onClick={() => navigate('/listings')}
                            >
                                search
                            </span>
                            <div className="hidden lg:flex items-center gap-1 text-primary cursor-pointer hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                                <span className="font-mono text-sm font-bold select-none">+977 9851075048</span>
                            </div>
                            <a 
                                href="https://www.google.com/maps/place/Raaz+Auto+Center/@27.6854976,85.2943327,17z/data=!4m15!1m8!3m7!1s0x39eb19001b6b2985:0x101b7ca48f211c12!2sRaaz+Auto+Center!8m2!3d27.6856074!4d85.2943569!10e5!16s%2Fg%2F11y9qgl5f8!3m5!1s0x39eb19001b6b2985:0x101b7ca48f211c12!8m2!3d27.6856074!4d85.2943569!16s%2Fg%2F11y9qgl5f8?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center"
                                title="Open Showroom Map Location"
                            >
                                <span className="material-symbols-outlined text-primary cursor-pointer hover:text-white transition-colors">
                                    map
                                </span>
                            </a>
                            <Link to="/admin" className="flex items-center">
                                <span className="material-symbols-outlined text-primary cursor-pointer hover:text-white transition-colors">
                                    person
                                </span>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile Navigation Drawer */}
            {!isAdminPage && mobileNavOpen && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setMobileNavOpen(false)}
                >
                    <div 
                        className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-surface border-r border-white/5 p-6 flex flex-col justify-between shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="flex items-center gap-2 select-none">
                                    <svg className="h-8 w-auto" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g fill="#ff571a">
                                            <path d="M190 77C191.5 73.5 193.5 70.5 196 68L202 73.5C200.5 75.5 199 77.5 198 80L190 77Z" />
                                            <path d="M201 64C203.5 61 206.5 58.5 210 56.5L215.5 63C213 64.5 210.5 66.5 208.5 69L201 64Z" />
                                            <path d="M216 52.5C219.5 50 223.5 48.5 228 47.5L232 54.5C228.5 55.5 225 56.5 222 58.5L216 52.5Z" />
                                            <path d="M234 45.5C238.5 44.5 243.5 44 248.5 44.5L250.5 52C246.5 51.5 242.5 52 238.5 52.5L234 45.5Z" />
                                            <path d="M255 45.5C260 46 265 47.5 269.5 49.5L269.5 57C265.5 55 261.5 54 257 53.5L255 45.5Z" />
                                            <path d="M276.5 51C281.5 53.5 286 57 289.5 61L287.5 68.5C284.5 65.5 281 62.5 277 60.5L276.5 51Z" />
                                            <path d="M295.5 63C299.5 67 302.5 72 305 77L301 83C299 79 296.5 75 293 71.5L295.5 63Z" />
                                        </g>
                                        <path d="M145 92C230 45 350 78 455 88C410 81 330 65 240 78C195 84.5 160 90.5 145 92Z" fill="url(#silver-grad-mob)" />
                                        <path d="M25 125C130 90 280 92 375 105C415 109 460 120 478 135C450 115 390 102 345 99C250 93 115 103 25 125Z" fill="url(#orange-grad-mob)" />
                                        <path d="M85 106C75 110 50 120 28 127C45 120 70 112 85 106Z" fill="url(#silver-grad-mob)" />
                                        <text x="95" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="900" fontStyle="italic" fill="url(#silver-text-grad-mob)" letterSpacing="1">RAAZ</text>
                                        <text x="285" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="950" fontStyle="italic" fill="url(#orange-text-grad-mob)">Auto</text>
                                        <text x="200" y="202" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" fontStyle="italic" fill="#ff571a" letterSpacing="2">Center</text>
                                        <defs>
                                            <linearGradient id="silver-grad-mob" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#b0b0b0" />
                                                <stop offset="50%" stopColor="#ffffff" />
                                                <stop offset="100%" stopColor="#808080" />
                                            </linearGradient>
                                            <linearGradient id="silver-text-grad-mob" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#ffffff" />
                                                <stop offset="50%" stopColor="#cccccc" />
                                                <stop offset="100%" stopColor="#8c8c8c" />
                                            </linearGradient>
                                            <linearGradient id="orange-grad-mob" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ff7c4d" />
                                                <stop offset="100%" stopColor="#ff3b30" />
                                            </linearGradient>
                                            <linearGradient id="orange-text-grad-mob" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#ff9500" />
                                                <stop offset="100%" stopColor="#ff3b30" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                                <span className="material-symbols-outlined text-primary cursor-pointer hover:text-white" onClick={() => setMobileNavOpen(false)}>close</span>
                            </div>
                            <div className="flex flex-col gap-5">
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/" onClick={() => setMobileNavOpen(false)}>{t("nav-home")}</Link>
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/listings" onClick={() => setMobileNavOpen(false)}>{t("nav-browse")}</Link>
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/sell" onClick={() => setMobileNavOpen(false)}>{t("nav-sell")}</Link>
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/finance" onClick={() => setMobileNavOpen(false)}>{t("nav-finance")}</Link>
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/about" onClick={() => setMobileNavOpen(false)}>{t("nav-about")}</Link>
                                <Link className="font-display text-sm font-bold tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/contact" onClick={() => setMobileNavOpen(false)}>{t("nav-contact")}</Link>
                            </div>
                        </div>
                        <div className="border-t border-white/5 pt-6 flex items-center gap-4 text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary">support_agent</span>
                            <div>
                                <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Kathmandu Showroom</p>
                                <p className="text-sm font-bold text-white font-mono">+977 9851075048</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Body Content */}
            <div className={isAdminPage ? "flex-1" : "flex-1 pt-20"}>
                {children}
            </div>

            {/* Footer */}
            {!isAdminPage && (
                <footer className="bg-surface border-t border-white/5 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="space-y-6">
                            <Link className="flex items-center gap-2 select-none" to="/">
                                <svg className="h-10 w-auto" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="#ff571a">
                                        <path d="M190 77C191.5 73.5 193.5 70.5 196 68L202 73.5C200.5 75.5 199 77.5 198 80L190 77Z" />
                                        <path d="M201 64C203.5 61 206.5 58.5 210 56.5L215.5 63C213 64.5 210.5 66.5 208.5 69L201 64Z" />
                                        <path d="M216 52.5C219.5 50 223.5 48.5 228 47.5L232 54.5C228.5 55.5 225 56.5 222 58.5L216 52.5Z" />
                                        <path d="M234 45.5C238.5 44.5 243.5 44 248.5 44.5L250.5 52C246.5 51.5 242.5 52 238.5 52.5L234 45.5Z" />
                                        <path d="M255 45.5C260 46 265 47.5 269.5 49.5L269.5 57C265.5 55 261.5 54 257 53.5L255 45.5Z" />
                                        <path d="M276.5 51C281.5 53.5 286 57 289.5 61L287.5 68.5C284.5 65.5 281 62.5 277 60.5L276.5 51Z" />
                                        <path d="M295.5 63C299.5 67 302.5 72 305 77L301 83C299 79 296.5 75 293 71.5L295.5 63Z" />
                                    </g>
                                    <path d="M145 92C230 45 350 78 455 88C410 81 330 65 240 78C195 84.5 160 90.5 145 92Z" fill="url(#silver-grad-nav)" />
                                    <path d="M25 125C130 90 280 92 375 105C415 109 460 120 478 135C450 115 390 102 345 99C250 93 115 103 25 125Z" fill="url(#orange-grad-nav)" />
                                    <path d="M85 106C75 110 50 120 28 127C45 120 70 112 85 106Z" fill="url(#silver-grad-nav)" />
                                    <text x="95" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="900" fontStyle="italic" fill="url(#silver-text-grad-nav)" letterSpacing="1">RAAZ</text>
                                    <text x="285" y="165" fontFamily="Montserrat, sans-serif" fontSize="52" fontWeight="950" fontStyle="italic" fill="url(#orange-text-grad-nav)">Auto</text>
                                    <text x="200" y="202" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" fontStyle="italic" fill="#ff571a" letterSpacing="2">Center</text>
                                </svg>
                            </Link>
                            <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
                                {t("footer-desc")}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-display text-xs font-bold text-white tracking-widest uppercase">{t("footer-collection")}</h4>
                            <ul className="space-y-2 text-xs text-on-surface-variant">
                                <li><Link to="/listings?category=SUV" className="hover:text-primary transition-colors">{t("footer-suv")}</Link></li>
                                <li><Link to="/listings?category=Pickup" className="hover:text-primary transition-colors">{t("footer-pickup")}</Link></li>
                                <li><Link to="/listings?category=EV" className="hover:text-primary transition-colors">{t("footer-ev")}</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-display text-xs font-bold text-white tracking-widest uppercase">{t("footer-services")}</h4>
                            <ul className="space-y-2 text-xs text-on-surface-variant">
                                <li><Link to="/sell" className="hover:text-primary transition-colors">{t("footer-val")}</Link></li>
                                <li><Link to="/finance" className="hover:text-primary transition-colors">{t("footer-calc")}</Link></li>
                                <li><Link to="/sell" className="hover:text-primary transition-colors">{t("footer-sell")}</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-display text-xs font-bold text-white tracking-widest uppercase">{t("footer-locations")}</h4>
                            <ul className="space-y-2 text-xs text-on-surface-variant">
                                <li>
                                    <a 
                                        href="https://www.google.com/maps/place/Raaz+Auto+Center/@27.6854976,85.2943327,17z/data=!4m15!1m8!3m7!1s0x39eb19001b6b2985:0x101b7ca48f211c12!2sRaaz+Auto+Center!8m2!3d27.6856074!4d85.2943569!10e5!16s%2Fg%2F11y9qgl5f8!3m5!1s0x39eb19001b6b2985:0x101b7ca48f211c12!8m2!3d27.6856074!4d85.2943569!16s%2Fg%2F11y9qgl5f8?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:text-primary transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">pin_drop</span> {t("footer-loc1")}
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://www.google.com/maps/place/Raaz+Auto+Center/@27.6854976,85.2943327,17z/data=!4m15!1m8!3m7!1s0x39eb19001b6b2985:0x101b7ca48f211c12!2sRaaz+Auto+Center!8m2!3d27.6856074!4d85.2943569!10e5!16s%2Fg%2F11y9qgl5f8!3m5!1s0x39eb19001b6b2985:0x101b7ca48f211c12!8m2!3d27.6856074!4d85.2943569!16s%2Fg%2F11y9qgl5f8?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:text-primary transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">build</span> {t("footer-loc2")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">
                        <span>{t("footer-copyright")}</span>
                        <div className="flex gap-6">
                            {settings.facebook && (
                                <a className="hover:text-white transition-colors flex items-center justify-center p-1" href={settings.facebook} target="_blank" rel="noreferrer" title="Facebook">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                                    </svg>
                                </a>
                            )}
                            {settings.instagram && (
                                <a className="hover:text-white transition-colors flex items-center justify-center p-1" href={settings.instagram} target="_blank" rel="noreferrer" title="Instagram">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6-9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                                    </svg>
                                </a>
                            )}
                            {settings.tiktok && (
                                <a className="hover:text-white transition-colors flex items-center justify-center p-1" href={settings.tiktok} target="_blank" rel="noreferrer" title="TikTok">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </footer>
            )}

            {/* WhatsApp Floating Button */}
            {!isAdminPage && (
                <a 
                    href={`https://wa.me/9779851075048?text=${encodeURIComponent('Hello RAAZ Auto Center, I have an inquiry.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1da851] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce-subtle"
                    title="Chat on WhatsApp"
                >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.3c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.3l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.1-186.6 184.1zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6 2.1-3.2 7.6-14.1 2.7-5.5 1.4-10.4-1.4-15.8-2.8-5.6-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                </a>
            )}
        </div>
    );
};

function App() {
    const [lang, setLang] = useState('en');

    return (
        <AuthProvider>
            <LanguageContext.Provider value={{ lang, setLang }}>
                <BrowserRouter>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/listings" element={<Listings />} />
                            <Route path="/detail/:id" element={<Detail />} />
                            <Route path="/sell" element={<Sell />} />
                            <Route path="/finance" element={<Finance />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            {/* Fallback to homepage */}
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </AppLayout>
                </BrowserRouter>
            </LanguageContext.Provider>
        </AuthProvider>
    );
}

export default App;
