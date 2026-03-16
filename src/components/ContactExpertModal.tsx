import { useEffect, useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const US_STATES = [
  'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida',
  'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Mariana Islands', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Palau',
  'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

const CANADA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland/Labrador', 'Nova Scotia', 'Northwest Territory', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon Territory',
];

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  state: string;
  optin: boolean;
}

interface ContactExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  title?: string;
  subtitle?: string;
}

export function ContactExpertModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Talk to an Expert',
  subtitle = 'Let us help you on your sovereignty journey',
}: ContactExpertModalProps) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [optin, setOptin] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setCountry('');
      setState('');
      setOptin(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optin) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      country,
      state,
      optin,
    });
  };

  const requiresState = country === 'United States' || country === 'Canada';
  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    company.trim() &&
    country &&
    (!requiresState || state) &&
    optin;

  if (!isOpen) return null;

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#30ba78] focus:border-[#30ba78] transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-expert-title"
    >
      <div
        className="glass rounded-2xl neon-border-cyan max-w-lg w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-7 h-7" style={{ color: '#30ba78' }} />
            <div>
              <h2 id="contact-expert-title" className="font-orbitron font-bold text-lg" style={{ color: '#30ba78' }}>
                {title}
              </h2>
              <p className="text-white/60 text-sm">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-firstName" className="block text-sm font-medium text-white/80 mb-1.5">
                First Name <span className="text-[#fe7c3f]">*</span>
              </label>
              <input
                type="text"
                id="contact-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="contact-lastName" className="block text-sm font-medium text-white/80 mb-1.5">
                Last Name <span className="text-[#fe7c3f]">*</span>
              </label>
              <input
                type="text"
                id="contact-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-white/80 mb-1.5">
                Email <span className="text-[#fe7c3f]">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
                placeholder="john.doe@company.com"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-white/80 mb-1.5">
                Phone <span className="text-[#fe7c3f]">*</span>
              </label>
              <input
                type="tel"
                id="contact-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-sm font-medium text-white/80 mb-1.5">
              Company <span className="text-[#fe7c3f]">*</span>
            </label>
            <input
              type="text"
              id="contact-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className={inputClass}
              style={inputStyle}
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="contact-country" className="block text-sm font-medium text-white/80 mb-1.5">
              Country <span className="text-[#fe7c3f]">*</span>
            </label>
            <select
              id="contact-country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setState('');
              }}
              required
              className={inputClass}
              style={inputStyle}
            >
              <option value="" style={{ background: '#0f3d34' }}>Select a country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} style={{ background: '#0f3d34' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(country === 'United States' || country === 'Canada') && (
            <div>
              <label htmlFor="contact-state" className="block text-sm font-medium text-white/80 mb-1.5">
                {country === 'Canada' ? 'Province' : 'State'} <span className="text-[#fe7c3f]">*</span>
              </label>
              <select
                id="contact-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
              >
                <option value="" style={{ background: '#0f3d34' }}>
                  Select a {country === 'Canada' ? 'province' : 'state'}
                </option>
                {(country === 'Canada' ? CANADA_PROVINCES : US_STATES).map((s) => (
                  <option key={s} value={s} style={{ background: '#0f3d34' }}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={optin}
                onChange={(e) => setOptin(e.target.checked)}
                required
                className="mt-1 w-5 h-5 accent-[#30ba78] rounded"
              />
              <span className="text-sm text-white/70 leading-relaxed">
                Yes, I consent to receive information from SUSE about products, services, and events.
                I understand my data will be processed per SUSE&apos;s{' '}
                <a
                  href="https://www.suse.com/company/legal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#30ba78] hover:underline"
                >
                  Privacy Policy
                </a>
                . <span className="text-[#fe7c3f]">*</span>
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 py-2.5 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'rgba(48,186,120,0.15)', border: '1px solid rgba(48,186,120,0.5)', color: '#30ba78' }}
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
