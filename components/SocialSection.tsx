
import React from 'react';
import { AdminSettings } from '../types';

interface Props {
  settings: AdminSettings;
}

const SocialSection: React.FC<Props> = ({ settings }) => {
  const hasSocial = settings.instagramUrl || settings.facebookUrl || settings.tiktokUrl;

  if (!hasSocial) return null;

  return (
    <section className="mt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-white rounded-[3rem] p-12 text-center border border-pink-100 shadow-sm">
        <h2 className="text-4xl font-serif text-pink-900 mb-4">Nuestras Redes</h2>
        <p className="text-pink-400 font-medium mb-12 max-w-md mx-auto">Síguenos para no perderte las últimas tendencias y promociones exclusivas.</p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {settings.instagramUrl && (
            <a 
              href={settings.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-pink-900 opacity-60 group-hover:opacity-100 transition-opacity">Instagram</span>
            </a>
          )}

          {settings.facebookUrl && (
            <a 
              href={settings.facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-[#1877F2] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-900 opacity-60 group-hover:opacity-100 transition-opacity">Facebook</span>
            </a>
          )}

          {settings.tiktokUrl && (
            <a 
              href={settings.tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-black flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.09.68.04 1.4.39 2.01.46.79 1.34 1.28 2.25 1.31.88 0 1.75-.41 2.27-1.12.37-.51.52-1.14.53-1.77.05-3.41-.01-6.82.02-10.23.01-.11.02-.22.02-.34z"/>
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-900 opacity-60 group-hover:opacity-100 transition-opacity">TikTok</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
