import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, User, Mail, Briefcase, MapPin, IndianRupee, Award, Save, Edit2, Upload, Star, ShieldCheck, Zap, Laptop, Users, Rocket, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const ProfileCompletionModal = ({ isOpen, onClose }) => {
  const { userProfile, user } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const profileFields = useMemo(() => {
    if (!userProfile && !user) return [];

    return [
      {
        id: 'name',
        label: 'Full Name',
        icon: User,
        value: userProfile?.name || user?.displayName || '',
        completed: !!(userProfile?.name || user?.displayName),
        type: 'text',
        placeholder: 'Enter your full name',
        category: 'Basic',
      },
      {
        id: 'photoURL',
        label: 'Profile Photo',
        icon: Upload,
        value: userProfile?.photoURL || user?.photoURL || '',
        completed: !!(userProfile?.photoURL || user?.photoURL),
        type: 'file',
        placeholder: 'Paste photo URL (or upload)',
        category: 'Basic',
      },
      {
        id: 'role',
        label: 'Professional Role',
        icon: Briefcase,
        value: userProfile?.role ? (Array.isArray(userProfile.role) ? userProfile.role.join(', ') : userProfile.role) : '',
        completed: !!(userProfile?.role && (Array.isArray(userProfile.role) ? userProfile.role.length > 0 : userProfile.role)),
        type: 'select',
        options: [
          { value: 'Freelancer', icon: Laptop, desc: 'I want to offer my services' },
          { value: 'Client', icon: Users, desc: 'I want to hire talent' },
          { value: 'Both', icon: Rocket, desc: 'I want to do both' }
        ],
        placeholder: 'How will you use Xlance?',
        category: 'Professional',
      },
      {
        id: 'skills',
        label: 'Skills & Expertise',
        icon: Award,
        value: userProfile?.skills ? (Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : userProfile.skills) : '',
        completed: !!(userProfile?.skills && Array.isArray(userProfile.skills) && userProfile.skills.length > 0),
        type: 'text',
        placeholder: 'e.g., React, Python, UI/UX Design',
        category: 'Professional',
      },
      {
        id: 'bio',
        label: 'Professional Bio',
        icon: User,
        value: userProfile?.bio || userProfile?.description || '',
        completed: !!(userProfile?.bio || userProfile?.description),
        type: 'textarea',
        placeholder: 'Tell us about your expertise and experience...',
        category: 'Professional',
      },
      {
        id: 'location',
        label: 'Location',
        icon: MapPin,
        value: userProfile?.location || '',
        completed: !!(userProfile?.location),
        type: 'text',
        placeholder: 'e.g., Mumbai, India',
        category: 'Professional',
      },
      {
        id: 'hourlyRate',
        label: 'Hourly Rate (₹)',
        icon: IndianRupee,
        value: userProfile?.hourlyRate || userProfile?.rate || '',
        completed: !!(userProfile?.hourlyRate || userProfile?.rate),
        type: 'number',
        placeholder: 'e.g., 1500',
        category: 'Expert',
      },
      {
        id: 'experienceLevel',
        label: 'Experience Level',
        icon: Award,
        value: userProfile?.experienceLevel || userProfile?.experience || '',
        completed: !!(userProfile?.experienceLevel || userProfile?.experience),
        type: 'select',
        options: [
          { value: 'Beginner', icon: Star, desc: 'New to this field' },
          { value: 'Intermediate', icon: Zap, desc: 'Solid professional experience' },
          { value: 'Expert', icon: ShieldCheck, desc: 'Highly experienced specialist' },
          { value: 'Professional', icon: Trophy, desc: 'Top-tier industry leader' }
        ],
        placeholder: 'Select experience level',
        category: 'Expert',
      },
    ];
  }, [userProfile, user]);

  const completedFields = profileFields.filter(f => f.completed).length;
  const completionPercentage = profileFields.length > 0 ? Math.round((completedFields / profileFields.length) * 100) : 0;

  // Determine Tier
  const tier = useMemo(() => {
    if (completionPercentage >= 100) return { name: 'Elite Partner', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500', level: 3, benefits: ['Priority Bidding', 'Verified Badge', 'Fee Reduction'] };
    if (completionPercentage >= 60) return { name: 'Verified Pro', icon: ShieldCheck, color: 'text-primary-600', bg: 'bg-primary-600', level: 2, benefits: ['Smart Matching', 'Custom Proposals'] };
    return { name: 'Basic Talent', icon: User, color: 'text-gray-500', bg: 'bg-gray-500', level: 1, benefits: ['Standard Features'] };
  }, [completionPercentage]);

  const handleEdit = (field) => {
    setEditingField(field.id);
    setFormData({ [field.id]: field.value });
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({});
  };

  const handleSave = async (field) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setEditingField(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving field:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderFieldInput = (field) => {
    const isEditing = editingField === field.id;
    const value = isEditing ? (formData[field.id] ?? field.value) : field.value;

    if (!isEditing) {
      return (
        <div className="flex items-center justify-between p-3.5 bg-white/40 rounded-2xl border border-white/60 hover:border-primary-300 hover:bg-white transition-all group shadow-sm backdrop-blur-sm">
          <span className="text-sm text-gray-700 flex-1 truncate font-medium">
            {value || <span className="text-gray-400 font-normal italic">{field.placeholder}</span>}
          </span>
          <button
            onClick={() => handleEdit(field)}
            className="ml-2 p-2 rounded-xl text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all opacity-0 group-hover:opacity-100"
          >
            <Edit2 size={12} />
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        {field.id === 'photoURL' ? (
          <div className="flex items-center gap-4 p-4 bg-white/60 rounded-3xl border border-white/80 shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-400 border-2 border-primary-100 overflow-hidden shadow-sm">
              {value ? <img src={value} className="w-full h-full object-cover" /> : <Upload size={24} />}
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              placeholder="Paste photo URL"
              className="flex-1 px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none text-sm transition-all shadow-sm"
            />
          </div>
        ) : field.type === 'textarea' ? (
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-sm shadow-inner min-h-[120px] transition-all"
            />
            <div className="absolute bottom-4 right-5 text-[10px] font-bold text-gray-400 bg-gray-50/80 px-2 py-1 rounded-full uppercase">
              {value?.length || 0} Chars
            </div>
          </div>
        ) : field.type === 'select' ? (
          <div className="grid grid-cols-1 gap-2.5">
            {field.options?.map(opt => {
              const OptIcon = opt.icon;
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, [field.id]: opt.value })}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isSelected
                      ? 'border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10'
                      : 'border-gray-100 bg-white hover:border-primary-200'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                    <OptIcon size={18} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-black ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{opt.value}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{opt.desc}</p>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="ml-auto text-primary-500" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="relative group">
            <input
              type={field.type}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-sm shadow-sm transition-all"
            />
            {field.type === 'number' && (
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-primary-600 font-black text-xs uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-lg">INR</span>
            )}
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <Button size="sm" onClick={() => handleSave(field)} isLoading={saving} className="flex-1 rounded-2xl shadow-lg shadow-primary-500/10">Save Configuration</Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} className="rounded-2xl">Cancel</Button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop with extreme blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-950/70 backdrop-blur-2xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative bg-white/70 backdrop-blur-[40px] rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-white/60"
        >
          {/* Dashboard/Left Column */}
          <div className="w-full md:w-[340px] bg-gradient-to-br from-gray-950 via-gray-900 to-black p-10 text-white flex flex-col">
            <div className="mb-10">
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary-600/30">X</div>
                <button onClick={onClose} className="p-2.5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Profile Intel</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">System Optimization Engine v2.0</p>
            </div>

            {/* Premium Progress Visual */}
            <div className="relative w-52 h-52 mx-auto mb-12 group">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                <motion.circle
                  cx="104"
                  cy="104"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 92}
                  initial={{ strokeDashoffset: 2 * Math.PI * 92 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 92 * (1 - completionPercentage / 100) }}
                  className={`${tier.color} drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter">{completionPercentage}%</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Efficiency</span>
              </div>
            </div>

            {/* Tier Roadmap */}
            <div className="space-y-6 flex-1">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-primary-500/30 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl ${tier.bg} bg-opacity-20 shadow-inner`}>
                    <tier.icon size={22} className={tier.color} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Current Tier</p>
                    <p className={`text-base font-black ${tier.color}`}>{tier.name}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Benefits</p>
                  <div className="grid grid-cols-1 gap-2">
                    {tier.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-300">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Platform Roadmap</p>
                <div className="space-y-4">
                  {[
                    { l: 'Basic', c: 'text-gray-500', done: true },
                    { l: 'Verified', c: completionPercentage >= 60 ? 'text-primary-500' : 'text-gray-700', done: completionPercentage >= 60 },
                    { l: 'Elite', c: completionPercentage >= 100 ? 'text-amber-500' : 'text-gray-700', done: completionPercentage >= 100 }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${step.done ? step.c.replace('text', 'bg') : 'bg-gray-800'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${step.c}`}>{step.l} Access</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 mt-10 border-t border-white/10">
              <div className="flex items-center gap-4 text-gray-500 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                <ShieldCheck size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest">Secured Core</span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">Identity Encryption Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form UI */}
          <div className="flex-1 p-10 md:p-14 max-h-[90vh] overflow-y-auto bg-white/40">
            <div className="mb-14">
              <div className="inline-block px-3 py-1 bg-primary-100/50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-200">System Configuration</div>
              <h3 className="text-4xl font-black text-gray-950 tracking-tight mb-3">Refine Professional Identity</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] opacity-70">Execute parameters to reach peak platform ranking.</p>
            </div>

            {/* Categorized Fields */}
            {['Basic', 'Professional', 'Expert'].map((cat) => {
              const fields = profileFields.filter(f => f.category === cat);
              if (fields.length === 0) return null;

              return (
                <div key={cat} className="mb-14 last:mb-0">
                  <h4 className="flex items-center gap-3 text-[11px] font-black text-primary-600 uppercase tracking-[0.3em] mb-8">
                    <div className="w-10 h-[3px] bg-primary-600 rounded-full" />
                    {cat} Intelligence
                  </h4>
                  <div className="space-y-6">
                    {fields.map((field) => {
                      const Icon = field.icon;
                      const isFieldEditing = editingField === field.id;
                      return (
                        <div key={field.id} className={`group relative p-7 rounded-[2.5rem] border-2 transition-all duration-500 ${field.completed && !isFieldEditing
                            ? 'bg-emerald-50/40 border-emerald-100/60 shadow-sm'
                            : isFieldEditing
                              ? 'bg-white border-primary-200 shadow-2xl scale-[1.02] z-10'
                              : 'bg-white/40 border-white/80 shadow-sm hover:border-primary-100 hover:bg-white'
                          }`}>
                          <div className="flex items-start gap-6">
                            <div className={`p-4 rounded-3xl ${field.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} transition-all duration-500 group-hover:scale-110 shadow-sm`}>
                              <Icon size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-3">
                                <label className="text-[11px] font-black text-gray-950 uppercase tracking-[0.2em]">{field.label}</label>
                                {field.completed && <CheckCircle2 size={18} className="text-emerald-500 animate-in zoom-in duration-300" />}
                              </div>
                              {renderFieldInput(field)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Done Action */}
            <div className="pt-12 flex justify-between items-center">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest italic">All changes are localized to your session</p>
              <Button onClick={onClose} size="lg" className="px-12 py-4 rounded-3xl shadow-xl shadow-primary-500/20 font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-[0.98] transition-all">
                Finalize Configuration
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileCompletionModal;
