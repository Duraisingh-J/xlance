import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { Card, Button, Input } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/user_services';

const Onboarding = () => {
  const { user, userProfile, refreshUserProfile, applyMockProfileUpdate } = useAuth();
  const navigate = useNavigate();

  const [roleChoice, setRoleChoice] = useState('');
  const [freelancer, setFreelancer] = useState({ headline: '', skills: '', yearsExperience: '' });
  const [client, setClient] = useState({ companyType: 'individual', companyName: '', hiringNeeds: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (userProfile && userProfile.onboardingCompleted) {
      // redirect based on roles
      const roles = userProfile.role || [];
      if (roles.includes('freelancer') && !roles.includes('client')) navigate('/freelancer/dashboard');
      else if (roles.includes('client') && !roles.includes('freelancer')) navigate('/client/dashboard');
      else if (roles.includes('client') && roles.includes('freelancer')) navigate('/freelancer/dashboard');
    }
  }, [user, userProfile, navigate]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Not signed in</div>;

  const onSubmit = async () => {
    if (!roleChoice) return alert('Please select a role');
    setIsSaving(true);
    const rolesArr = roleChoice === 'both' ? ['client', 'freelancer'] : [roleChoice];

    const data = {
      role: rolesArr,
      onboardingCompleted: true,
    };

    if (rolesArr.includes('freelancer')) {
      data.freelancerProfile = {
        headline: freelancer.headline,
        skills: freelancer.skills,
        yearsExperience: Number(freelancer.yearsExperience) || 0,
      };
    }

    if (rolesArr.includes('client')) {
      data.clientProfile = {
        companyType: client.companyType,
        companyName: client.companyName,
        hiringNeeds: client.hiringNeeds,
      };
    }

    try {
      // add a timeout to avoid hanging if Firestore is slow/offline
      const updatePromise = updateUserProfile(user.uid, data);
      const timeoutMs = 6000;
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), timeoutMs));
      const res = await Promise.race([updatePromise, timeoutPromise]);

      if (res === 'timeout') {
        console.warn('updateUserProfile timed out; applying profile in-memory and continuing');
        applyMockProfileUpdate(data);
      } else if (res === false || user?.uid?.toString().startsWith('mock')) {
        // Firestore reported unavailable or we are using a mock user
        applyMockProfileUpdate(data);
      } else if (refreshUserProfile) {
        await refreshUserProfile();
      }

      // redirect
      if (rolesArr.length === 1 && rolesArr[0] === 'client') navigate('/client/dashboard');
      else navigate('/freelancer/dashboard');
    } catch (err) {
      console.error(err);
      // As a last resort, apply locally and navigate so the user is not blocked
      try { applyMockProfileUpdate(data); } catch (e) { /* ignore */ }
      if (rolesArr.length === 1 && rolesArr[0] === 'client') navigate('/client/dashboard');
      else navigate('/freelancer/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    try {
      if (window && window.history && window.history.length > 1) navigate(-1);
      else navigate('/auth/signup');
    } catch (e) {
      navigate('/auth/signup');
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-1">Welcome to Xlance</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us how you want to use Xlance and we’ll customise your experience.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button type="button" onClick={() => setRoleChoice('client')} className={`p-4 rounded-lg border ${roleChoice === 'client' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <div className="font-semibold">Hire Freelancers</div>
                <div className="text-sm text-gray-600">Find and hire top talent</div>
              </button>

              <button type="button" onClick={() => setRoleChoice('freelancer')} className={`p-4 rounded-lg border ${roleChoice === 'freelancer' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <div className="font-semibold">Work as a Freelancer</div>
                <div className="text-sm text-gray-600">Find projects and clients</div>
              </button>

              <button type="button" onClick={() => setRoleChoice('both')} className={`p-4 rounded-lg border ${roleChoice === 'both' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <div className="font-semibold">Both</div>
                <div className="text-sm text-gray-600">Hire and work on projects</div>
              </button>
            </div>

            { (roleChoice === 'freelancer' || roleChoice === 'both') && (
              <section className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Freelancer Details</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Input label="Headline" value={freelancer.headline} onChange={(e) => setFreelancer(s => ({ ...s, headline: e.target.value }))} />
                  <Input label="Skills (comma separated)" value={freelancer.skills} onChange={(e) => setFreelancer(s => ({ ...s, skills: e.target.value }))} />
                  <Input label="Years of Experience" type="number" value={freelancer.yearsExperience} onChange={(e) => setFreelancer(s => ({ ...s, yearsExperience: e.target.value }))} />
                </div>
              </section>
            )}

            { (roleChoice === 'client' || roleChoice === 'both') && (
              <section className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Client Details</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="inline-flex items-center mr-4"><input type="radio" name="companyType" value="individual" checked={client.companyType === 'individual'} onChange={() => setClient(c => ({ ...c, companyType: 'individual' }))} /> <span className="ml-2">Individual</span></label>
                    <label className="inline-flex items-center ml-4"><input type="radio" name="companyType" value="company" checked={client.companyType === 'company'} onChange={() => setClient(c => ({ ...c, companyType: 'company' }))} /> <span className="ml-2">Company</span></label>
                  </div>
                  <Input label="Company Name (optional)" value={client.companyName} onChange={(e) => setClient(s => ({ ...s, companyName: e.target.value }))} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Needs</label>
                    <textarea value={client.hiringNeeds} onChange={(e) => setClient(s => ({ ...s, hiringNeeds: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary-500" rows={4} />
                  </div>
                </div>
              </section>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={handleBack}>Back</Button>
              <Button onClick={onSubmit} isLoading={isSaving} disabled={!roleChoice}>{isSaving ? 'Saving...' : 'Continue'}</Button>
            </div>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default Onboarding;
