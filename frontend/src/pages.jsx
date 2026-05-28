import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Helper for currency formatting in lakhs/crores
const formatNPR = (num) => {
    if (!num) return "Rs. 0";
    let str = String(num);
    let lastThree = str.substring(str.length - 3);
    let otherParts = str.substring(0, str.length - 3);
    if (otherParts !== '') {
        lastThree = ',' + lastThree;
    }
    let res = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return "Rs. " + res;
};

// ==============================================
// 1. HOMEPAGE PAGE
// ==============================================
export const Home = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [searchParams, setSearchParams] = useState({
        brand: '',
        category: '',
        fuel: ''
    });

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => setVehicles(data.filter(v => v.featured)));
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const queries = [];
        if (searchParams.brand) queries.push(`brand=${searchParams.brand}`);
        if (searchParams.category) queries.push(`category=${searchParams.category}`);
        if (searchParams.fuel) queries.push(`fuel=${searchParams.fuel}`);
        navigate(`/listings?${queries.join('&')}`);
    };

    return (
        <div class="space-y-16 page-view">
            {/* Cinematic Hero */}
            <section class="relative min-h-[90vh] flex items-center justify-start overflow-hidden">
                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-10"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                    <img alt="Hero Banner SUV" class="w-full h-full object-cover object-center scale-105" src="/raaz_showroom_hero.jpg"/>
                </div>
                
                <div class="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
                    <div class="max-w-2xl mt-12 md:mt-0">
                        <div class="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-bold tracking-widest px-3.5 py-1.5 rounded-full mb-6 font-display uppercase">
                            <span class="relative flex h-2 w-2">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                            </span>
                            Kathmandu Premier
                        </div>
                        <h1 class="font-display text-4xl md:text-6xl font-extrabold leading-tight text-white mb-6">
                            Find Trusted <span class="text-primary-container text-glow">Reconditioned</span> Vehicles
                        </h1>
                        <p class="font-sans text-base md:text-lg text-on-surface-variant mb-10 border-l-4 border-primary-container pl-5 max-w-xl">
                            Drive your dream with complete peace of mind. Every vehicle at Raaz Auto Center Balkhu passes a certified 150-point inspection and carries an ironclad mechanical warranty.
                        </p>
                        
                        <form onSubmit={handleSearchSubmit} class="glass-panel p-5 rounded-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row gap-4">
                            <div class="flex-1">
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select Brand</label>
                                <select 
                                    value={searchParams.brand}
                                    onChange={e => setSearchParams({...searchParams, brand: e.target.value})}
                                    class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                                >
                                    <option value="">All Brands</option>
                                    <option value="Hyundai">Hyundai</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Tesla">Tesla</option>
                                    <option value="Suzuki">Suzuki</option>
                                </select>
                            </div>
                            <div class="flex-1">
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
                                <select 
                                    value={searchParams.category}
                                    onChange={e => setSearchParams({...searchParams, category: e.target.value})}
                                    class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                                >
                                    <option value="">All Categories</option>
                                    <option value="SUV">SUV</option>
                                    <option value="EV">EV</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                            </div>
                            <div class="flex-1">
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fuel Type</label>
                                <select 
                                    value={searchParams.fuel}
                                    onChange={e => setSearchParams({...searchParams, fuel: e.target.value})}
                                    class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                                >
                                    <option value="">All Fuels</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <button type="submit" class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold px-6 py-3.5 rounded-xl uppercase tracking-widest transition-all self-end w-full md:w-auto shadow-lg shadow-primary-container/20">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section class="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div class="text-center mb-12">
                    <span class="text-[10px] font-bold text-primary-container tracking-widest uppercase font-display">Featured Inventory</span>
                    <h2 class="font-display text-2xl md:text-3xl font-extrabold text-white mt-2">Premium Showroom Arrivals</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {vehicles.map(car => (
                        <div key={car.id} class="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 group shadow-lg">
                            <div class="h-48 overflow-hidden relative">
                                <img src={(car.images && car.images[0]) || car.img} alt={car.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span class="absolute top-4 left-4 bg-primary-container text-white text-[8px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">{car.category}</span>
                            </div>
                            <div class="p-6 space-y-4">
                                <div>
                                    <h3 class="font-display text-base font-bold text-white leading-tight">{car.year} {car.brand} {car.name}</h3>
                                    <p class="text-[10px] text-on-surface-variant font-mono mt-1">{car.km.toLocaleString()} KM &bull; {car.fuel} &bull; {car.transmission}</p>
                                </div>
                                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span class="text-primary-container font-mono font-bold text-sm">{formatNPR(car.price)}</span>
                                    <Link to={`/detail/${car.id}`} class="text-[9px] font-display font-bold tracking-widest text-white border border-white/10 hover:border-primary-container hover:text-primary-container px-3.5 py-2 rounded-lg uppercase transition-all">Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div class="text-center mt-12">
                    <Link to="/listings" class="bg-surface border border-white/5 hover:border-white/10 text-white font-display text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-all inline-block shadow-lg">Browse Full Inventory</Link>
                </div>
            </section>
        </div>
    );
};


// ==============================================
// 2. VEHICLE LISTINGS & COMPARISON PAGE
// ==============================================
export const Listings = () => {
    const [searchParams] = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Active filters
    const [filterBrand, setFilterBrand] = useState(searchParams.get('brand') || '');
    const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
    const [filterFuel, setFilterFuel] = useState(searchParams.get('fuel') || '');
    const [filterSearch, setFilterSearch] = useState('');
    const [sortRule, setSortRule] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');

    // Comparison Queue (Max 3)
    const [compareQueue, setCompareQueue] = useState([]);
    const [compareModalOpen, setCompareModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => {
                setVehicles(data);
                setFiltered(data);
                
                // Extract unique filters
                setBrands([...new Set(data.map(v => v.brand))]);
                setCategories([...new Set(data.map(v => v.category))]);
            });
    }, []);

    // Filter Trigger
    useEffect(() => {
        let list = [...vehicles];
        if (filterBrand) {
            list = list.filter(v => v.brand === filterBrand);
        }
        if (filterCategory) {
            list = list.filter(v => v.category === filterCategory);
        }
        if (filterFuel) {
            list = list.filter(v => v.fuel === filterFuel);
        }
        if (filterSearch) {
            const query = filterSearch.toLowerCase();
            list = list.filter(v => v.brand.toLowerCase().includes(query) || v.name.toLowerCase().includes(query));
        }

        // Sorting
        if (sortRule === 'price-asc') list.sort((a,b) => a.price - b.price);
        else if (sortRule === 'price-desc') list.sort((a,b) => b.price - a.price);
        else if (sortRule === 'year-desc') list.sort((a,b) => b.year - a.year);
        else list.sort((a,b) => b.id - a.id); // default newest ID

        setFiltered(list);
    }, [filterBrand, filterCategory, filterFuel, filterSearch, sortRule, vehicles]);

    const toggleCompare = (id) => {
        if (compareQueue.includes(id)) {
            setCompareQueue(compareQueue.filter(qid => qid !== id));
        } else {
            if (compareQueue.length >= 3) {
                alert("Comparison queue limited to 3 vehicles max.");
                return;
            }
            setCompareQueue([...compareQueue, id]);
        }
    };

    const getComparedVehicles = () => {
        return vehicles.filter(v => compareQueue.includes(v.id));
    };

    return (
        <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8 page-view">
            <div>
                <h1 class="font-display text-2xl font-extrabold text-white uppercase tracking-wide">Vehicle Listings Catalog</h1>
                <p class="text-xs text-on-surface-variant">Find certified reconditioned SUVs, Pickups, and EVs in Kathmandu</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar filters */}
                <div class="glass-panel p-6 rounded-2xl border border-white/5 h-fit space-y-6">
                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Search Filters</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Search Input</label>
                            <input 
                                type="text"
                                value={filterSearch}
                                onChange={e => setFilterSearch(e.target.value)}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus"
                                placeholder="Search models..."
                            />
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Brand</label>
                            <select 
                                value={filterBrand} 
                                onChange={e => setFilterBrand(e.target.value)}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus"
                            >
                                <option value="">All Brands</option>
                                {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
                            <select 
                                value={filterCategory} 
                                onChange={e => setFilterCategory(e.target.value)}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fuel Type</label>
                            <select 
                                value={filterFuel} 
                                onChange={e => setFilterFuel(e.target.value)}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus"
                            >
                                <option value="">All Fuels</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setFilterBrand(''); setFilterCategory(''); setFilterFuel(''); setFilterSearch(''); }} 
                        class="w-full bg-surface-container hover:bg-white/[0.03] text-on-surface text-xs font-semibold py-2.5 rounded-lg border border-white/5 uppercase font-display select-none tracking-widest text-[9px]"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Listing grid */}
                <div class="lg:col-span-3 space-y-6">
                    {/* Header controls */}
                    <div class="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4 select-none">
                        <div class="flex items-center gap-2">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                class={`p-1.5 rounded-lg border transition-colors ${viewMode==='grid'?'bg-primary-container text-white border-primary-container':'border-white/5 text-on-surface-variant hover:text-white'}`}
                            >
                                <span class="material-symbols-outlined text-sm block">grid_view</span>
                            </button>
                            <button 
                                onClick={() => setViewMode('list')} 
                                class={`p-1.5 rounded-lg border transition-colors ${viewMode==='list'?'bg-primary-container text-white border-primary-container':'border-white/5 text-on-surface-variant hover:text-white'}`}
                            >
                                <span class="material-symbols-outlined text-sm block">list</span>
                            </button>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                            <span>Sort:</span>
                            <select 
                                value={sortRule} 
                                onChange={e => setSortRule(e.target.value)}
                                class="bg-surface border border-white/5 rounded px-2.5 py-1.5 text-xs text-white border-glow-focus"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="year-desc">Year: Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Catalog list */}
                    {filtered.length === 0 ? (
                        <div class="glass-panel p-12 text-center text-on-surface-variant rounded-2xl border border-white/5">No vehicles match filter choices.</div>
                    ) : (
                        <div class={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                            {filtered.map(car => {
                                const inQueue = compareQueue.includes(car.id);
                                return (
                                    <div key={car.id} class={`glass-panel rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-white/10 flex ${viewMode==='list'?'flex-row items-center gap-6':'flex-col'}`}>
                                        <div class={`${viewMode==='list'?'h-32 w-48 shrink-0':'h-44'} overflow-hidden relative bg-background`}>
                                            <img src={(car.images && car.images[0]) || car.img} alt={car.name} class="w-full h-full object-cover" />
                                            <span class="absolute top-3 left-3 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[8px] font-bold tracking-widest px-2 py-0.5 rounded uppercase">{car.category}</span>
                                        </div>
                                        <div class="p-5 flex-1 space-y-4">
                                            <div class="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 class="font-display text-sm font-bold text-white leading-tight">{car.year} {car.brand} {car.name}</h3>
                                                    <p class="text-[9px] text-on-surface-variant font-mono mt-0.5">{car.km.toLocaleString()} KM &bull; {car.fuel} &bull; {car.transmission}</p>
                                                </div>
                                                <div class="flex items-center gap-1">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`compare-${car.id}`}
                                                        checked={inQueue} 
                                                        onChange={() => toggleCompare(car.id)}
                                                        class="accent-primary-container h-3.5 w-3.5 rounded bg-surface border border-white/5"
                                                    />
                                                    <label htmlFor={`compare-${car.id}`} class="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase cursor-pointer select-none">Compare</label>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center pt-3 border-t border-white/5 select-none">
                                                <span class="text-primary-container font-mono font-bold text-xs">{formatNPR(car.price)}</span>
                                                <Link to={`/detail/${car.id}`} class="text-[9px] font-display font-bold tracking-widest text-white border border-white/10 hover:border-primary-container hover:text-primary-container px-3 py-1.5 rounded uppercase transition-all">Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Comparison Overlay Queue */}
            {compareQueue.length > 0 && (
                <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-6 max-w-2xl w-[90%] select-none animate-[fadeIn_0.2s_ease-out]">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary text-base">compare</span>
                        <div>
                            <p class="text-[10px] font-bold text-white font-display uppercase tracking-wider">Compare Queue</p>
                            <p class="text-[9px] text-on-surface-variant mt-0.5">{compareQueue.length} of 3 vehicles selected</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onClick={() => setCompareQueue([])} class="text-[9px] text-on-surface-variant hover:text-white font-bold uppercase">Reset</button>
                        <button onClick={() => setCompareModalOpen(true)} class="bg-primary-container hover:bg-opacity-95 text-white px-3.5 py-1.5 rounded-lg font-display text-[9px] font-bold tracking-widest uppercase">Compare Now</button>
                    </div>
                </div>
            )}

            {/* Comparison Table Modal */}
            {compareModalOpen && (
                <div class="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div class="glass-panel w-full max-w-4xl rounded-2xl p-6 border border-white/5 relative shadow-2xl max-h-[85vh] overflow-y-auto">
                        <button onClick={() => setCompareModalOpen(false)} class="absolute top-4 right-4 text-on-surface-variant hover:text-white">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                        
                        <h3 class="font-display text-lg font-extrabold text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
                            <span class="material-symbols-outlined">compare</span> Side-by-Side Comparison
                        </h3>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse text-xs select-none">
                                <tbody class="divide-y divide-white/5 text-on-surface">
                                    <tr class="bg-surface-container">
                                        <td class="p-3 font-bold text-white uppercase text-[9px]">Car models</td>
                                        {getComparedVehicles().map(c => (
                                            <td key={c.id} class="p-3 text-center">
                                                <img src={c.img} alt={c.name} class="h-16 mx-auto object-cover rounded border border-white/5 bg-background mb-2" />
                                                <p class="font-bold text-white">{c.year} {c.brand} {c.name}</p>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Price (NPR)</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-primary font-bold font-mono">{formatNPR(c.price)}</td>)}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Category</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-white font-semibold uppercase text-[9px]">{c.category}</td>)}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Engine Spec</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-white">{c.specs.engine}</td>)}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Power / Torque</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-on-surface-variant">{c.specs.power} / {c.specs.torque}</td>)}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Gearbox / Fuel</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-white">{c.transmission} &bull; {c.fuel}</td>)}
                                    </tr>
                                    <tr>
                                        <td class="p-3 font-bold text-on-surface-variant">Ground Clearance</td>
                                        {getComparedVehicles().map(c => <td key={c.id} class="p-3 text-center text-on-surface-variant font-mono">{c.specs.groundClearance}</td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// ==============================================
// 3. VEHICLE DETAIL AUDIT & APPOINTMENT PAGE
// ==============================================
export const Detail = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', date: '' });
    const [settings, setSettings] = useState({ whatsapp: '9851075048' });
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        fetch(`/api/vehicles/${id}`)
            .then(res => res.json())
            .then(data => setVehicle(data));
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data));
    }, [id]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const bookingData = {
            name: formData.name,
            phone: formData.phone,
            type: "Test Drive",
            target: `${vehicle.year} ${vehicle.brand} ${vehicle.name}`,
            details: `Date: ${formData.date}`,
            email: "client@raazauto.com"
        };

        fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        })
        .then(res => res.json())
        .then(() => {
            alert(`Test drive requested for ${vehicle.brand} ${vehicle.name}. Redirecting you to WhatsApp to coordinate slot confirmation...`);
            const cleanWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '9851075048';
            const whatsappNum = cleanWhatsapp.startsWith('977') ? cleanWhatsapp : `977${cleanWhatsapp}`;
            const message = encodeURIComponent(`Hello RAAZ Auto Center, I would like to request a Test Drive slot.\n- Name: ${formData.name}\n- Phone: ${formData.phone}\n- Vehicle: ${vehicle.year} ${vehicle.brand} ${vehicle.name}\n- Preferred Date: ${formData.date}`);
            window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
            setFormData({ name: '', phone: '', date: '' });
        });
    };

    if (!vehicle) return <div class="p-12 text-center text-on-surface-variant">Loading showroom specifications...</div>;

    const cleanWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '9851075048';
    const whatsappNum = cleanWhatsapp.startsWith('977') ? cleanWhatsapp : `977${cleanWhatsapp}`;
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hello%20RAAZ%20Auto,%20I%20am%20interested%20in%20the%20${vehicle.year}%20${vehicle.brand}%20${vehicle.name}%20priced%20at%20${formatNPR(vehicle.price)}`;

    // Build gallery from images array or fallback to single img
    const galleryImages = (vehicle.images && vehicle.images.length > 0) ? vehicle.images : (vehicle.img ? [vehicle.img] : []);

    return (
        <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 page-view">
            {/* Gallery and specs */}
            <div class="lg:col-span-2 space-y-8">
                {/* Main Image */}
                <div class="h-96 rounded-2xl overflow-hidden border border-white/5 bg-background relative shadow-xl">
                    <img src={galleryImages[activeImg] || galleryImages[0]} alt={vehicle.name} class="w-full h-full object-cover transition-all duration-500" />
                    <span class="absolute top-4 left-4 bg-primary-container text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-display">{vehicle.category}</span>
                    {galleryImages.length > 1 && (
                        <div class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full font-mono">
                            {activeImg + 1} / {galleryImages.length}
                        </div>
                    )}
                </div>
                
                {/* Thumbnail Strip */}
                {galleryImages.length > 1 && (
                    <div class="flex gap-3">
                        {galleryImages.map((imgSrc, idx) => (
                            <button 
                                key={idx} 
                                type="button"
                                onClick={() => setActiveImg(idx)}
                                class={`h-20 w-28 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                                    activeImg === idx 
                                        ? 'border-primary-container shadow-lg shadow-primary-container/20 scale-105' 
                                        : 'border-white/5 hover:border-white/20 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={imgSrc} alt={`${vehicle.name} view ${idx + 1}`} class="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h2 class="font-display text-xl font-bold text-white uppercase tracking-wider">{vehicle.year} {vehicle.brand} {vehicle.name}</h2>
                    <p class="text-xs text-on-surface-variant leading-relaxed">
                        Every vehicle sold at RAAZ AUTO goes through an extensive certified check. This premium vehicle is equipped with high-grade components and is listed in clean showroom condition.
                    </p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5 select-none text-xs">
                        <div class="p-3.5 bg-surface border border-white/5 rounded-lg text-center">
                            <span class="text-on-surface-variant font-medium uppercase text-[9px] tracking-wider">Price</span>
                            <p class="text-primary font-bold font-mono mt-1 text-sm">{formatNPR(vehicle.price)}</p>
                        </div>
                        <div class="p-3.5 bg-surface border border-white/5 rounded-lg text-center">
                            <span class="text-on-surface-variant font-medium uppercase text-[9px] tracking-wider">Engine Size</span>
                            <p class="text-white font-bold mt-1">{vehicle.specs.engine}</p>
                        </div>
                        <div class="p-3.5 bg-surface border border-white/5 rounded-lg text-center">
                            <span class="text-on-surface-variant font-medium uppercase text-[9px] tracking-wider">Gearbox</span>
                            <p class="text-white font-bold mt-1">{vehicle.transmission}</p>
                        </div>
                        <div class="p-3.5 bg-surface border border-white/5 rounded-lg text-center">
                            <span class="text-on-surface-variant font-medium uppercase text-[9px] tracking-wider">Ground Clearance</span>
                            <p class="text-white font-mono mt-1 font-semibold">{vehicle.specs.groundClearance}</p>
                        </div>
                    </div>
                </div>

                <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 select-none">
                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Premium Feature Set</h3>
                    <div class="grid grid-cols-2 gap-3.5 text-xs text-on-surface-variant">
                        {vehicle.features.map(f => (
                            <div key={f} class="flex items-center gap-2">
                                <span class="h-1.5 w-1.5 rounded-full bg-primary-container"></span>
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Test Drive Scheduling Form */}
            <div class="space-y-6">
                <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
                    <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Schedule Test Drive</h3>
                    <form onSubmit={handleFormSubmit} class="space-y-4">
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Name Details</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Contact Number</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                                placeholder="WhatsApp or Mobile"
                            />
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Preferred Date</label>
                            <input 
                                type="date" 
                                required
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus"
                            />
                        </div>
                        <button type="submit" class="w-full bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold py-3.5 rounded-lg tracking-widest uppercase transition-all shadow-lg shadow-primary-container/20">
                            Book Appointment
                        </button>
                    </form>
                </div>

                <div class="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-4 select-none">
                    <h4 class="font-display text-xs font-bold text-white uppercase tracking-wider">Direct WhatsApp Inquiry</h4>
                    <p class="text-xs text-on-surface-variant">Instantly discuss specs, cash pricing discount thresholds, or trade options.</p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-display text-xs font-bold py-3 rounded-lg tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg">
                        <span class="material-symbols-outlined text-sm">chat</span> Contact Sales Advisor
                    </a>
                </div>
            </div>
        </div>
    );
};


// ==============================================
// 4. SELL VEHICLE APPRAISAL PAGE
// ==============================================
export const Sell = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [requestType, setRequestType] = useState('Sell');
    const [brand, setBrand] = useState('Hyundai');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(2020);
    const [km, setKm] = useState(30000);
    const [price, setPrice] = useState(4500000);
    const [owner, setOwner] = useState('');
    const [phone, setPhone] = useState('');
    const [estimateRange, setEstimateRange] = useState('');
    const [settings, setSettings] = useState({ whatsapp: '9851075048' });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    const calculateEstimate = () => {
        let base = 5000000;
        if (brand === 'Toyota') base = 6500000;
        else if (brand === 'Suzuki') base = 3500000;
        
        // Depreciation
        const age = 2026 - parseInt(year);
        const ageFactor = Math.pow(0.88, age);
        const kmFactor = Math.max(0.7, 1 - (parseInt(km) * 0.000003));
        
        const result = Math.round(base * ageFactor * kmFactor);
        const lower = Math.round(result * 0.94);
        const upper = Math.round(result * 1.06);

        setEstimateRange(`${formatNPR(lower)} - ${formatNPR(upper)}`);
    };

    useEffect(() => {
        calculateEstimate();
    }, [brand, year, km]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const appraisalData = {
            name: owner,
            customer: owner,
            phone: phone,
            type: "Valuation",
            category: requestType === 'Exchange' ? "Exchange Request" : "Seller Appraisals",
            target: `${year} ${brand} ${model}`,
            details: `[${requestType}] Asking: ${formatNPR(price)} (Estimated: ${estimateRange})`,
            email: "appraisal@client.com"
        };

        fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appraisalData)
        })
        .then(res => res.json())
        .then(() => {
            alert(`${requestType} request submitted successfully. Redirecting you to WhatsApp for instant verification...`);
            const cleanWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '9851075048';
            const whatsappNum = cleanWhatsapp.startsWith('977') ? cleanWhatsapp : `977${cleanWhatsapp}`;
            const message = encodeURIComponent(`Hello RAAZ Auto Center, I would like to ${requestType.toLowerCase()} my vehicle.\n- Owner: ${owner}\n- Phone: ${phone}\n- Vehicle: ${year} ${brand} ${model}\n- KM Driven: ${km}\n- Asking Price: ${formatNPR(price)}\n- Estimated Value: ${estimateRange}`);
            window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
            navigate('/');
        });
    };

    return (
        <div class="max-w-2xl mx-auto px-6 py-12 space-y-8 page-view">
            <div class="text-center">
                <h1 class="font-display text-2xl font-extrabold text-white uppercase tracking-wide">Vehicle Appraisal Wizard</h1>
                <p class="text-xs text-on-surface-variant">Get an instant reconditioned valuation estimate and submit inspection tickets</p>
            </div>

            {/* Stepper Wizard Progress Indicators */}
            <div class="flex justify-between items-center max-w-sm mx-auto select-none">
                <div class={`h-8 w-8 rounded-full flex items-center justify-center font-display font-bold text-xs ${step>=1?'bg-primary-container text-white':'bg-surface border border-white/5 text-on-surface-variant'}`}>1</div>
                <div class="flex-1 h-0.5 bg-white/5 mx-2"></div>
                <div class={`h-8 w-8 rounded-full flex items-center justify-center font-display font-bold text-xs ${step>=2?'bg-primary-container text-white':'bg-surface border border-white/5 text-on-surface-variant'}`}>2</div>
                <div class="flex-1 h-0.5 bg-white/5 mx-2"></div>
                <div class={`h-8 w-8 rounded-full flex items-center justify-center font-display font-bold text-xs ${step>=3?'bg-primary-container text-white':'bg-surface border border-white/5 text-on-surface-variant'}`}>3</div>
            </div>

            <div class="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                {step === 1 && (
                    <div class="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                        <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Step 1: Vehicle Details</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Request Type</label>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer text-white">
                                        <input type="radio" name="requestType" value="Sell" checked={requestType === 'Sell'} onChange={() => setRequestType('Sell')} class="accent-primary-container h-4 w-4 bg-surface border border-white/5" />
                                        <span class="text-xs">Sell Vehicle</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer text-white">
                                        <input type="radio" name="requestType" value="Exchange" checked={requestType === 'Exchange'} onChange={() => setRequestType('Exchange')} class="accent-primary-container h-4 w-4 bg-surface border border-white/5" />
                                        <span class="text-xs">Exchange Vehicle</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Brand</label>
                                <select value={brand} onChange={e=>setBrand(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus">
                                    <option value="Hyundai">Hyundai</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Suzuki">Suzuki</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Model / Version Name</label>
                                <input type="text" required value={model} onChange={e=>setModel(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="e.g. Tucson GLX" />
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Manufacturing Year</label>
                                <select value={year} onChange={e=>setYear(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus">
                                    {[2024,2023,2022,2021,2020,2019,2018,2017,2016].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={()=>setStep(2)} disabled={!model} class="w-full bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-95 text-white font-display text-xs font-bold py-3.5 rounded-lg tracking-widest uppercase transition-all shadow-lg">Next Step</button>
                    </div>
                )}

                {step === 2 && (
                    <div class="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                        <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Step 2: Condition & Pricing</h3>
                        
                        <div class="p-4 bg-surface-container rounded-xl border border-white/5 text-center select-none">
                            <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Kathmandu Market Valuation Estimate</span>
                            <p class="text-xl font-extrabold text-white mt-1.5 font-mono">{estimateRange}</p>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Odometer KM Driven</label>
                                <input type="number" value={km} onChange={e=>setKm(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" />
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Your Expected Pricing (NPR)</label>
                                <input type="number" value={price} onChange={e=>setPrice(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" />
                            </div>
                        </div>

                        <div class="flex justify-between items-center select-none pt-4">
                            <button onClick={()=>setStep(1)} class="text-xs text-on-surface-variant hover:text-white font-bold py-2 px-4 uppercase">Back</button>
                            <button onClick={()=>setStep(3)} class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold py-3.5 px-6 rounded-lg tracking-widest uppercase transition-all shadow-lg">Next Step</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleFormSubmit} class="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                        <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Step 3: Contact Details</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Owner Name</label>
                                <input type="text" required value={owner} onChange={e=>setOwner(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="Owner full name" />
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Mobile / WhatsApp Number</label>
                                <input type="text" required value={phone} onChange={e=>setPhone(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="WhatsApp contact" />
                            </div>
                        </div>

                        <div class="flex justify-between items-center pt-4">
                            <button type="button" onClick={()=>setStep(2)} class="text-xs text-on-surface-variant hover:text-white font-bold py-2 px-4 uppercase">Back</button>
                            <button type="submit" class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold py-3.5 px-6 rounded-lg tracking-widest uppercase transition-all shadow-lg">Submit Request</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// ==============================================
// 5. FINANCE & LOAN CALCULATOR PAGE
// ==============================================
export const Finance = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    const [price, setPrice] = useState(8500000);
    const [downPercent, setDownPercent] = useState(30);
    const [tenureYears, setTenureYears] = useState(5);
    const [rate, setRate] = useState(11.5);
    const [banks] = useState([
        { name: "Nabil Bank Ltd", rate: 10.5, period: 7 },
        { name: "Global IME Bank", rate: 11.2, period: 5 },
        { name: "NIC Asia Bank", rate: 11.5, period: 7 },
        { name: "Siddhartha Bank", rate: 10.9, period: 5 }
    ]);

    const downAmount = Math.round(price * (downPercent / 100));
    const loanAmount = price - downAmount;
    
    // EMI formulas
    const monthlyRate = (rate / 12) / 100;
    const totalMonths = tenureYears * 12;
    const emi = Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1));
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Loan', 'Total Interest'],
                datasets: [{
                    data: [loanAmount, totalInterest],
                    backgroundColor: ['#ff571a', '#ffb59e'],
                    borderColor: '#12131a',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e1eb', font: { size: 10 } }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [loanAmount, totalInterest]);

    return (
        <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 page-view">
            {/* Slide calculators */}
            <div class="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 space-y-6 select-none">
                <div>
                    <h2 class="font-display text-lg font-bold text-white uppercase tracking-wider mb-1">Amortization Loan Estimator</h2>
                    <p class="text-xs text-on-surface-variant">Adjust variables to estimate down payments and installment costs in Nepal</p>
                </div>
                
                <div class="space-y-6 pt-4 border-t border-white/5">
                    <div>
                        <div class="flex justify-between text-xs font-semibold text-white mb-2">
                            <span>Vehicle Price</span>
                            <span class="font-mono text-primary">{formatNPR(price)}</span>
                        </div>
                        <input type="range" min="1500000" max="30000000" step="100000" value={price} onChange={e=>setPrice(parseInt(e.target.value))} class="w-full accent-primary-container" />
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-semibold text-white mb-2">
                            <span>Down Payment Percentage ({downPercent}%)</span>
                            <span class="font-mono text-primary">{formatNPR(downAmount)}</span>
                        </div>
                        <input type="range" min="10" max="80" step="5" value={downPercent} onChange={e=>setDownPercent(parseInt(e.target.value))} class="w-full accent-primary-container" />
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-semibold text-white mb-2">
                            <span>Tenure ({tenureYears} Years)</span>
                            <span class="font-mono text-primary">{totalMonths} Months</span>
                        </div>
                        <input type="range" min="1" max="10" step="1" value={tenureYears} onChange={e=>setTenureYears(parseInt(e.target.value))} class="w-full accent-primary-container" />
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-semibold text-white mb-2">
                            <span>Interest Rate ({rate}%)</span>
                            <span class="font-mono text-primary">Annual Base</span>
                        </div>
                        <input type="range" min="5" max="18" step="0.5" value={rate} onChange={e=>setRate(parseFloat(e.target.value))} class="w-full accent-primary-container" />
                    </div>
                </div>
            </div>

            {/* Calculations outputs & Bank lists */}
            <div class="space-y-6">
                <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider text-center select-none">Estimate Results</h3>
                    <div class="p-4 bg-surface-container rounded-xl text-center border border-white/5 select-none">
                        <span class="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Monthly Installment (EMI)</span>
                        <p class="text-2xl font-extrabold text-primary font-mono mt-1.5">{formatNPR(emi)}</p>
                    </div>
                    <div class="h-48 relative">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 select-none">
                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Partner Bank Rates</h3>
                    <div class="space-y-3.5">
                        {banks.map(b => (
                            <div key={b.name} class="p-3 bg-surface border border-white/5 rounded-lg flex items-center justify-between text-xs">
                                <div>
                                    <p class="font-bold text-white">{b.name}</p>
                                    <p class="text-[10px] text-on-surface-variant mt-0.5">Up to {b.period} Yr tenure</p>
                                </div>
                                <span class="font-mono font-bold text-primary">{b.rate}% Base</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==============================================
// 6. ABOUT US PAGE
// ==============================================
export const About = () => {
    return (
        <div class="max-w-4xl mx-auto px-6 py-12 space-y-8 page-view">
            <div class="text-center">
                <h1 class="font-display text-3xl font-extrabold text-white uppercase tracking-wider mb-2">Driving Excellence in Kathmandu</h1>
                <p class="text-xs text-on-surface-variant">The story, inspection standards, and values of RAAZ AUTO Center</p>
            </div>

            <div class="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                <div class="space-y-4 text-xs leading-relaxed text-on-surface-variant">
                    <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Our Dealership Story</h3>
                    <p>
                        RAAZ AUTO Center was founded to bring transparent processes and luxury dealership standards into the reconditioned automotive marketplace of Nepal. Buying pre-owned vehicles shouldn't represent a compromise.
                    </p>
                    <p>
                        We host a selection of premium SUV, Pickup, and high-tech EV vehicles. We have established relationships with primary commercial bank institutions, providing streamlined finance, low down payments, and fast EMI processing.
                    </p>
                </div>

                <div class="space-y-4 pt-6 border-t border-white/5 text-xs text-on-surface-variant select-none">
                    <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">The 150-Point Certified Inspection</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-surface border border-white/5 rounded-lg">
                            <h4 class="font-bold text-white mb-2 uppercase text-[10px] tracking-wider">Mechanical & Powertrain</h4>
                            <p>Rigorous diagnostics check on engine compression, cylinder walls, gearbox shifts, fluid qualities, and differentials.</p>
                        </div>
                        <div class="p-4 bg-surface border border-white/5 rounded-lg">
                            <h4 class="font-bold text-white mb-2 uppercase text-[10px] tracking-wider">Underbody Suspension</h4>
                            <p>Checking steering links, tie rods, shock amortization rates, chassis alignment, and verifying clear non-accidental title status.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==============================================
// 7. CONTACT US & BRANCH LOCATIONS PAGE
// ==============================================
export const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [msg, setMsg] = useState('');
    const [settings, setSettings] = useState({ name: 'RAAZ AUTO Center', address: 'Balkhu, Kathmandu, Nepal', phone: '+977 9851075048', email: 'info@raazauto.com', maps: '' });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const contactData = {
            name,
            customer: name,
            phone: "Contact Form",
            email: email,
            type: "WhatsApp", // Route to WhatsApp queue
            category: "Contact Messages",
            target: subject,
            details: msg
        };

        fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        })
        .then(res => res.json())
        .then(() => {
            alert("Thank you! Message submitted. Redirecting you to WhatsApp for instant customer desk reply...");
            const cleanWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '9851075048';
            const whatsappNum = cleanWhatsapp.startsWith('977') ? cleanWhatsapp : `977${cleanWhatsapp}`;
            const message = encodeURIComponent(`Hello RAAZ Auto Center, I have a client inquiry.\n- Name: ${name}\n- Email: ${email}\n- Subject: ${subject}\n- Message: ${msg}`);
            window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
            setName('');
            setEmail('');
            setSubject('');
            setMsg('');
        });
    };

    return (
        <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 page-view">
            {/* Contact Info and locations */}
            <div class="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 h-fit select-none">
                <div>
                    <h2 class="font-display text-lg font-bold text-white uppercase tracking-wider mb-1">{settings.name}</h2>
                    <p class="text-[10px] text-primary uppercase font-bold tracking-widest">Kathmandu Headquarters</p>
                </div>
                
                <div class="space-y-4 pt-4 border-t border-white/5 text-xs text-on-surface-variant">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-container text-lg">pin_drop</span>
                        <div>
                            <p class="font-bold text-white">Main Showroom</p>
                            <p>{settings.address}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-container text-lg">phone</span>
                        <div>
                            <p class="font-bold text-white">Phone hotline</p>
                            <p>{settings.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-container text-lg">mail</span>
                        <div>
                            <p class="font-bold text-white">General Inquiry</p>
                            <p>{settings.email}</p>
                        </div>
                    </div>
                </div>

                <div class="h-44 rounded-xl border border-white/5 bg-background flex flex-col justify-center items-center text-center p-4">
                    <span class="material-symbols-outlined text-primary text-2xl mb-2">map</span>
                    <p class="text-xs font-bold text-white">Showroom Office Maps</p>
                    <a href={settings.maps || "https://maps.google.com"} target="_blank" rel="noreferrer" class="text-[9px] text-primary-container hover:text-primary transition-all font-display font-bold uppercase tracking-wider mt-2 border border-primary-container/20 px-3 py-1.5 rounded-lg bg-primary-container/5">Open Maps View</a>
                </div>
            </div>

            {/* Email form */}
            <div class="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                <div>
                    <h2 class="font-display text-lg font-bold text-white uppercase tracking-wider mb-1">Send Client Inquiry</h2>
                    <p class="text-xs text-on-surface-variant">Connect directly with our Gairidhara showroom customer desk</p>
                </div>
                
                <form onSubmit={handleFormSubmit} class="space-y-4 pt-4 border-t border-white/5">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Name</label>
                            <input type="text" required value={name} onChange={e=>setName(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="Your name" />
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="yourname@gmail.com" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Subject</label>
                        <input type="text" required value={subject} onChange={e=>setSubject(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus" placeholder="Inquiry subject..." />
                    </div>
                    <div>
                        <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Message Body</label>
                        <textarea required rows="4" value={msg} onChange={e=>setMsg(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white border-glow-focus resize-none" placeholder="Provide specs details here..."></textarea>
                    </div>
                    <button type="submit" class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold px-6 py-3.5 rounded-lg tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2">
                        Submit Message
                    </button>
                </form>
            </div>
        </div>
    );
};


// ==============================================
// 8. SECURE ADMIN LOGIN PAGE
// ==============================================
export const AdminLogin = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockTime, setLockTime] = useState(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    // Lockout countdown handler
    useEffect(() => {
        let timer;
        if (lockTime) {
            const updateTimer = () => {
                const diff = Math.round((lockTime - Date.now()) / 1000);
                if (diff <= 0) {
                    setLockTime(null);
                    setCountdown(0);
                    setErrorMsg('');
                } else {
                    setCountdown(diff);
                }
            };
            updateTimer();
            timer = setInterval(updateTimer, 1000);
        }
        return () => clearInterval(timer);
    }, [lockTime]);

    const sha256 = async (message) => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (lockTime && Date.now() < lockTime) {
            return;
        }

        const passHash = await sha256(password);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, passwordHash: passHash, role: 'admin' })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setFailedAttempts(0);
                login(data.user, data.token);
                navigate('/admin/dashboard');
            } else {
                const attempts = failedAttempts + 1;
                setFailedAttempts(attempts);
                if (attempts >= 3) {
                    setLockTime(Date.now() + 30000);
                    setFailedAttempts(0);
                } else {
                    setErrorMsg(`Access Denied: Invalid credentials (${3 - attempts} attempts remaining).`);
                }
            }
        } catch(error) {
            console.error("Login Error:", error);
            setErrorMsg("Network error connecting to auth server.");
        }
    };

    return (
        <div class="min-h-[85vh] flex items-center justify-center p-4 page-view">
            <div class="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-white/5">
                <div class="text-center mb-8 select-none">
                    <h2 class="font-display text-lg font-bold text-white uppercase tracking-wider">Admin Portal Access</h2>
                    <p class="text-xs text-on-surface-variant mt-1">RAAZ AUTO Center reconditioned dealership management</p>
                </div>
                
                <form onSubmit={handleSubmit} class="space-y-6">
                    <div>
                        <label class="block text-[10px] font-bold text-on-surface-variant tracking-wider uppercase mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                            class="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 border-glow-focus" 
                            placeholder="raazautocenter@gmail.com"
                        />
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Password</label>
                        </div>
                        <div class="relative">
                            <input 
                                type={showPass ? "text" : "password"} 
                                required
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                                class="w-full bg-surface-container border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-white placeholder-white/20 border-glow-focus" 
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={()=>setShowPass(!showPass)} class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors">
                                <span class="material-symbols-outlined text-sm">{showPass ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div class="bg-red-950/40 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg animate-pulse">
                            {lockTime ? `Lockout active. Try again in ${countdown} seconds.` : errorMsg}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={!!lockTime}
                        class="w-full bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 text-white font-display text-xs font-bold py-3.5 rounded-lg tracking-widest uppercase transition-all shadow-lg"
                    >
                        Authenticate & Access
                    </button>
                    

                </form>
            </div>
        </div>
    );
};


// ==============================================
// 9. SECURE ADMIN DASHBOARD PAGE (SPA-SUBTABS)
// ==============================================
export const AdminDashboard = () => {
    const { user, logout, getAuthHeaders } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Database states
    const [vehicles, setVehicles] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [sales, setSales] = useState([]);
    const [staff, setStaff] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState({ name: '', address: '', phone: '', whatsapp: '', email: '', maps: '', facebook: '', instagram: '', tiktok: '', seoTitle: '', seoDesc: '' });
    const [logs, setLogs] = useState([]);

    // CRUD state managers
    const [crudSearch, setCrudSearch] = useState('');
    const [modalVehicle, setModalVehicle] = useState(null); // holds vehicle data to save
    const [modalStaff, setModalStaff] = useState(null);
    const [modalCategoryOpen, setModalCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Charts references
    const chartSalesRef = useRef(null);
    const chartInvRef = useRef(null);
    const chartSalesInstance = useRef(null);
    const chartInvInstance = useRef(null);

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (!user) {
            navigate('/admin');
        }
    }, [user, navigate]);

    // Load full dashboard data
    const refreshData = () => {
        const headers = getAuthHeaders();
        
        fetch('/api/vehicles').then(res => res.json()).then(data => setVehicles(data));
        fetch('/api/categories').then(res => res.json()).then(data => setCategories(data));
        fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
        
        if (headers.Authorization) {
            fetch('/api/inquiries', { headers }).then(res => res.json()).then(data => setInquiries(data));
            fetch('/api/sales', { headers }).then(res => res.json()).then(data => setSales(data));
            fetch('/api/logs', { headers }).then(res => res.json()).then(data => setLogs(data));
            if (user.role === 'admin') {
                fetch('/api/staff', { headers }).then(res => res.json()).then(data => setStaff(data));
            }
        }
    };

    useEffect(() => {
        if (user) {
            refreshData();
        }
    }, [user]);

    // Render Charts
    useEffect(() => {
        if (activeTab === 'overview' && chartSalesRef.current) {
            if (chartSalesInstance.current) chartSalesInstance.current.destroy();
            const ctx = chartSalesRef.current.getContext('2d');
            chartSalesInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        data: [120, 190, 150, 240, 206],
                        borderColor: '#ff571a',
                        backgroundColor: 'rgba(255, 87, 26, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#e6beb2' } },
                        x: { grid: { display: false }, ticks: { color: '#e6beb2' } }
                    }
                }
            });
        }

        if (activeTab === 'inventory' && chartInvRef.current) {
            if (chartInvInstance.current) chartInvInstance.current.destroy();
            
            const distribution = {};
            vehicles.forEach(v => { distribution[v.category] = (distribution[v.category] || 0) + 1; });
            
            const ctx = chartInvRef.current.getContext('2d');
            chartInvInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(distribution),
                    datasets: [{
                        data: Object.values(distribution),
                        backgroundColor: '#ffb59e',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#e6beb2', stepSize: 1 } },
                        x: { grid: { display: false }, ticks: { color: '#e6beb2' } }
                    }
                }
            });
        }

        return () => {
            if (chartSalesInstance.current) chartSalesInstance.current.destroy();
            if (chartInvInstance.current) chartInvInstance.current.destroy();
        };
    }, [activeTab, vehicles]);

    if (!user) return null;

    // CRUD: Vehicles Handlers
    const saveVehicle = async (e) => {
        e.preventDefault();
        
        let vehicleData = { ...modalVehicle };
        
        // Filter out null entries from imageFiles
        const validFiles = (vehicleData.imageFiles || []).filter(f => f !== null);
        
        // Upload new image files if any
        if (validFiles.length > 0) {
            const formData = new FormData();
            validFiles.forEach(f => formData.append('images', f));
            
            try {
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: formData
                });
                const uploadData = await uploadRes.json();
                
                if (uploadData.success) {
                    // Build final images array: merge existing images with newly uploaded per-slot
                    const existingImages = [...(vehicleData.images || [])];
                    const fileSlots = vehicleData.imageFiles || [];
                    let uploadIdx = 0;
                    
                    // For each slot that had a new file, replace or add the uploaded URL
                    for (let i = 0; i < fileSlots.length; i++) {
                        if (fileSlots[i] !== null) {
                            existingImages[i] = uploadData.urls[uploadIdx];
                            uploadIdx++;
                        }
                    }
                    
                    // Filter out any null/undefined from the array
                    vehicleData.images = existingImages.filter(img => img);
                    vehicleData.img = vehicleData.images[0] || ''; // backward compat
                }
            } catch (error) {
                console.error("Upload Error:", error);
                alert('Failed to upload images. Please try again.');
                return;
            }
        }
        
        // Clean up imageFiles and preview data before saving to DB
        delete vehicleData.imageFiles;
        delete vehicleData.imagePreviews;
        
        // Ensure backward compatibility: img = first image
        if (vehicleData.images && vehicleData.images.length > 0 && !vehicleData.img) {
            vehicleData.img = vehicleData.images[0];
        }
        
        const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
        const method = vehicleData.id ? 'PUT' : 'POST';
        const url = vehicleData.id ? `/api/vehicles/${vehicleData.id}` : '/api/vehicles';

        fetch(url, {
            method,
            headers,
            body: JSON.stringify(vehicleData)
        })
        .then(res => res.json())
        .then(() => {
            setModalVehicle(null);
            refreshData();
        });
    };

    const deleteVehicle = (id) => {
        if (confirm("Permanently delete this vehicle listing?")) {
            fetch(`/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            .then(() => refreshData());
        }
    };

    // CRUD: Inquiries Status Update
    const updateInquiryStatus = (id, newStatus) => {
        fetch(`/api/inquiries/${id}`, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
        .then(() => refreshData());
    };

    const deleteInquiry = (id) => {
        if (confirm("Delete this customer inquiry?")) {
            fetch(`/api/inquiries/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            .then(() => refreshData());
        }
    };

    // CRUD: Staff Handlers
    const saveStaff = (e) => {
        e.preventDefault();
        const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
        const method = modalStaff.id ? 'PUT' : 'POST';
        const url = modalStaff.id ? `/api/staff/${modalStaff.id}` : '/api/staff';

        fetch(url, {
            method,
            headers,
            body: JSON.stringify(modalStaff)
        })
        .then(res => res.json())
        .then(() => {
            setModalStaff(null);
            refreshData();
        });
    };

    const deleteStaff = (id) => {
        if (confirm("Delete this staff account?")) {
            fetch(`/api/staff/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            .then(() => refreshData());
        }
    };

    // CRUD: Category Handlers
    const addCategory = (e) => {
        e.preventDefault();
        fetch('/api/categories', {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName })
        })
        .then(res => {
            if (res.ok) {
                setModalCategoryOpen(false);
                setNewCategoryName('');
                refreshData();
            } else {
                alert("Category folder already exists.");
            }
        });
    };

    const deleteCategory = (name) => {
        fetch(`/api/categories/${name}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        .then(res => {
            if (res.ok) refreshData();
            else alert("Cannot delete category containing active vehicles.");
        });
    };

    // Save Settings
    const saveSettings = (e) => {
        e.preventDefault();
        fetch('/api/settings', {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        })
        .then(() => {
            alert("Dealership settings committed successfully!");
            refreshData();
        });
    };

    return (
        <div class="flex min-h-screen relative overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar nav drawer */}
            <aside class={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 flex flex-col justify-between select-none transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div class="p-6 border-b border-white/5">
                        <span class="font-display text-sm font-bold text-white tracking-widest uppercase text-glow">RAAZ ADMIN</span>
                    </div>
                    <nav class="p-4 space-y-1">
                        {[
                            { id: 'overview', name: 'Dashboard Overview', icon: 'dashboard' },
                            { id: 'vehicles', name: 'Vehicle CRUD', icon: 'directions_car' },
                            { id: 'inventory', name: 'Stock Inventory', icon: 'inventory_2' },
                            { id: 'inquiries', name: 'Inquiry Resolution', icon: 'forum' },
                            { id: 'sales', name: 'Sales Ledger', icon: 'receipt_long' },
                            { id: 'users', name: 'Staff accounts', icon: 'manage_accounts', adminOnly: true },
                            { id: 'settings', name: 'Platform Settings', icon: 'settings' }
                        ].map(t => {
                            if (t.adminOnly && user.role !== 'admin') return null;
                            return (
                                <button 
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)} 
                                    class={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider uppercase ${activeTab===t.id?'active text-primary':'text-on-surface-variant hover:text-white'}`}
                                >
                                    <span class="material-symbols-outlined text-lg">{t.icon}</span> {t.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div class="p-4 border-t border-white/5 bg-surface-container flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-white truncate">{user.name}</p>
                        <p class="text-[9px] text-primary truncate tracking-wider uppercase font-semibold">{user.role}</p>
                    </div>
                    <button onClick={logout} class="text-on-surface-variant hover:text-secondary-container transition-colors">
                        <span class="material-symbols-outlined text-lg">logout</span>
                    </button>
                </div>
            </aside>

            {/* Dashboard workspace */}
            <main class="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
                <header class="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center select-none">
                    <div class="flex items-center gap-4">
                        <button class="lg:hidden text-on-surface-variant hover:text-white" onClick={() => setIsSidebarOpen(true)}>
                            <span class="material-symbols-outlined">menu</span>
                        </button>
                        <span class="text-xs text-on-surface-variant font-medium font-mono uppercase tracking-widest hidden sm:inline">Active Workspace Panel</span>
                    </div>
                    <div class="flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full border border-white/5 text-[10px]">
                        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping mr-1"></span>
                        <span class="font-bold text-white uppercase truncate max-w-[120px] sm:max-w-none">{user.name} ({user.role.toUpperCase()})</span>
                    </div>
                </header>

                <div class="flex-1 p-6 space-y-8 overflow-y-auto">
                    
                    {/* SUB-VIEW 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div class="space-y-8 page-view">
                            <div>
                                <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Performance Overview</h1>
                                <p class="text-xs text-on-surface-variant">Real-time dealer summary metrics, sales counts, and system status</p>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
                                <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Showroom Inventory</span>
                                        <p class="text-3xl font-extrabold text-white mt-1 font-mono">{vehicles.length}</p>
                                    </div>
                                    <span class="material-symbols-outlined text-white/10 text-4xl">directions_car</span>
                                </div>
                                <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Pending Inquiries</span>
                                        <p class="text-3xl font-extrabold text-white mt-1 font-mono">{inquiries.filter(i=>i.status==='New').length}</p>
                                    </div>
                                    <span class="material-symbols-outlined text-white/10 text-4xl">forum</span>
                                </div>
                                <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Total Completed Sales</span>
                                        <p class="text-3xl font-extrabold text-white mt-1 font-mono">{sales.length}</p>
                                    </div>
                                    <span class="material-symbols-outlined text-white/10 text-4xl">receipt_long</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div class="glass-panel p-6 rounded-xl border border-white/5 lg:col-span-2 space-y-4">
                                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Estimated Revenue Trends (Lakhs)</h3>
                                    <div class="h-64">
                                        <canvas ref={chartSalesRef}></canvas>
                                    </div>
                                </div>
                                <div class="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Audit logs</h3>
                                    <div class="space-y-3.5 max-h-64 overflow-y-auto text-xs text-on-surface-variant">
                                        {logs.slice(0, 10).map((l, idx) => (
                                            <div key={idx} class="p-3 bg-surface border border-white/5 rounded-lg">
                                                <p class="text-white font-medium">{l.text}</p>
                                                <span class="text-[9px] text-primary font-mono block mt-1 font-semibold">{l.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 2: VEHICLE CRUD */}
                    {activeTab === 'vehicles' && (
                        <div class="space-y-6 page-view">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Inventory Control Desk</h1>
                                    <p class="text-xs text-on-surface-variant">Update active listings, upload vehicle models, and delete stock entries</p>
                                </div>
                                {user.role !== 'staff' && (
                                    <button 
                                        onClick={() => setModalVehicle({
                                            brand: '', name: '', category: 'SUV', year: 2021, price: 5000000, emi: 80000, km: 20000,
                                            fuel: 'Petrol', transmission: 'Automatic', color: 'Polar White', img: '', images: [], imageFiles: [], status: 'In Stock',
                                            specs: { engine: '2000 cc', power: '150 bhp', torque: '220 Nm', groundClearance: '180 mm' },
                                            description: ''
                                        })}
                                        class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold px-4 py-2.5 rounded-lg tracking-widest uppercase transition-all shadow-lg"
                                    >
                                        Add New Vehicle
                                    </button>
                                )}
                            </div>

                            <div class="glass-panel p-4 rounded-xl border border-white/5 select-none">
                                <input 
                                    type="text" 
                                    value={crudSearch}
                                    onChange={e=>setCrudSearch(e.target.value)}
                                    class="w-full max-w-sm bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus"
                                    placeholder="Search brand or model name..."
                                />
                            </div>

                            <div class="glass-panel rounded-xl border border-white/5 overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse text-xs select-none">
                                        <thead class="bg-surface-container text-primary font-bold tracking-wider uppercase border-b border-white/5 font-display">
                                            <tr>
                                                <th class="p-4">Car Details</th>
                                                <th class="p-4">Category</th>
                                                <th class="p-4">Price / Monthly EMI</th>
                                                <th class="p-4">Transmission</th>
                                                <th class="p-4">Status</th>
                                                <th class="p-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-white/5">
                                            {vehicles.filter(v => v.brand.toLowerCase().includes(crudSearch.toLowerCase()) || v.name.toLowerCase().includes(crudSearch.toLowerCase())).map(v => (
                                                <tr key={v.id} class="hover:bg-white/[0.01] transition-colors border-b border-white/5">
                                                    <td class="p-4">
                                                        <div class="flex items-center gap-3">
                                                            <img src={(v.images && v.images[0]) || v.img} alt={v.brand} class="h-10 w-16 object-cover rounded border border-white/5 bg-background shrink-0" />
                                                            <div>
                                                                <p class="font-semibold text-white">{v.year} {v.brand} {v.name}</p>
                                                                <p class="text-[9px] text-on-surface-variant font-mono mt-0.5">{v.color} &bull; {v.km.toLocaleString()} KM</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="p-4 font-semibold text-white uppercase text-[9px]">{v.category}</td>
                                                    <td class="p-4">
                                                        <p class="font-semibold text-primary font-mono">{formatNPR(v.price)}</p>
                                                        <p class="text-[10px] text-on-surface-variant font-mono mt-0.5">{formatNPR(v.emi)} / mo</p>
                                                    </td>
                                                    <td class="p-4 text-white">{v.specs.engine} &bull; {v.transmission}</td>
                                                    <td class="p-4">
                                                        <span class={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${v.status==='Sold Out'?'bg-red-500/10 text-red-400 border border-red-500/20':'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{v.status}</span>
                                                    </td>
                                                    <td class="p-4 text-center">
                                                        <div class="flex items-center justify-center gap-2 text-on-surface-variant">
                                                            {user.role !== 'staff' && (
                                                                <button onClick={() => setModalVehicle({...v, images: v.images || (v.img ? [v.img] : []), imageFiles: []})} class="hover:text-primary transition-colors p-1" title="Edit"><span class="material-symbols-outlined text-base">edit</span></button>
                                                            )}
                                                            {user.role === 'admin' && (
                                                                <button onClick={() => deleteVehicle(v.id)} class="hover:text-red-500 transition-colors p-1" title="Delete"><span class="material-symbols-outlined text-base">delete</span></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 3: STOCK INVENTORY */}
                    {activeTab === 'inventory' && (
                        <div class="space-y-6 page-view">
                            <div class="flex justify-between items-center select-none">
                                <div>
                                    <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Stock & Folder Manager</h1>
                                    <p class="text-xs text-on-surface-variant">Manage category collections and evaluate stock densities</p>
                                </div>
                                {user.role !== 'staff' && (
                                    <button onClick={() => setModalCategoryOpen(true)} class="text-xs text-primary hover:text-primary-container font-bold uppercase tracking-widest font-display">+ Add Category</button>
                                )}
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div class="glass-panel p-6 rounded-xl border border-white/5 space-y-4 select-none">
                                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Active Folders</h3>
                                    <div class="space-y-3">
                                        {categories.map(cat => {
                                            const count = vehicles.filter(v => v.category === cat).length;
                                            const canDelete = count === 0 && user.role !== 'staff';
                                            return (
                                                <div key={cat} class="p-3.5 bg-surface border border-white/5 rounded-lg flex items-center justify-between">
                                                    <span class="text-xs text-white uppercase font-bold tracking-wider">{cat}</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="bg-white/5 px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-mono">{count} Cars</span>
                                                        {canDelete && (
                                                            <button onClick={() => deleteCategory(cat)} class="text-on-surface-variant hover:text-red-500 p-0.5 transition-colors"><span class="material-symbols-outlined text-sm font-semibold">delete</span></button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div class="glass-panel p-6 rounded-xl border border-white/5 lg:col-span-2 space-y-4">
                                    <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider">Stock Density Model</h3>
                                    <div class="h-64">
                                        <canvas ref={chartInvRef}></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 4: INQUIRIES RESOLUTION */}
                    {activeTab === 'inquiries' && (
                        <div class="space-y-6 page-view">
                            <div>
                                <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Customer Inquiry Resolution</h1>
                                <p class="text-xs text-on-surface-variant">Review test drive bookings, email messages, and trade requests</p>
                            </div>

                            <div class="glass-panel rounded-xl border border-white/5 overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse text-xs select-none">
                                        <thead class="bg-surface-container text-primary font-bold tracking-wider uppercase border-b border-white/5 font-display">
                                            <tr>
                                                <th class="p-4">Customer Details</th>
                                                <th class="p-4">Inquiry Category</th>
                                                <th class="p-4">Target Model</th>
                                                <th class="p-4">Value Details</th>
                                                <th class="p-4">Lead Status</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-white/5">
                                            {inquiries.map(inq => (
                                                <tr key={inq.id} class="hover:bg-white/[0.01] transition-colors border-b border-white/5">
                                                    <td class="p-4">
                                                        <p class="font-semibold text-white">{inq.name || inq.customer}</p>
                                                        <p class="text-[9px] text-on-surface-variant mt-0.5">{inq.phone} &bull; {inq.email}</p>
                                                    </td>
                                                    <td class="p-4 font-semibold text-white uppercase text-[9px]">{inq.type || inq.category}</td>
                                                    <td class="p-4 text-white">{inq.target}</td>
                                                    <td class="p-4 text-on-surface-variant leading-relaxed">{inq.details || inq.value}</td>
                                                    <td class="p-4">
                                                        <div class="flex items-center gap-2">
                                                            <select 
                                                                value={inq.status} 
                                                                onChange={e => updateInquiryStatus(inq.id, e.target.value)}
                                                                class="bg-surface-container border border-white/5 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none"
                                                            >
                                                                <option value="New">New</option>
                                                                <option value="Contacted">Contacted</option>
                                                                <option value="Interested">Interested</option>
                                                                <option value="Closed">Closed</option>
                                                            </select>
                                                            {user.role === 'admin' && (
                                                                <button onClick={() => deleteInquiry(inq.id)} class="text-on-surface-variant hover:text-red-500 transition-colors p-1" title="Delete">
                                                                    <span class="material-symbols-outlined text-sm">delete</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 5: SALES LEDGER */}
                    {activeTab === 'sales' && (
                        <div class="space-y-6 page-view">
                            <div>
                                <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Showroom Sales Ledger</h1>
                                <p class="text-xs text-on-surface-variant">Archived history of completed reconditioned car transactions</p>
                            </div>

                            <div class="glass-panel rounded-xl border border-white/5 overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse text-xs select-none">
                                        <thead class="bg-surface-container text-primary font-bold tracking-wider uppercase border-b border-white/5 font-display">
                                            <tr>
                                                <th class="p-4">Sold Car</th>
                                                <th class="p-4">Buyer details</th>
                                                <th class="p-4">Final Value</th>
                                                <th class="p-4">Date</th>
                                                <th class="p-4">Agent</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-white/5">
                                            {sales.map(s => (
                                                <tr key={s.id} class="hover:bg-white/[0.01] transition-colors border-b border-white/5">
                                                    <td class="p-4 font-semibold text-white">{s.name}</td>
                                                    <td class="p-4 text-white">{s.buyer}</td>
                                                    <td class="p-4 font-semibold text-primary font-mono">{formatNPR(s.price)}</td>
                                                    <td class="p-4 text-on-surface-variant">{s.date}</td>
                                                    <td class="p-4 text-white">{s.salesperson}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 6: STAFF SYSTEM (ADMIN ONLY) */}
                    {activeTab === 'users' && user.role === 'admin' && (
                        <div class="space-y-6 page-view">
                            <div class="flex justify-between items-center select-none">
                                <div>
                                    <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Staff Account Management</h1>
                                    <p class="text-xs text-on-surface-variant">Provide dashboard credentials and active system roles permissions</p>
                                </div>
                                <button 
                                    onClick={() => setModalStaff({ name: '', email: '', role: 'staff', active: true })}
                                    class="bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold px-4 py-2.5 rounded-lg tracking-widest uppercase transition-all shadow-lg"
                                >
                                    Create Staff Account
                                </button>
                            </div>

                            <div class="glass-panel rounded-xl border border-white/5 overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse text-xs select-none">
                                        <thead class="bg-surface-container text-primary font-bold tracking-wider uppercase border-b border-white/5 font-display">
                                            <tr>
                                                <th class="p-4">Staff Member</th>
                                                <th class="p-4">Email</th>
                                                <th class="p-4">System Role</th>
                                                <th class="p-4">Status</th>
                                                <th class="p-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-white/5">
                                            {staff.map(s => (
                                                <tr key={s.id} class="hover:bg-white/[0.01] transition-colors border-b border-white/5">
                                                    <td class="p-4 font-semibold text-white">{s.name}</td>
                                                    <td class="p-4 text-on-surface-variant font-mono">{s.email}</td>
                                                    <td class="p-4 uppercase tracking-wider text-[10px] text-white font-bold">{s.role}</td>
                                                    <td class="p-4">
                                                        <span class={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${s.active?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{s.active ? 'Active' : 'Disabled'}</span>
                                                    </td>
                                                    <td class="p-4 text-center">
                                                        <div class="flex items-center justify-center gap-2 text-on-surface-variant">
                                                            <button onClick={() => setModalStaff(s)} class="hover:text-primary transition-colors p-1" title="Edit"><span class="material-symbols-outlined text-base">edit</span></button>
                                                            {s.email !== user.email && (
                                                                <button onClick={() => deleteStaff(s.id)} class="hover:text-red-500 transition-colors p-1" title="Delete"><span class="material-symbols-outlined text-base">delete</span></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-VIEW 7: PLATFORM SETTINGS */}
                    {activeTab === 'settings' && (
                        <div class="space-y-6 page-view">
                            <div>
                                <h1 class="font-display text-xl font-bold text-white uppercase tracking-wider">Showroom Configuration Settings</h1>
                                <p class="text-xs text-on-surface-variant">Adjust public contact profiles, WhatsApp lines, and SEO descriptions</p>
                            </div>

                            <form onSubmit={saveSettings} class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div class="lg:col-span-2 space-y-6">
                                    <div class="glass-panel p-6 rounded-xl border border-white/5 space-y-5">
                                        <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider select-none">Dealership Metadata Profile</h3>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Dealership Name</label>
                                                <input type="text" value={settings.name} onChange={e=>setSettings({...settings, name: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Address Profile</label>
                                                <input type="text" value={settings.address} onChange={e=>setSettings({...settings, address: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Office Hotline</label>
                                                <input type="text" value={settings.phone} onChange={e=>setSettings({...settings, phone: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">WhatsApp Hotline</label>
                                                <input type="text" value={settings.whatsapp} onChange={e=>setSettings({...settings, whatsapp: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div class="sm:col-span-2">
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Google Maps URI Location</label>
                                                <input type="text" value={settings.maps} onChange={e=>setSettings({...settings, maps: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                                        <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider select-none">SEO Tags</h3>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">SEO Page Title Tag</label>
                                                <input type="text" value={settings.seoTitle} onChange={e=>setSettings({...settings, seoTitle: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">SEO Meta Description</label>
                                                <textarea rows="3" value={settings.seoDesc} onChange={e=>setSettings({...settings, seoDesc: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus resize-none"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-6">
                                    <div class="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                                        <h3 class="font-display text-xs font-bold text-white uppercase tracking-wider select-none">Social Profiles</h3>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Facebook Page Link</label>
                                                <input type="text" value={settings.facebook} onChange={e=>setSettings({...settings, facebook: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Instagram Link</label>
                                                <input type="text" value={settings.instagram} onChange={e=>setSettings({...settings, instagram: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                            <div>
                                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">TikTok Link</label>
                                                <input type="text" value={settings.tiktok || ''} onChange={e=>setSettings({...settings, tiktok: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-xs text-white border-glow-focus" />
                                            </div>
                                        </div>
                                    </div>
                                    {user.role !== 'staff' && (
                                        <button type="submit" class="w-full bg-primary-container hover:bg-opacity-95 text-white font-display text-xs font-bold py-3 rounded-lg tracking-widest uppercase transition-all shadow-lg">Save Settings</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL WINDOWS FOR CRUD */}
            {/* 1. Vehicle CRUD Modal */}
            {modalVehicle && (
                <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div class="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-white/5 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setModalVehicle(null)} class="absolute top-5 right-5 text-on-surface-variant hover:text-white"><span class="material-symbols-outlined">close</span></button>
                        <h3 class="font-display text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary-container">directions_car</span> Vehicle Form Details
                        </h3>
                        <form onSubmit={saveVehicle} class="space-y-5 text-xs text-left">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Brand</label>
                                    <input type="text" required value={modalVehicle.brand} onChange={e=>setModalVehicle({...modalVehicle, brand: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Model Name</label>
                                    <input type="text" required value={modalVehicle.name} onChange={e=>setModalVehicle({...modalVehicle, name: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category Folder</label>
                                    <select value={modalVehicle.category} onChange={e=>setModalVehicle({...modalVehicle, category: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Year</label>
                                    <input type="number" required value={modalVehicle.year} onChange={e=>setModalVehicle({...modalVehicle, year: parseInt(e.target.value)})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Price (NPR)</label>
                                    <input type="number" required value={modalVehicle.price} onChange={e=>setModalVehicle({...modalVehicle, price: parseInt(e.target.value)})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">EMI / month</label>
                                    <input type="number" required value={modalVehicle.emi} onChange={e=>setModalVehicle({...modalVehicle, emi: parseInt(e.target.value)})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Kilometers</label>
                                    <input type="number" required value={modalVehicle.km} onChange={e=>setModalVehicle({...modalVehicle, km: parseInt(e.target.value)})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fuel Type</label>
                                    <select value={modalVehicle.fuel} onChange={e=>setModalVehicle({...modalVehicle, fuel: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus">
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Transmission</label>
                                    <select value={modalVehicle.transmission} onChange={e=>setModalVehicle({...modalVehicle, transmission: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus">
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                        <option value="AWD">AWD</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Color</label>
                                    <input type="text" required value={modalVehicle.color} onChange={e=>setModalVehicle({...modalVehicle, color: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Vehicle Images (Up to 4)</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[0, 1, 2, 3].map(idx => {
                                        const existingImages = modalVehicle.images || [];
                                        const previewFiles = modalVehicle.imagePreviews || [];
                                        const hasExisting = existingImages[idx];
                                        const hasPreview = previewFiles[idx];
                                        const displaySrc = hasPreview || hasExisting;
                                        
                                        return (
                                            <div key={idx} class="relative group">
                                                <label 
                                                    class={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        displaySrc 
                                                            ? 'border-primary-container/50 bg-surface' 
                                                            : 'border-white/10 hover:border-primary-container/40 bg-surface/50 hover:bg-surface'
                                                    }`}
                                                >
                                                    {displaySrc ? (
                                                        <img src={displaySrc} alt={`Vehicle photo ${idx + 1}`} class="w-full h-full object-cover" />
                                                    ) : (
                                                        <div class="flex flex-col items-center gap-1.5 text-on-surface-variant">
                                                            <span class="material-symbols-outlined text-xl text-primary-container/60">add_photo_alternate</span>
                                                            <span class="text-[8px] font-bold tracking-wider uppercase">{idx === 0 ? 'Main Photo' : `Photo ${idx + 1}`}</span>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                                        class="hidden" 
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            
                                                            // Create preview URL
                                                            const previewUrl = URL.createObjectURL(file);
                                                            
                                                            const newFiles = [...(modalVehicle.imageFiles || [])];
                                                            const newPreviews = [...(modalVehicle.imagePreviews || [])];
                                                            
                                                            // Pad arrays if needed
                                                            while (newFiles.length <= idx) newFiles.push(null);
                                                            while (newPreviews.length <= idx) newPreviews.push(null);
                                                            
                                                            newFiles[idx] = file;
                                                            newPreviews[idx] = previewUrl;
                                                            
                                                            setModalVehicle({
                                                                ...modalVehicle,
                                                                imageFiles: newFiles,
                                                                imagePreviews: newPreviews
                                                            });
                                                        }}
                                                    />
                                                </label>
                                                {displaySrc && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newFiles = [...(modalVehicle.imageFiles || [])];
                                                            const newPreviews = [...(modalVehicle.imagePreviews || [])];
                                                            const newImages = [...(modalVehicle.images || [])];
                                                            
                                                            // Revoke preview URL to free memory
                                                            if (newPreviews[idx]) URL.revokeObjectURL(newPreviews[idx]);
                                                            
                                                            newFiles[idx] = null;
                                                            newPreviews[idx] = null;
                                                            newImages[idx] = null;
                                                            
                                                            // Clean null values from the end
                                                            while (newFiles.length > 0 && !newFiles[newFiles.length - 1]) newFiles.pop();
                                                            while (newPreviews.length > 0 && !newPreviews[newPreviews.length - 1]) newPreviews.pop();
                                                            while (newImages.length > 0 && !newImages[newImages.length - 1]) newImages.pop();
                                                            
                                                            setModalVehicle({
                                                                ...modalVehicle,
                                                                imageFiles: newFiles,
                                                                imagePreviews: newPreviews,
                                                                images: newImages
                                                            });
                                                        }}
                                                        class="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                    >
                                                        <span class="material-symbols-outlined text-white text-[12px]">close</span>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p class="text-[8px] text-on-surface-variant/60 mt-2 tracking-wider">Accepted: JPG, PNG, WEBP, GIF — Max 10MB per image. First image is the main listing photo.</p>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Engine (cc)</label>
                                    <input type="text" required value={modalVehicle.specs.engine} onChange={e=>setModalVehicle({...modalVehicle, specs: {...modalVehicle.specs, engine: e.target.value}})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Power</label>
                                    <input type="text" required value={modalVehicle.specs.power} onChange={e=>setModalVehicle({...modalVehicle, specs: {...modalVehicle.specs, power: e.target.value}})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Torque</label>
                                    <input type="text" required value={modalVehicle.specs.torque} onChange={e=>setModalVehicle({...modalVehicle, specs: {...modalVehicle.specs, torque: e.target.value}})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Ground Clearance</label>
                                    <input type="text" required value={modalVehicle.specs.groundClearance} onChange={e=>setModalVehicle({...modalVehicle, specs: {...modalVehicle.specs, groundClearance: e.target.value}})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                                </div>
                            </div>
                            <div class="pt-4">
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Additional Details</label>
                                <textarea rows="3" value={modalVehicle.description} onChange={e=>setModalVehicle({...modalVehicle, description: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus resize-none" placeholder="Provide any additional details or description..."></textarea>
                            </div>
                            <div class="flex justify-between items-center pt-4">
                                <div class="flex items-center gap-4">
                                    <select value={modalVehicle.status} onChange={e=>setModalVehicle({...modalVehicle, status: e.target.value})} class="bg-surface-container border border-white/5 rounded px-2 py-1 text-white">
                                        <option value="In Stock">In Stock</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Sold Out">Sold Out</option>
                                    </select>
                                    <div class="flex items-center gap-2">
                                        <input type="checkbox" id="modal-featured" checked={modalVehicle.featured} onChange={e=>setModalVehicle({...modalVehicle, featured: e.target.checked})} class="accent-primary-container h-4 w-4 bg-surface border border-white/5 rounded" />
                                        <label htmlFor="modal-featured" class="text-white font-bold select-none cursor-pointer">Featured Homepage</label>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <button type="button" onClick={() => setModalVehicle(null)} class="font-bold py-2 px-4 text-on-surface-variant hover:text-white uppercase">Cancel</button>
                                    <button type="submit" class="bg-primary-container hover:bg-opacity-90 text-white font-display font-bold px-6 py-2 rounded-lg tracking-widest uppercase transition-all shadow-lg">Save Listing</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Staff CRUD Modal */}
            {modalStaff && (
                <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div class="glass-panel w-full max-w-sm rounded-2xl p-6 border border-white/5 relative">
                        <button onClick={() => setModalStaff(null)} class="absolute top-5 right-5 text-on-surface-variant hover:text-white"><span class="material-symbols-outlined">close</span></button>
                        <h3 class="font-display text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary-container">person_add</span> Staff Credentials
                        </h3>
                        <form onSubmit={saveStaff} class="space-y-4 text-xs text-left">
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Name</label>
                                <input type="text" required value={modalStaff.name} onChange={e=>setModalStaff({...modalStaff, name: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                                <input type="email" required value={modalStaff.email} onChange={e=>setModalStaff({...modalStaff, email: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" />
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Dashboard Role</label>
                                <select value={modalStaff.role} onChange={e=>setModalStaff({...modalStaff, role: e.target.value})} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus">
                                    <option value="admin">Administrator (Full Access)</option>
                                    <option value="manager">Manager (Inventory / Inquiries)</option>
                                    <option value="staff">Sales Staff (Read-Only Logs)</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="modal-staff-active" checked={modalStaff.active} onChange={e=>setModalStaff({...modalStaff, active: e.target.checked})} class="accent-primary-container h-4 w-4 bg-surface border border-white/5 rounded" />
                                <label htmlFor="modal-staff-active" class="text-white font-bold select-none cursor-pointer">Active Account</label>
                            </div>
                            <div class="flex justify-end gap-3 pt-4 select-none">
                                <button type="button" onClick={() => setModalStaff(null)} class="font-bold py-2 px-4 text-on-surface-variant hover:text-white uppercase">Cancel</button>
                                <button type="submit" class="bg-primary-container hover:bg-opacity-95 text-white font-display font-bold px-6 py-2 rounded-lg tracking-widest uppercase transition-all shadow-lg">Save Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Category Add Modal */}
            {modalCategoryOpen && (
                <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div class="glass-panel w-full max-w-xs rounded-2xl p-6 border border-white/5 relative">
                        <button onClick={() => setModalCategoryOpen(false)} class="absolute top-5 right-5 text-on-surface-variant hover:text-white"><span class="material-symbols-outlined">close</span></button>
                        <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary-container">folder</span> Create Category
                        </h3>
                        <form onSubmit={addCategory} class="space-y-4 text-xs text-left">
                            <div>
                                <label class="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category Folder Name</label>
                                <input type="text" required value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)} class="w-full bg-surface border border-white/5 rounded-lg px-3 py-2 text-white border-glow-focus" placeholder="e.g. Hatchback" />
                            </div>
                            <div class="flex justify-end gap-3 pt-2 select-none">
                                <button type="button" onClick={() => setModalCategoryOpen(false)} class="font-bold py-2 px-4 text-on-surface-variant hover:text-white uppercase">Cancel</button>
                                <button type="submit" class="bg-primary-container hover:bg-opacity-95 text-white font-display font-bold px-5 py-1.5 rounded-lg tracking-widest uppercase transition-all shadow-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
