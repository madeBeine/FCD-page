import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Save, Eye, EyeOff, ArrowUp, ArrowDown, Plus, Trash2, Layout, Type, Image as ImageIcon, Video, Link as LinkIcon, Settings, ChevronRight, Upload } from 'lucide-react';

export const AdminDashboard = () => {
  const { config, updateContent, toggleSectionVisibility, moveSection } = useConfig();
  const [activeTab, setActiveTab] = useState<'content' | 'layout'>('content');
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [activeSection, setActiveSection] = useState<string>('navbar');

  const sections = Object.keys(config.content.ar);

  const handleTextChange = (section: string, key: string, value: string) => {
    updateContent(activeLang, section, key, value);
    
    // Sync images and links across all languages
    const sharedKeys = ['logoImage', 'faviconUrl', 'tabletImage', 'phoneImage', 'ios', 'android'];
    if (sharedKeys.includes(key)) {
      (['ar', 'en', 'fr'] as const).forEach(lang => {
        if (lang !== activeLang) {
          updateContent(lang, section, key, value);
        }
      });
    }
  };

  const handleObjectChange = (section: string, key: string, subKey: string, value: string, currentObj: any) => {
    const newObj = { ...currentObj, [subKey]: value };
    updateContent(activeLang, section, key, newObj);
    
    const sharedSubKeys = ['ios', 'android'];
    if (sharedSubKeys.includes(subKey)) {
      (['ar', 'en', 'fr'] as const).forEach(lang => {
        if (lang !== activeLang) {
          const langObj = config.content[lang][section as keyof typeof config.content.ar][key as any] || {};
          updateContent(lang, section, key, { ...langObj, [subKey]: value });
        }
      });
    }
  };

  const handleArrayChange = (section: string, key: string, index: number, subKey: string | null, value: any, currentArray: any[]) => {
    const newArray = [...currentArray];
    if (subKey === null) {
      newArray[index] = value;
    } else {
      newArray[index] = { ...newArray[index], [subKey]: value };
    }
    updateContent(activeLang, section, key, newArray);
    
    // Sync shared fields across other languages
    const sharedArrayKeys = ['logo', 'url', 'videoUrl', 'videoThumbnail', 'icon', 'name', 'isVisible', 'colorClass', 'position', 'iconText'];
    if (subKey === null || sharedArrayKeys.includes(subKey)) {
      (['ar', 'en', 'fr'] as const).forEach(lang => {
        if (lang !== activeLang) {
          const langArray = [...(config.content[lang][section as keyof typeof config.content.ar][key as any] || [])];
          if (langArray[index]) {
            if (subKey === null) {
              langArray[index] = value;
            } else {
              langArray[index] = { ...langArray[index], [subKey]: value };
            }
            updateContent(lang, section, key, langArray);
          }
        }
      });
    }
  };

  const getArrayTemplate = (section: string, key: string) => {
    if (section === 'faq' && key === 'items') return { question: '', answer: '', isVisible: true };
    if (section === 'services' && key === 'items') return { title: '', description: '', icon: '', isVisible: true };
    if (section === 'howItWorks' && key === 'steps') return { title: '', description: '', videoUrl: '', isVisible: true };
    if (section === 'storeWall' && key === 'stores') return { name: '', logo: '', url: '', isVisible: true };
    if (section === 'navbar' && key === 'links') return { id: '', label: '', isVisible: true };
    if (section === 'academy' && key === 'tutorials') return { title: '', description: '', videoThumbnail: '', videoUrl: '', isVisible: true };
    if (section === 'hero' && key === 'floatingBadges') return { id: `badge-${Date.now()}`, iconText: 'A', title: 'New Badge', subtitle: 'Subtitle', colorClass: 'bg-brand-blue', position: 'left', isVisible: true };
    return ''; // Default for strings like images
  };

  const handleAddArrayItem = (section: string, key: string, currentArray: any[]) => {
    const template = getArrayTemplate(section, key);
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      const langArray = config.content[lang][section as keyof typeof config.content.ar][key as any] || [];
      updateContent(lang, section, key, [...langArray, template]);
    });
  };

  const handleRemoveArrayItem = (section: string, key: string, index: number, currentArray: any[]) => {
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      const langArray = config.content[lang][section as keyof typeof config.content.ar][key as any] || [];
      const newArray = langArray.filter((_: any, i: number) => i !== index);
      updateContent(lang, section, key, newArray);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void, isLogo: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isVideo) {
        onChange(reader.result as string);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 1200;

        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Remove white background if it's a logo
        if (isLogo) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // If pixel is close to white, make it transparent
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0; // Set alpha to 0
            }
          }
          ctx.putImageData(imageData, 0, 0);
          // Save as PNG to preserve transparency
          const transparentBase64 = canvas.toDataURL('image/png');
          onChange(transparentBase64);
          return;
        }
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onChange(compressedBase64);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderInput = (value: string, onChange: (val: string) => void, label: string, parentKey?: string) => {
    const isLogo = label.toLowerCase().includes('logo') || label.toLowerCase().includes('favicon');
    const isImage = isLogo || label.toLowerCase().includes('image') || label.toLowerCase().includes('thumbnail') || parentKey?.toLowerCase().includes('image');
    const isLink = label.toLowerCase().includes('url') || label.toLowerCase().includes('link');
    
    // If it's in the academy section and it's a videoUrl, treat it as a link, not a video upload
    const isAcademyVideoUrl = activeSection === 'academy' && label === 'videoUrl';
    const isVideo = (label.toLowerCase().includes('video') || parentKey?.toLowerCase().includes('video')) && !isImage && !isAcademyVideoUrl;
    
    const isLongText = (value || '').length > 60 || label.toLowerCase().includes('description') || label.toLowerCase().includes('answer');

    return (
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5 capitalize">
          {isImage && <ImageIcon size={14} className="text-brand-blue" />}
          {isVideo && <Video size={14} className="text-brand-orange" />}
          {isLink && <LinkIcon size={14} className="text-slate-400" />}
          {!isImage && !isVideo && !isLink && <Type size={14} className="text-slate-400" />}
          {label.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        
        {isImage || isVideo ? (
          <div className="flex flex-col gap-3">
            {value ? (
              <div className="relative inline-block border border-slate-200 rounded-xl p-2 bg-slate-50 w-fit">
                {isImage ? (
                  <img src={value} alt="Preview" className="h-32 object-contain rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <video src={value} className="h-32 object-contain rounded-lg" controls />
                )}
                <label className="absolute -bottom-3 -right-3 bg-brand-blue text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-brand-blue/90 transition-colors">
                  <Upload size={16} />
                  <input 
                    type="file" 
                    accept={isImage ? "image/*" : "video/*"} 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, onChange, isLogo)}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 hover:border-brand-blue transition-colors cursor-pointer">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">Click to upload {isImage ? 'image' : 'video'}</span>
                <input 
                  type="file" 
                  accept={isImage ? "image/*" : "video/*"} 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, onChange, isLogo)}
                />
              </label>
            )}
          </div>
        ) : isLongText ? (
          <textarea
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all text-sm bg-slate-50 focus:bg-white"
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            dir={activeLang === 'ar' && !isLink ? 'rtl' : 'ltr'}
          />
        ) : (
          <input
            type="text"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all text-sm bg-slate-50 focus:bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            dir={activeLang === 'ar' && !isLink ? 'rtl' : 'ltr'}
          />
        )}
      </div>
    );
  };

  const renderContentEditor = () => {
    const sectionData = config.content[activeLang][activeSection as keyof typeof config.content.ar];
    if (!sectionData) return null;

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize flex items-center gap-2">
            <Settings className="text-brand-blue" />
            {activeSection.replace(/([A-Z])/g, ' $1').trim()} Settings
          </h2>
          
          <div className="space-y-6">
            {Object.entries(sectionData).map(([key, value]) => {
              if (typeof value === 'string') {
                return <div key={key}>{renderInput(value, (val) => handleTextChange(activeSection, key, val), key)}</div>;
              } 
              
              if (Array.isArray(value)) {
                return (
                  <div key={key} className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-lg font-bold text-slate-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <button 
                        onClick={() => handleAddArrayItem(activeSection, key, value)}
                        className="flex items-center gap-1 text-sm bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {value.map((item, index) => (
                        <div key={index} className={`relative p-5 bg-slate-50 border border-slate-200 rounded-xl group hover:border-brand-blue/30 transition-colors ${item.isVisible === false ? 'opacity-60 grayscale' : ''}`}>
                          <button 
                            onClick={() => handleRemoveArrayItem(activeSection, key, index, value)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          {typeof item === 'object' && item !== null && (
                            <button 
                              onClick={() => handleArrayChange(activeSection, key, index, 'isVisible', item.isVisible === false ? true : false, value)}
                              className={`absolute top-4 right-12 p-1.5 rounded-lg transition-colors ${item.isVisible === false ? 'text-slate-500' : 'text-slate-400'} hover:text-brand-blue hover:bg-brand-blue/10`}
                              title={item.isVisible !== false ? "Hide item" : "Show item"}
                            >
                              {item.isVisible !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          )}
                          
                          <div className="pr-16">
                            {typeof item === 'string' ? (
                              renderInput(item, (val) => handleArrayChange(activeSection, key, index, null, val, value), `Item ${index + 1}`, key)
                            ) : (
                              <div className="grid grid-cols-1 gap-4">
                                {Object.entries(item).map(([subKey, subValue]) => {
                                  if (subKey === 'isVisible' || subKey === 'id') return null;
                                  return (
                                    <div key={subKey}>
                                      {renderInput(subValue as string, (val) => handleArrayChange(activeSection, key, index, subKey, val, value), subKey, key)}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {value.length === 0 && (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          No items added yet. Click "Add Item" to start.
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="pt-4 border-t border-slate-100">
                    <label className="text-lg font-bold text-slate-800 capitalize mb-4 block">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 gap-4">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey}>
                          {renderInput(subValue as string, (val) => handleObjectChange(activeSection, key, subKey, val, value), subKey, key)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutEditor = () => {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Layout className="text-brand-blue" />
          Sections Visibility & Order
        </h2>
        <p className="text-slate-500 mb-8">Control which sections appear on the homepage and in what order.</p>
        
        <div className="space-y-3">
          {config.sections.map((section, index) => (
            <div key={section.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${section.isVisible ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === config.sections.length - 1}
                    className="p-1 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
                <div>
                  <span className="font-bold capitalize text-slate-800 block text-lg">{section.id.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs font-medium text-slate-500">Position: {index + 1}</span>
                </div>
              </div>
              
              <button
                onClick={() => toggleSectionVisibility(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${section.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
              >
                {section.isVisible ? (
                  <><Eye size={18} /> Visible</>
                ) : (
                  <><EyeOff size={18} /> Hidden</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Control Panel</h1>
            <p className="text-slate-500 mt-1">Manage your website content and layout easily.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium">
              <Save size={16} /> Auto-saved
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex">
              <button
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'content' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'layout' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('layout')}
              >
                Layout
              </button>
            </div>

            {/* Content Navigation (Only show if Content tab is active) */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
                  <button
                    className={`flex-1 py-1.5 rounded-lg font-medium text-sm transition-colors ${activeLang === 'ar' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setActiveLang('ar')}
                  >
                    العربية
                  </button>
                  <button
                    className={`flex-1 py-1.5 rounded-lg font-medium text-sm transition-colors ${activeLang === 'en' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setActiveLang('en')}
                  >
                    English
                  </button>
                  <button
                    className={`flex-1 py-1.5 rounded-lg font-medium text-sm transition-colors ${activeLang === 'fr' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setActiveLang('fr')}
                  >
                    Français
                  </button>
                </div>
                <div className="p-2 space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${activeSection === section ? 'bg-brand-blue/10 text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                    >
                      <span className="capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {activeSection === section && <ChevronRight size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Editor Area */}
          <div className="flex-1">
            {activeTab === 'content' ? renderContentEditor() : renderLayoutEditor()}
          </div>

        </div>
      </div>
    </div>
  );
};
