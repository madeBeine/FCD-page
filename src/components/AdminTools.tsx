import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { Edit2, Eye, EyeOff, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminToolbarProps {
  sectionId: string;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ sectionId }) => {
  const { config, toggleSectionVisibility, moveSection } = useConfig();
  
  if (!config.isAdminMode) return null;

  const section = config.sections.find(s => s.id === sectionId);
  if (!section) return null;

  return (
    <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-700 shadow-lg" dir="ltr">
      <span className="text-xs text-white font-mono mr-2">{sectionId}</span>
      <button 
        onClick={() => toggleSectionVisibility(sectionId)}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
        title={section.isVisible ? "Hide Section" : "Show Section"}
      >
        {section.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
      <button 
        onClick={() => moveSection(sectionId, 'up')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
        title="Move Up"
      >
        <ArrowUp size={16} />
      </button>
      <button 
        onClick={() => moveSection(sectionId, 'down')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
        title="Move Down"
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
};

interface ArrayItemToolbarProps {
  section: string;
  arrayKey: string;
  index: number;
  item: any;
  array: any[];
}

export const ArrayItemToolbar: React.FC<ArrayItemToolbarProps> = ({ section, arrayKey, index, item, array }) => {
  const { config, updateContent } = useConfig();
  
  if (!config.isAdminMode) return null;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Remove from current language
    const newArray = array.filter((_, i) => i !== index);
    updateContent(config.language, section, arrayKey, newArray);
    
    // Sync removal across other languages
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      if (lang !== config.language) {
        const langArray = [...(config.content[lang][section as keyof typeof config.content.ar][arrayKey as any] || [])];
        if (langArray.length > index) {
          const newLangArray = langArray.filter((_, i) => i !== index);
          updateContent(lang, section, arrayKey, newLangArray);
        }
      }
    });
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const newValue = item.isVisible === false ? true : false;
    
    // Update current language
    const newArray = [...array];
    newArray[index] = { ...newArray[index], isVisible: newValue };
    updateContent(config.language, section, arrayKey, newArray);
    
    // Sync across other languages
    (['ar', 'en', 'fr'] as const).forEach(lang => {
      if (lang !== config.language) {
        const langArray = [...(config.content[lang][section as keyof typeof config.content.ar][arrayKey as any] || [])];
        if (langArray[index]) {
          langArray[index] = { ...langArray[index], isVisible: newValue };
          updateContent(lang, section, arrayKey, langArray);
        }
      }
    });
  };

  return (
    <div className="absolute top-2 left-2 z-50 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" dir="ltr">
      <button 
        onClick={handleToggleVisibility}
        className={`p-1.5 rounded transition-colors ${item.isVisible === false ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-brand-blue hover:text-white hover:bg-brand-blue'}`}
        title={item.isVisible === false ? "Show Item" : "Hide Item"}
      >
        {item.isVisible === false ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <button 
        onClick={handleRemove}
        className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-colors"
        title="Remove Item"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

interface EditableTextProps {
  section: string;
  contentKey: string;
  value: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  section, 
  contentKey, 
  value, 
  className,
  as: Component = 'span' 
}) => {
  const { config, updateContent } = useConfig();
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(value);

  // Update tempValue if value changes from props
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (!config.isAdminMode) {
    return <Component className={className}>{value}</Component>;
  }

  const handleSave = () => {
    updateContent(config.language, section, contentKey, tempValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={cn("relative inline-block w-full group", className)}>
        {Component === 'p' || Component === 'div' ? (
          <textarea 
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full bg-white/90 text-slate-900 border-2 border-brand-orange rounded p-2 outline-none min-h-[100px]"
            autoFocus
            onBlur={handleSave}
          />
        ) : (
          <input 
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full bg-white/90 text-slate-900 border-2 border-brand-orange rounded p-1 outline-none"
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        )}
      </div>
    );
  }

  return (
    <Component 
      className={cn(className, "relative group cursor-pointer hover:outline hover:outline-2 hover:outline-brand-orange/50 hover:outline-offset-4 rounded transition-all")}
      onClick={() => setIsEditing(true)}
    >
      {value}
      <span className="absolute -top-3 -right-3 bg-brand-orange text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center">
        <Edit2 size={12} />
      </span>
    </Component>
  );
};
