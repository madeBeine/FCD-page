import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Save, Eye, EyeOff, ArrowUp, ArrowDown, Plus, Trash2, Layout, Type, Image as ImageIcon, Video, Link as LinkIcon, Settings, ChevronRight, Upload, XCircle, BarChart3, Users, Smartphone, Globe, Clock, Download, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../lib/supabase';

export const AdminDashboard = () => {
  const { config, updateContent, updateAdminCode, toggleSectionVisibility, moveSection, hasUnsavedChanges, saveConfig, discardChanges, showNotification } = useConfig();
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'analytics' | 'logs'>('content');
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [activeSection, setActiveSection] = useState<string>('navbar');
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'logs') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      let dbVisits: any[] = [];
      let dbEvents: any[] = [];
      
      if (supabase) {
        const [visitsRes, eventsRes] = await Promise.all([
          supabase.from('analytics').select('*').order('created_at', { ascending: false }).limit(1000),
          supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(1000)
        ]);
          
        if (!visitsRes.error && visitsRes.data) {
          dbVisits = visitsRes.data;
        }
        if (!eventsRes.error && eventsRes.data) {
          dbEvents = eventsRes.data;
        }
      }

      // Merge with local data to ensure we always have something to show
      const localVisits = JSON.parse(localStorage.getItem('mock_analytics') || '[]');
      const localEvents = JSON.parse(localStorage.getItem('mock_analytics_events') || '[]');

      // Use a Map to deduplicate by created_at (approximate)
      const mergedVisits = [...dbVisits];
      const dbTimestamps = new Set(dbVisits.map(v => v.created_at));
      localVisits.forEach((v: any) => {
        if (!dbTimestamps.has(v.created_at)) mergedVisits.push(v);
      });

      const mergedEvents = [...dbEvents];
      const dbEventTimestamps = new Set(dbEvents.map(e => e.created_at));
      localEvents.forEach((e: any) => {
        if (!dbEventTimestamps.has(e.created_at)) mergedEvents.push(e);
      });

      setAnalyticsData(mergedVisits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setAnalyticsEvents(mergedEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      console.error('Fetch analytics failed:', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

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
    const sharedArrayKeys = ['logo', 'url', 'videoUrl', 'imageUrl', 'linkUrl', 'mediaType', 'videoThumbnail', 'icon', 'name', 'isVisible', 'colorClass', 'position', 'iconText', 'rating', 'packageImage'];
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
    if (section === 'howItWorks' && key === 'steps') return { title: '', description: '', videoUrl: '', imageUrl: '', linkUrl: '', mediaType: 'video', isVisible: true };
    if (section === 'storeWall' && key === 'stores') return { name: '', logo: '', url: '', isVisible: true };
    if (section === 'navbar' && key === 'links') return { id: '', label: '', isVisible: true };
    if (section === 'academy' && key === 'tutorials') return { title: '', description: '', videoThumbnail: '', videoUrl: '', isVisible: true };
    if (section === 'hero' && key === 'floatingBadges') return { id: `badge-${Date.now()}`, iconText: 'A', title: 'New Badge', subtitle: 'Subtitle', colorClass: 'bg-brand-blue', position: 'left', isVisible: true };
    if (section === 'testimonials' && key === 'reviews') return { id: `rev-${Date.now()}`, name: '', rating: 5, text: '', date: '', packageImage: '', isVisible: true };
    return ''; // Default for strings like images
  };

  const handleAddArrayItem = (section: string, key: string, currentArray: any[]) => {
    const template = getArrayTemplate(section, key);
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      const langArray = config.content[lang][section as keyof typeof config.content.ar][key as any] || [];
      updateContent(lang, section, key, [...langArray, template]);
    });
    showNotification(config.language === 'ar' ? 'تمت الإضافة' : 'Item added', 'success');
  };

  const handleRemoveArrayItem = (section: string, key: string, index: number, currentArray: any[]) => {
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      const langArray = config.content[lang][section as keyof typeof config.content.ar][key as any] || [];
      const newArray = langArray.filter((_: any, i: number) => i !== index);
      updateContent(lang, section, key, newArray);
    });
    showNotification(config.language === 'ar' ? 'تم الحذف' : 'Item removed', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void, isLogo: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      showNotification(config.language === 'ar' ? 'جاري معالجة الفيديو...' : 'Processing video...', 'info');
      if (!window.MediaRecorder) {
        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        video.play().then(() => {
          let animationFrameId: number;
          const drawFrame = () => {
            if (ctx && !video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            animationFrameId = requestAnimationFrame(drawFrame);
          };
          drawFrame();

          const stream = canvas.captureStream(30);
          
          let mimeType = '';
          if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            mimeType = 'video/webm;codecs=vp9';
          } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            mimeType = 'video/webm;codecs=vp8';
          } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            mimeType = 'video/mp4';
          }

          const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
          const chunks: BlobPart[] = [];

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            cancelAnimationFrame(animationFrameId);
            const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              onChange(reader.result as string);
              video.pause();
              video.src = '';
              showNotification(config.language === 'ar' ? 'تمت معالجة الفيديو بنجاح' : 'Video processed successfully', 'success');
            };
            stream.getTracks().forEach(t => t.stop());
            reader.readAsDataURL(blob);
          };

          recorder.start();

          const durationToRecord = Math.min(video.duration * 1000, 5000);
          
          setTimeout(() => {
            if (recorder.state === 'recording') {
              recorder.stop();
            }
          }, durationToRecord);

          video.onended = () => {
            if (recorder.state === 'recording') {
              recorder.stop();
            }
          };
        }).catch(err => {
          console.error("Video play error:", err);
          const reader = new FileReader();
          reader.onloadend = () => onChange(reader.result as string);
          reader.readAsDataURL(file);
        });
      };
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
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
          showNotification(config.language === 'ar' ? 'تم رفع الشعار بنجاح' : 'Logo uploaded successfully', 'success');
          return;
        }
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onChange(compressedBase64);
        showNotification(config.language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully', 'success');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderInput = (value: string, onChange: (val: string) => void, label: string, parentKey?: string) => {
    if (label === 'mediaType') {
      return (
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5 capitalize">
            Media Type
          </label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all text-sm bg-slate-50 focus:bg-white"
            value={value || 'video'}
            onChange={(e) => onChange(e.target.value)}
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
          >
            <option value="video">{activeLang === 'ar' ? 'فيديو' : activeLang === 'fr' ? 'Vidéo' : 'Video'}</option>
            <option value="image">{activeLang === 'ar' ? 'صورة' : activeLang === 'fr' ? 'Image' : 'Image'}</option>
          </select>
        </div>
      );
    }

    const isLogo = label.toLowerCase().includes('logo') || label.toLowerCase().includes('favicon');
    const isImage = isLogo || label.toLowerCase().includes('image') || label.toLowerCase().includes('thumbnail') || parentKey?.toLowerCase().includes('image') || label === 'packageImage';
    const isLink = label.toLowerCase().includes('url') || label.toLowerCase().includes('link');
    
    // If it's in the academy section and it's a videoUrl, treat it as a link, not a video upload
    const isAcademyVideoUrl = activeSection === 'academy' && label === 'videoUrl';
    const isVideo = (label.toLowerCase().includes('video') || parentKey?.toLowerCase().includes('video')) && !isImage && !isAcademyVideoUrl;
    
    const isLongText = (typeof value === 'string' ? value : '').length > 60 || label.toLowerCase().includes('description') || label.toLowerCase().includes('answer') || label.toLowerCase().includes('text');

    if (label === 'rating') {
      return (
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5 capitalize">
            <Type size={14} className="text-slate-400" />
            {label.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="number"
            min="1"
            max="5"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all text-sm bg-slate-50 focus:bg-white"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) as any)}
            dir="ltr"
          />
        </div>
      );
    }

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
    if (activeSection === 'settings') {
      return (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize flex items-center gap-2">
              <Settings className="text-brand-blue" />
              إعدادات النظام (System Settings)
            </h2>
            
            <div className="space-y-6">
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5 capitalize">
                  <Type size={14} className="text-slate-400" />
                  كود الدخول لوضع التعديل (Admin Login Code)
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all text-sm bg-slate-50 focus:bg-white font-mono"
                  value={config.adminCode || ''}
                  onChange={(e) => updateAdminCode(e.target.value)}
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-2">
                  هذا هو الكود السري الذي يتم إدخاله في شريط البحث للدخول إلى لوحة التحكم.
                </p>
              </div>
            </div>
          </div>

          {/* Map Cities Editor */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 capitalize flex items-center gap-2">
                <Globe className="text-brand-orange" />
                إعدادات الخريطة (Map Cities)
              </h2>
              <button 
                onClick={() => {
                  const newCities = [...(config.mapCities || [])];
                  newCities.push({ name: "New City", coordinates: [-15.9582, 18.0735], dx: 0, dy: 0, anchor: "start", isBold: false });
                  (useConfig as any)().updateMapCities(newCities);
                }}
                className="flex items-center gap-1 text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Plus size={16} /> إضافة مدينة
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.mapCities || []).map((city: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  <button 
                    onClick={() => {
                      const newCities = config.mapCities.filter((_: any, i: number) => i !== idx);
                      (useConfig as any)().updateMapCities(newCities);
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold"
                      value={city.name}
                      onChange={(e) => {
                        const newCities = [...config.mapCities];
                        newCities[idx] = { ...newCities[idx], name: e.target.value };
                        (useConfig as any)().updateMapCities(newCities);
                      }}
                      placeholder="City Name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Longitude</label>
                        <input 
                          type="number" 
                          step="0.0001"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                          value={city.coordinates[0]}
                          onChange={(e) => {
                            const newCities = [...config.mapCities];
                            newCities[idx].coordinates[0] = parseFloat(e.target.value);
                            (useConfig as any)().updateMapCities(newCities);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Latitude</label>
                        <input 
                          type="number" 
                          step="0.0001"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                          value={city.coordinates[1]}
                          onChange={(e) => {
                            const newCities = [...config.mapCities];
                            newCities[idx].coordinates[1] = parseFloat(e.target.value);
                            (useConfig as any)().updateMapCities(newCities);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={city.isBold}
                          onChange={(e) => {
                            const newCities = [...config.mapCities];
                            newCities[idx] = { ...newCities[idx], isBold: e.target.checked };
                            (useConfig as any)().updateMapCities(newCities);
                          }}
                        />
                        Bold
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

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

  const renderAnalytics = () => {
    if (isLoadingAnalytics) {
      return (
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      );
    }

    if (!analyticsData.length && !analyticsEvents.length) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-500">
          <BarChart3 size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">لا توجد بيانات إحصائية حتى الآن</p>
          <p className="text-sm mt-2">No analytics data available yet.</p>
        </div>
      );
    }

    // Process data for charts
    const visitsByDate = analyticsData.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at).toLocaleDateString('en-US');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(visitsByDate).map(date => ({
      date,
      visits: visitsByDate[date]
    })).reverse(); // Reverse to show chronological order

    const deviceCount = analyticsData.reduce((acc: any, curr: any) => {
      acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
      return acc;
    }, {});

    const COLORS = ['#1a3b8e', '#ff9d3a', '#94a3b8'];
    const pieData = Object.keys(deviceCount).map((key, index) => ({
      name: key,
      value: deviceCount[key],
      color: COLORS[index % COLORS.length]
    }));

    const topDevice = Object.keys(deviceCount).reduce((a, b) => deviceCount[a] > deviceCount[b] ? a : b, 'Unknown');
    
    const locationCount = analyticsData.reduce((acc: any, curr: any) => {
      const loc = curr.country !== 'Unknown' ? curr.country : 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
    const topLocation = Object.keys(locationCount).reduce((a, b) => locationCount[a] > locationCount[b] ? a : b, 'Unknown');

    // Process downloads
    const downloads = analyticsEvents.filter(e => e.event_name === 'app_download');
    const totalDownloads = downloads.length;
    const iosDownloads = downloads.filter(e => e.event_data?.store === 'ios').length;
    const androidDownloads = downloads.filter(e => e.event_data?.store === 'android').length;

    const exportToCSV = () => {
      const headers = ['Date', 'Event Type', 'Device', 'OS', 'Country', 'City', 'Path', 'Details'];
      
      const visitRows = analyticsData.map(v => [
        new Date(v.created_at).toLocaleString('en-US'),
        'Page Visit',
        v.device_type,
        v.os,
        v.country,
        v.city,
        v.path,
        ''
      ]);

      const eventRows = analyticsEvents.map(e => [
        new Date(e.created_at).toLocaleString('en-US'),
        e.event_name,
        e.device_type,
        e.os,
        '',
        '',
        e.path,
        JSON.stringify(e.event_data).replace(/"/g, '""')
      ]);

      const csvContent = [
        headers.join(','),
        ...visitRows.map(r => `"${r.join('","')}"`),
        ...eventRows.map(r => `"${r.join('","')}"`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Export & Refresh Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={fetchAnalytics}
            disabled={isLoadingAnalytics}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Clock size={16} className={isLoadingAnalytics ? "animate-spin" : ""} />
            تحديث البيانات (Refresh)
          </button>
          <button 
            onClick={exportToCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            تصدير البيانات (CSV)
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">إجمالي الزوار</p>
              <p className="text-2xl font-bold text-slate-800">{analyticsData.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">أكثر الأجهزة</p>
              <p className="text-2xl font-bold text-slate-800">{topDevice}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">أكثر الدول</p>
              <p className="text-2xl font-bold text-slate-800">{topLocation}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Download size={24} />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-slate-500">تحميلات التطبيق</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold text-slate-800">{totalDownloads}</p>
                <div className="flex gap-2 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Apple size={12} /> {iosDownloads}</span>
                  <span className="flex items-center gap-1"><Smartphone size={12} /> {androidDownloads}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6">الزيارات عبر الزمن</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3b8e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1a3b8e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#1a3b8e" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">أنواع الأجهزة</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Visitors Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">أحدث الزوار</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir="rtl">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-medium border-b border-slate-200">التوقيت</th>
                  <th className="p-4 font-medium border-b border-slate-200">الموقع (Location)</th>
                  <th className="p-4 font-medium border-b border-slate-200">الإحداثيات (GPS)</th>
                  <th className="p-4 font-medium border-b border-slate-200">نوع الجهاز (Phone/PC)</th>
                  <th className="p-4 font-medium border-b border-slate-200">نظام التشغيل</th>
                  <th className="p-4 font-medium border-b border-slate-200">الصفحة</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {analyticsData.slice(0, 10).map((visitor, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                    <td className="p-4 flex items-center gap-2" dir="ltr">
                      <Clock size={14} className="text-slate-400" />
                      {new Date(visitor.created_at).toLocaleString('en-US')}
                    </td>
                    <td className="p-4">{visitor.city && visitor.city !== 'Unknown' ? `${visitor.city}, ${visitor.country}` : visitor.country || 'Unknown'}</td>
                    <td className="p-4 font-mono text-xs" dir="ltr">
                      {visitor.latitude !== undefined && visitor.latitude !== null ? `${Number(visitor.latitude).toFixed(4)}, ${Number(visitor.longitude).toFixed(4)}` : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        {visitor.device_type === 'Mobile' ? <Smartphone size={14} className="text-brand-blue" /> : <Layout size={14} className="text-slate-400" />}
                        {visitor.device_type || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4">{visitor.os || 'Unknown'}</td>
                    <td className="p-4 text-brand-blue" dir="ltr">{visitor.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderLogs = () => {
    if (isLoadingAnalytics) {
      return (
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      );
    }

    const adminLogs = analyticsEvents.filter(e => e.event_name === 'admin_login_attempt' || e.event_name === 'admin_login');

    if (!adminLogs.length) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-500">
          <Clock size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">لا توجد سجلات دخول حتى الآن</p>
          <p className="text-sm mt-2">No admin login logs available yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">سجل محاولات الدخول (Login Attempts)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir="rtl">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-medium border-b border-slate-200">التوقيت</th>
                  <th className="p-4 font-medium border-b border-slate-200">الحالة</th>
                  <th className="p-4 font-medium border-b border-slate-200">الكود المستخدم</th>
                  <th className="p-4 font-medium border-b border-slate-200">الجهاز</th>
                  <th className="p-4 font-medium border-b border-slate-200">نظام التشغيل</th>
                  <th className="p-4 font-medium border-b border-slate-200">الموقع</th>
                  <th className="p-4 font-medium border-b border-slate-200">الإحداثيات</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {adminLogs.map((log, idx) => {
                  const loc = log.event_data?.location || log.event_data?.exact_location || {};
                  const lat = log.latitude || loc.lat || loc.latitude;
                  const lon = log.longitude || loc.lon || loc.longitude;
                  const displayLat = typeof lat === 'number' ? lat.toFixed(4) : 'N/A';
                  const displayLon = typeof lon === 'number' ? lon.toFixed(4) : 'N/A';
                  const isSuccess = log.event_data?.success || log.event_name === 'admin_login';
                  
                  const displayCity = log.city || loc.city || 'Unknown';
                  const displayCountry = log.country || loc.country || 'Unknown';
                  const locationText = displayCity !== 'Unknown' ? `${displayCity}, ${displayCountry}` : displayCountry;
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                      <td className="p-4 flex items-center gap-2" dir="ltr">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(log.created_at).toLocaleString('en-US')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isSuccess ? 'نجاح' : 'فشل'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">{log.event_data?.code || 'N/A'}</td>
                      <td className="p-4">{log.device_type || 'Unknown'}</td>
                      <td className="p-4">{log.os || 'Unknown'}</td>
                      <td className="p-4">{locationText}</td>
                      <td className="p-4 font-mono text-xs" dir="ltr">{displayLat}, {displayLon}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            {hasUnsavedChanges ? (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg font-medium">
                <Settings size={16} className="animate-spin-slow" /> 
                {config.language === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved Changes'}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium">
                <Save size={16} /> 
                {config.language === 'ar' ? 'تم الحفظ' : 'Saved'}
              </div>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button
                className={`flex-1 min-w-[80px] py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'content' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`flex-1 min-w-[80px] py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'layout' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('layout')}
              >
                Layout
              </button>
              <button
                className={`flex-1 min-w-[80px] py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button
                className={`flex-1 min-w-[80px] py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'logs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveTab('logs')}
              >
                Logs
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
                  <button
                    onClick={() => setActiveSection('settings')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'settings' ? 'bg-brand-blue/10 text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                  >
                    <span className="capitalize flex items-center gap-2"><Settings size={16} /> Settings</span>
                    {activeSection === 'settings' && <ChevronRight size={16} />}
                  </button>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
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
            {activeTab === 'content' ? renderContentEditor() : activeTab === 'layout' ? renderLayoutEditor() : activeTab === 'analytics' ? renderAnalytics() : renderLogs()}
          </div>

        </div>
      </div>
      {/* Floating Action Buttons */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <button
              onClick={discardChanges}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <XCircle size={20} />
              {config.language === 'ar' ? 'تجاهل' : config.language === 'fr' ? 'Ignorer' : 'Discard'}
            </button>
            <button
              onClick={saveConfig}
              className="px-8 py-3 rounded-xl font-bold bg-brand-blue text-white hover:bg-brand-blue/90 hover:scale-105 transition-all shadow-lg shadow-brand-blue/30 flex items-center gap-2"
            >
              <Save size={20} />
              {config.language === 'ar' ? 'حفظ التغييرات' : config.language === 'fr' ? 'Enregistrer' : 'Save Changes'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
