
import React from 'react';
import { Heart, Shield } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 border-b-2 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">MedAssist AI</h1>
            <p className="text-blue-100 text-sm">Multi-Agent Medical Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-200" />
          <span className="text-sm text-blue-100">Secure & Confidential</span>
        </div>
      </div>
      <div className="mt-4 bg-white/10 rounded-lg p-3">
        <p className="text-sm text-blue-100 leading-relaxed">
          🏥 Professional medical guidance at your fingertips. Please note: This AI assistant provides general health information and should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Header;
