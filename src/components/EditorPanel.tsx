import React, { useState, useRef } from 'react';
import { GridItem, BackgroundPreset, UserPhoto } from '../types';
import { IconPicker } from './IconPicker';
import { LucideIcon } from './LucideIcon';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Settings2, 
  RefreshCw, 
  AppWindow,
  RotateCcw,
  Sparkles,
  Link2,
  FileImage,
  Layers,
  Volume2,
  Tv,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditorPanelProps {
  gridItems: GridItem[];
  dockItems: GridItem[];
  selectedItem: GridItem | { type: 'empty'; row: number; col: number; isDock: boolean } | null;
  backgroundUrl: string;
  userPhotos: UserPhoto[];
  backgroundPresets: BackgroundPreset[];
  isEditMode: boolean;
  onUpdateBackground: (url: string) => void;
  onUpdateItem: (item: GridItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: GridItem) => void;
  onAddUserPhoto: (photo: UserPhoto) => void;
  onDeleteUserPhoto: (id: string) => void;
  onResetToDefault: () => void;
  onToggleEditMode: () => void;
  isFullscreenDisplay: boolean;
  onToggleFullscreenDisplay: () => void;
  onExportOfflineHtml: () => void;
}

export function EditorPanel({
  gridItems,
  dockItems,
  selectedItem,
  backgroundUrl,
  userPhotos,
  backgroundPresets,
  isEditMode,
  onUpdateBackground,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onAddUserPhoto,
  onDeleteUserPhoto,
  onResetToDefault,
  onToggleEditMode,
  isFullscreenDisplay,
  onToggleFullscreenDisplay,
  onExportOfflineHtml
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'selected' | 'background' | 'photos'>('selected');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [bgInput, setBgInput] = useState(backgroundUrl);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // States for selected item form fields
  const [appLabel, setAppLabel] = useState('');
  const [appIconName, setAppIconName] = useState('AppWindow');
  const [appIconType, setAppIconType] = useState<'lucide' | 'custom'>('lucide');
  const [appIconUrl, setAppIconUrl] = useState('');
  const [appAudioUrl, setAppAudioUrl] = useState('');
  const [appTransparentIconBg, setAppTransparentIconBg] = useState(false);

  const [widgetTitle, setWidgetTitle] = useState('iScreen');
  const [widgetType, setWidgetType] = useState<'photo' | 'weather' | 'clock' | 'stocks' | 'polaroid'>('photo');
  const [widgetImages, setWidgetImages] = useState<string[]>([]);

  // Sync item form state when selected item changes
  React.useEffect(() => {
    if (selectedItem && 'id' in selectedItem) {
      setAppLabel(selectedItem.label || '');
      setAppIconName(selectedItem.iconName || 'AppWindow');
      setAppIconType(selectedItem.iconName === 'custom' ? 'custom' : 'lucide');
      setAppIconUrl(selectedItem.iconUrl || '');
      setAppAudioUrl(selectedItem.audioUrl || '');
      setAppTransparentIconBg(selectedItem.transparentIconBg || false);

      setWidgetTitle(selectedItem.title || 'iScreen');
      setWidgetType(selectedItem.widgetType || 'photo');
      setWidgetImages(selectedItem.images || []);
    }
  }, [selectedItem]);

  // Handle local image file upload to "My Photos"
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: UserPhoto = {
            id: Date.now().toString(),
            name: file.name.substring(0, 15),
            url: event.target.result as string
          };
          onAddUserPhoto(newPhoto);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom custom icon photo upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAppIconType('custom');
          setAppIconName('custom');
          setAppIconUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom audio file upload for app sound triggering
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAppAudioUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom wallpaper upload from local machine
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgInput(event.target.result as string);
          onUpdateBackground(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a photo from URL input
  const handleAddPhotoFromUrl = () => {
    if (customPhotoInput.trim()) {
      const newPhoto: UserPhoto = {
        id: Date.now().toString(),
        name: `Foto ${userPhotos.length + 1}`,
        url: customPhotoInput.trim()
      };
      onAddUserPhoto(newPhoto);
      setCustomPhotoInput('');
    }
  };

  // Save selected item changes
  const handleSaveItemChanges = () => {
    if (!selectedItem || !('id' in selectedItem)) return;

    const updated: GridItem = {
      ...selectedItem,
      label: appLabel,
      iconName: appIconType === 'custom' ? 'custom' : appIconName,
      iconUrl: appIconType === 'custom' ? appIconUrl : undefined,
      audioUrl: appAudioUrl || undefined,
      transparentIconBg: appTransparentIconBg,
      title: widgetTitle,
      widgetType,
      images: widgetImages
    };

    onUpdateItem(updated);
  };

  // Add a new App or Widget into an empty space
  const handleAddNewItem = (type: 'app' | 'widget_small' | 'widget_medium') => {
    if (!selectedItem || 'id' in selectedItem) return;

    const { row, col, isDock } = selectedItem;
    const baseId = `item-${Date.now()}`;

    let newItem: GridItem;

    if (isDock) {
      // Dock can only take App Icons (1x1)
      newItem = {
        id: baseId,
        row: 99, // dummy dock row
        col,
        w: 1,
        h: 1,
        type: 'app',
        label: 'App',
        iconName: 'AppWindow'
      };
    } else {
      if (type === 'app') {
        newItem = {
          id: baseId,
          row,
          col,
          w: 1,
          h: 1,
          type: 'app',
          label: 'Nuova App',
          iconName: 'AppWindow'
        };
      } else if (type === 'widget_small') {
        // 2x2 widget
        newItem = {
          id: baseId,
          row,
          col,
          w: 2,
          h: 2,
          type: 'widget_small',
          widgetType: 'photo',
          title: 'iScreen',
          images: userPhotos.length > 0 ? [userPhotos[0].url] : []
        };
      } else {
        // 4x2 widget
        newItem = {
          id: baseId,
          row,
          col,
          w: 4,
          h: 2,
          type: 'widget_medium',
          widgetType: 'polaroid',
          title: 'iScreen',
          images: userPhotos.slice(0, 3).map((p) => p.url)
        };
      }
    }

    onAddItem(newItem);
  };

  // Assign a photo to the widget image slots
  const setWidgetPhotoIndex = (photoUrl: string, index: number) => {
    const updatedImages = [...widgetImages];
    updatedImages[index] = photoUrl;
    setWidgetImages(updatedImages);
  };

  return (
    <div className="flex-1 max-w-lg bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-3xl p-6 flex flex-col justify-between shadow-xl text-slate-100 overflow-hidden min-h-[620px] h-full max-h-[720px] select-none">
      
      {/* Top Header & Dynamic Modes */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings2 className="text-cyan-400 animate-pulse" size={22} />
            Configuratore iOS
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Crea il tuo iScreen personalizzato</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export Offline button */}
          <button
            onClick={onExportOfflineHtml}
            title="Scarica l'intera app offline in formato HTML"
            className="p-1.5 rounded-full bg-slate-800 hover:bg-emerald-600/30 border border-slate-700/50 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 transition-all shadow-sm flex items-center justify-center"
          >
            <Download size={15} />
          </button>

          <button
            onClick={onResetToDefault}
            title="Ripristina layout iniziale"
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 text-slate-400 border border-slate-700/50 transition-all shadow-sm"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Primary Simulator controls (Fullscreen display, Edit toggle) */}
      <div className="grid grid-cols-2 gap-2 mt-3.5 mb-2">
        <button
          onClick={onToggleEditMode}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 border
            ${isEditMode 
              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40' 
              : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
        >
          <Sparkles size={13} className={isEditMode ? 'animate-bounce' : ''} />
          {isEditMode ? 'Edit Mode: ATTIVO' : 'Edit Mode: DISATTIVO'}
        </button>

        <button
          onClick={onToggleFullscreenDisplay}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 border
            ${isFullscreenDisplay 
              ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/40' 
              : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
        >
          <Tv size={13} />
          {isFullscreenDisplay ? 'Schermo Intero: ON' : 'Schermo Intero: OFF'}
        </button>
      </div>

      {/* Main tab navigations */}
      <div className="flex gap-1.5 p-1 bg-slate-950/40 border border-slate-850 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('selected')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center
            ${activeTab === 'selected' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          Selezionato
        </button>
        <button
          onClick={() => setActiveTab('background')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center
            ${activeTab === 'background' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          Sfondi
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center
            ${activeTab === 'photos' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          Le mie Foto ({userPhotos.length})
        </button>
      </div>

      {/* Tab Contents Scrollable container */}
      <div className="flex-1 overflow-y-auto pr-1 text-sm space-y-4">
        
        {/* TAB 1: SELECTED ELEMENT CONFIGURATOR */}
        {activeTab === 'selected' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedItem ? (
              'id' in selectedItem ? (
                /* ACTUAL GRID ITEM CONFIGURE */
                <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-2xl space-y-4">
                  
                  {/* Info Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                        {selectedItem.type === 'app' ? 'App Icon' : selectedItem.type === 'widget_small' ? 'Widget 2x2' : 'Widget 4x2'}
                      </span>
                      <h4 className="text-white font-bold text-base mt-1.5">
                        {selectedItem.type === 'app' ? appLabel || 'App Icon' : widgetTitle || 'Widget iScreen'}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Posizione: Riga {selectedItem.row + 1}, Colonna {selectedItem.col + 1}</p>
                    </div>

                    <button
                      onClick={() => onDeleteItem(selectedItem.id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 size={14} />
                      Rimuovi
                    </button>
                  </div>

                  <hr className="border-slate-850" />

                  {/* FORM FIELDS BASED ON TYPE */}
                  {selectedItem.type === 'app' && (
                    <div className="space-y-4">
                      {/* App Label */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Nome App</label>
                        <input
                          type="text"
                          value={appLabel}
                          onChange={(e) => setAppLabel(e.target.value)}
                          placeholder="Inserisci nome..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* App Icon Picker Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Metodo Icona</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setAppIconType('lucide'); setAppIconName('AppWindow'); }}
                            className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all
                              ${appIconType === 'lucide' 
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40' 
                                : 'bg-slate-800/40 text-slate-400 border-slate-800'
                              }`}
                          >
                            Vettore Standard
                          </button>
                          <button
                            onClick={() => { setAppIconType('custom'); }}
                            className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all
                              ${appIconType === 'custom' 
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40' 
                                : 'bg-slate-800/40 text-slate-400 border-slate-800'
                              }`}
                          >
                            Mia Foto / Custom
                          </button>
                        </div>
                      </div>

                      {appIconType === 'lucide' ? (
                        <div className="flex gap-3 items-center bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-white">
                            <LucideIcon name={appIconName} size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-300">Glyph: {appIconName}</p>
                            <button
                              onClick={() => setShowIconPicker(true)}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-1 underline"
                            >
                              Sfoglia Libreria Icone
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                          <p className="text-xs font-bold text-slate-300">Carica foto per icona</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={appIconUrl}
                              onChange={(e) => setAppIconUrl(e.target.value)}
                              placeholder="URL immagine..."
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                            
                            <button
                              onClick={() => iconFileInputRef.current?.click()}
                              className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs flex items-center gap-1"
                              title="Carica da file"
                            >
                              <Upload size={13} />
                            </button>
                            <input 
                              type="file" 
                              ref={iconFileInputRef} 
                              onChange={handleIconUpload} 
                              accept="image/*" 
                              className="hidden" 
                            />
                          </div>

                          {/* Pre-select from "My Photos" list */}
                          {userPhotos.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Seleziona dalle tue foto:</p>
                              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {userPhotos.map((photo) => (
                                  <button
                                    key={photo.id}
                                    onClick={() => setAppIconUrl(photo.url)}
                                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 shrink-0 transition-all
                                      ${appIconUrl === photo.url ? 'border-cyan-400 scale-95' : 'border-slate-800 hover:border-slate-600'}`}
                                  >
                                    <img src={photo.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TABS 1 SOUND SELECTOR: CHOOSE FILE OR SPECIFY SOUND URL */}
                      <div className="space-y-2 bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Volume2 size={14} className="text-cyan-400" />
                          Associa Suono all'Icona
                        </label>
                        <p className="text-[10px] text-slate-500">Riproduce un audio personalizzato quando clicchi l'icona sul telefono!</p>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={appAudioUrl}
                            onChange={(e) => setAppAudioUrl(e.target.value)}
                            placeholder="Incolla URL audio (mp3)..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                          
                          <button
                            onClick={() => audioFileInputRef.current?.click()}
                            className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs flex items-center gap-1"
                            title="Carica file audio"
                          >
                            <Upload size={13} />
                          </button>
                          <input 
                            type="file" 
                            ref={audioFileInputRef} 
                            onChange={handleAudioUpload} 
                            accept="audio/*" 
                            className="hidden" 
                          />
                        </div>

                        {appAudioUrl && (
                          <div className="flex items-center justify-between text-[11px] bg-cyan-950/45 border border-cyan-800/30 px-2 py-1 rounded">
                            <span className="text-cyan-400 font-medium truncate max-w-[200px]">Suono pronto</span>
                            <button
                              onClick={() => {
                                try {
                                  const playTest = new Audio(appAudioUrl);
                                  playTest.play();
                                } catch (e) {
                                  console.warn('Audio preview play blocked:', e);
                                }
                              }}
                              className="text-xs text-white underline hover:text-cyan-300 font-bold"
                            >
                              Anteprima Audio
                            </button>
                          </div>
                        )}
                      </div>

                      {/* TABS 1 TRANSPARENCY TOGGLE FOR PNGs */}
                      <div className="flex items-center gap-2.5 bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                        <input
                          id="transparentIconBg"
                          type="checkbox"
                          checked={appTransparentIconBg}
                          onChange={(e) => setAppTransparentIconBg(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20 bg-slate-800 cursor-pointer"
                        />
                        <label 
                          htmlFor="transparentIconBg" 
                          className="text-xs font-semibold text-slate-300 cursor-pointer select-none flex-1"
                        >
                          Sfondo Trasparente Icona (Ottimo per PNG senza sfondo)
                        </label>
                      </div>

                    </div>
                  )}

                  {/* 2X2 OR 4X2 WIDGET CONFIGURE */}
                  {(selectedItem.type === 'widget_small' || selectedItem.type === 'widget_medium') && (
                    <div className="space-y-4">
                      {/* Widget Title Label */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Etichetta Sotto Widget</label>
                        <input
                          type="text"
                          value={widgetTitle}
                          onChange={(e) => setWidgetTitle(e.target.value)}
                          placeholder="Inserisci etichetta (es: iScreen)..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* Widget Style Type */}
                      {selectedItem.type === 'widget_small' ? (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Tipo Widget 2x2</label>
                          <select
                            value={widgetType}
                            onChange={(e) => setWidgetType(e.target.value as any)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="photo">Foto Personalizzata (iScreen)</option>
                            <option value="clock">Orologio / Ora Locale</option>
                            <option value="weather">Meteo (Roma)</option>
                            <option value="stocks">Borsa Azioni (AAPL)</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Tipo Widget 4x2</label>
                          <select
                            value={widgetType}
                            onChange={(e) => setWidgetType(e.target.value as any)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="polaroid">Album 3 Polaroid Polaroid-iScreen</option>
                          </select>
                        </div>
                      )}

                      {/* Photo Assignments based on Type */}
                      {widgetType === 'photo' && (
                        <div className="space-y-2.5 bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                          <p className="text-xs font-bold text-slate-300">Seleziona la foto da visualizzare</p>
                          
                          {userPhotos.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                              {userPhotos.map((photo) => {
                                const isSelected = widgetImages[0] === photo.url;
                                return (
                                  <button
                                    key={photo.id}
                                    onClick={() => setWidgetPhotoIndex(photo.url, 0)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                      ${isSelected ? 'border-cyan-400 scale-95 shadow-md' : 'border-slate-800 hover:border-slate-600'}`}
                                  >
                                    <img src={photo.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">Nessuna foto disponibile. Vai sulla scheda "Le mie foto" per caricarne alcune!</p>
                          )}
                        </div>
                      )}

                      {widgetType === 'polaroid' && (
                        <div className="space-y-3.5 bg-slate-800/30 border border-slate-800 p-3 rounded-xl">
                          <p className="text-xs font-bold text-white flex items-center gap-1">
                            <Layers className="text-cyan-400" size={14} />
                            Assegna foto alle 3 Polaroid
                          </p>

                          {[0, 1, 2].map((slotIndex) => {
                            const currentUrl = widgetImages[slotIndex];
                            return (
                              <div key={slotIndex} className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Polaroid Slot {slotIndex + 1}</span>
                                
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mt-1">
                                  {userPhotos.map((photo) => {
                                    const isSelected = currentUrl === photo.url;
                                    return (
                                      <button
                                        key={photo.id}
                                        onClick={() => setWidgetPhotoIndex(photo.url, slotIndex)}
                                        className={`w-9 h-9 rounded overflow-hidden border-2 shrink-0 transition-all
                                          ${isSelected ? 'border-cyan-400 scale-95' : 'border-slate-800 hover:border-slate-600'}`}
                                      >
                                        <img src={photo.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <hr className="border-slate-850" />

                  {/* Save changes button */}
                  <button
                    onClick={handleSaveItemChanges}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-cyan-500/20 active:scale-[0.99]"
                  >
                    Salva Modifiche Elemento
                  </button>
                </div>
              ) : (
                /* EMPTY CELL SELECTED - SHOW ADD OPTIONS */
                <div className="bg-slate-950/20 border border-slate-850 p-5 rounded-2xl space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mx-auto">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Spazio Vuoto Selezionato</h4>
                    <p className="text-xs text-slate-400 mt-1">Riga {selectedItem.row + 1}, Colonna {selectedItem.col + 1} {selectedItem.isDock ? ' (Nel Dock)' : ''}</p>
                  </div>

                  <p className="text-xs text-slate-400">
                    {selectedItem.isDock 
                      ? "Il dock inferiore dell'iPhone accetta solo icone di applicazioni standard."
                      : "Aggiungi una nuova applicazione trasparente, un widget iScreen piccolo oppure un widget Polaroid largo."
                    }
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => handleAddNewItem('app')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <AppWindow size={14} className="text-cyan-400" />
                      Aggiungi App Icon
                    </button>

                    {!selectedItem.isDock && (
                      <>
                        <button
                          onClick={() => handleAddNewItem('widget_small')}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <ImageIcon size={14} className="text-cyan-400" />
                          Aggiungi Widget iScreen 2x2
                        </button>

                        {/* Enable Medium Widget only if there is sufficient space */}
                        {selectedItem.col === 0 ? (
                          <button
                            onClick={() => handleAddNewItem('widget_medium')}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <Layers size={14} className="text-cyan-400" />
                            Aggiungi Widget Polaroid 4x2
                          </button>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">
                            *I widget Polaroid 4x2 richiedono di essere piazzati nella colonna 1 (sinistra) per estendersi correttamente.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* NO SELECTION HEADER */
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl bg-slate-950/10">
                <ImageIcon className="mx-auto text-slate-600 mb-2.5" size={28} />
                <p className="text-sm font-semibold text-slate-400">Nessun elemento selezionato</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isEditMode 
                    ? "Clicca su qualsiasi applicazione o spazio tratteggiato nel telefono per personalizzarlo!" 
                    : "Attiva l'Edit Mode in alto per sbloccare la modifica e la creazione della schermata!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BACKGROUND OPTIONS */}
        {activeTab === 'background' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Upload Wallpaper via File chooser */}
            <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-2xl space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Upload className="text-cyan-400" size={14} />
                Carica Sfondo Personalizzato dal Dispositivo
              </label>
              
              <button
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl py-2 px-3 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon size={14} className="text-cyan-400 animate-pulse" />
                Scegli File Immagine Sfondo
              </button>
              <input
                type="file"
                ref={bgFileInputRef}
                onChange={handleBackgroundUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-[10px] text-slate-500">Seleziona una foto dal tuo computer o smartphone per cambiare all'istante lo sfondo dell'iPhone.</p>
            </div>

            {/* Input direct URL background */}
            <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-2xl space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Link2 className="text-cyan-400" size={14} />
                Imposta Sfondo tramite URL Web
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bgInput}
                  onChange={(e) => {
                    setBgInput(e.target.value);
                    onUpdateBackground(e.target.value);
                  }}
                  placeholder="Incolla l'URL dello sfondo..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Preset Consigliati</label>
              
              <div className="grid grid-cols-2 gap-3">
                {backgroundPresets.map((preset) => {
                  const isCurrent = backgroundUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setBgInput(preset.url);
                        onUpdateBackground(preset.url);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-[9/16] h-[130px] w-full border-2 transition-all group flex flex-col justify-end p-2 text-left
                        ${isCurrent ? 'border-cyan-400 scale-[0.98]' : 'border-slate-800 hover:border-slate-600'}`}
                    >
                      <img src={preset.url} alt={preset.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="text-[10px] font-bold text-white relative truncate w-full drop-shadow">
                        {preset.name}
                      </span>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 bg-cyan-500 text-white p-0.5 rounded-full text-[8px] font-bold px-1.5 shadow">
                          ATTIVO
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER PHOTOS LIBRARY */}
        {activeTab === 'photos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Upload or Link Photo Box */}
            <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-2xl space-y-4">
              <h4 className="text-white font-bold text-xs flex items-center gap-1">
                <FileImage className="text-cyan-400" size={14} />
                Aggiungi Foto alla Libreria
              </h4>

              {/* Upload button */}
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-xl py-2 px-3 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={14} className="text-cyan-400" />
                  Carica File Immagine
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase">Oppure tramite link</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* URL field */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Incolla URL della foto..."
                  value={customPhotoInput}
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddPhotoFromUrl}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-3 rounded-lg text-xs transition-all"
                >
                  Carica
                </button>
              </div>
            </div>

            {/* Photos List Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Libreria Immagini</label>
              
              <div className="grid grid-cols-3 gap-2.5">
                {userPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group/photo relative aspect-square bg-slate-800/40 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center hover:border-slate-600 transition-all"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.name} 
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover delete overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-all flex items-center justify-center">
                      <button
                        onClick={() => onDeleteUserPhoto(photo.id)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-transform hover:scale-110 shadow-lg"
                        title="Rimuovi foto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[8px] py-0.5 px-1 truncate text-center">
                      {photo.name}
                    </div>
                  </div>
                ))}

                {userPhotos.length === 0 && (
                  <div className="col-span-3 py-10 text-center text-xs text-slate-500 italic">
                    Nessuna foto salvata. Carica o linka delle immagini sopra!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Persistent Information / Guideline bottom bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-sans">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={13} />
          <span>Esporta offline cliccando l'icona <Download size={10} className="inline mx-0.5" /> in alto!</span>
        </div>
        <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider">v2.0 PRO</span>
      </div>

      {/* Dynamically shown Icon Picker */}
      {showIconPicker && (
        <IconPicker
          currentIcon={appIconName}
          onSelectIcon={(icon) => setAppIconName(icon)}
          onClose={() => setShowIconPicker(false)}
        />
      )}

    </div>
  );
}
