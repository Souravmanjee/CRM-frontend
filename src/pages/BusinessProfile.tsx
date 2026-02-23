import { useState } from 'react';
import { useBusinessStore } from '../store/businessStore';
import { Building2, Settings, Save, Loader2, CheckCircle } from 'lucide-react';

export const BusinessProfile = () => {
    const activeBusiness = useBusinessStore(s => s.activeBusiness);
    const businesses = useBusinessStore(s => s.businesses);
    const setActiveBusiness = useBusinessStore(s => s.setActiveBusiness);
    const updateBusiness = useBusinessStore(s => s.updateBusiness);
    const isLoading = useBusinessStore(s => s.isLoading);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({
        name: activeBusiness?.name || '',
        businessType: activeBusiness?.businessType || 'Retail Shop',
        phone: activeBusiness?.phone || '',
        email: activeBusiness?.email || '',
        address: activeBusiness?.address || '',
    });

    if (!activeBusiness) return (
        <div className="card p-8 text-center">
            <p className="text-slate-500">No business selected.</p>
        </div>
    );

    const handleSwitchBusiness = (id: string) => {
        const biz = businesses.find(b => b._id === id);
        if (biz) setActiveBusiness(biz);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateBusiness(activeBusiness._id, formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to update business:', err);
        }
    };

    return (
        <div className="flex flex-col space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Business Profile</h1>
                <p className="text-slate-500 mt-1">Manage your business settings and configuration</p>
            </div>

            {/* Active Business Card */}
            <div className="card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20">
                        {activeBusiness.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">{activeBusiness.name}</h2>
                        <p className="text-sm text-slate-500 mt-0.5 font-mono">ID: {activeBusiness._id}</p>
                    </div>
                    {saved && (
                        <div className="ml-auto flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                            <CheckCircle size={18} /> Saved!
                        </div>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field w-full"
                                placeholder="Your Business Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
                            <select
                                value={formData.businessType}
                                onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                className="input-field w-full"
                            >
                                <option>Retail Shop</option>
                                <option>Wholesale</option>
                                <option>Manufacturing</option>
                                <option>Service</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                            <input
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field w-full"
                                placeholder="+91 98765 43210"
                                type="tel"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="input-field w-full"
                                placeholder="business@example.com"
                                type="email"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                            <input
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="input-field w-full"
                                placeholder="Shop No., Street, City, State, Pincode"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Switch Business */}
            {businesses.length > 1 && (
                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Building2 size={20} className="text-slate-500" />
                        <h3 className="font-heading font-semibold text-slate-700 dark:text-slate-300">Switch Business</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {businesses.map(biz => (
                            <button key={biz._id} onClick={() => handleSwitchBusiness(biz._id)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${activeBusiness._id === biz._id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-border-dark hover:border-slate-300'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                                        {biz.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{biz.name}</p>
                                        {activeBusiness._id === biz._id && <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Active</p>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* About */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Settings size={20} className="text-slate-500" />
                    <h3 className="font-heading font-semibold text-slate-700 dark:text-slate-300">Plan & Usage</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Plan', value: 'Premium' },
                        { label: 'Status', value: 'Active' },
                        { label: 'Region', value: 'India' },
                        { label: 'Currency', value: 'INR (₹)' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-1">{label}</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
