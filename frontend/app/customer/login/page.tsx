import React, { useState } from 'react';
import { auth } from '../../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function CustomerLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
        }, auth);
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmation(confirmationResult);
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await confirmation.confirm(otp);
    } catch (err: any) {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Customer Login / Register</h2>
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <input
            type="tel"
            placeholder="Phone number (e.g. +234...)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <div id="recaptcha-container"></div>
          <button type="submit" className="btn btn-primary w-full">Send OTP</button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full">Verify OTP</button>
        </form>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 