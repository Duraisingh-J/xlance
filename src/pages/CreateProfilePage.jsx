import React, { useState } from 'react';
import { Card, Button, Input } from '../components/common';
import PageTransition from '../components/common/PageTransition';

const states = ['Select a state', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi'];

const CreateProfilePage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    headline: '',
    skills: '',
    summary: '',
    state: states[0],
    address: '',
    language: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: hook up API to save profile
    await new Promise((r) => setTimeout(r, 800));
    console.log('Profile saved', form);
    setIsSaving(false);
    alert('Profile saved (stub).');
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-1">Create your Freelancer Profile</h2>
            <p className="text-sm text-gray-500 mb-6">This information will be displayed on your public profile.</p>

            <form onSubmit={handleSave} className="space-y-6">
              <section>
                <h3 className="font-medium text-gray-900 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
                  <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91  000 000 0000" />

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border">
                      {photoPreview ? (
                        <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400">No photo</div>
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-2">
                        <input type="file" accept="image/*" onChange={handleFile} />
                        <span className="text-sm text-gray-600">Upload</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1">Recommended size: 400x400px</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Professional Headline" name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Senior Web Developer" />
                  <Input label="Skills, Verification Badges" name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. HTML, CSS, JavaScript, React" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary / About You</label>
                    <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary-500" rows={5} placeholder="Write about yourself..."></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200">
                        {states.map((s, i) => (
                          <option key={i} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                  </div>

                  <Input label="Language" name="language" value={form.language} onChange={handleChange} placeholder="e.g. English, Spanish" />
                </div>
              </section>

              <div className="flex justify-end gap-4">
                <Button variant="secondary">Cancel</Button>
                <Button type="submit" isLoading={isSaving}>Save Profile</Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default CreateProfilePage;
