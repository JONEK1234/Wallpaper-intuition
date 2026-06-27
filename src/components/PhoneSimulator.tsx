import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from './LucideIcon';
import { GridItem } from '../types';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Plus, 
  Trash2, 
  Edit3, 
  Sun, 
  CloudSun,
  TrendingUp,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2
} from 'lucide-react';

interface PhoneSimulatorProps {
  gridItems: GridItem[];
  dockItems: GridItem[];
  backgroundUrl: string;
  selectedItemId: string | null;
  onSelectItem: (item: GridItem | { type: 'empty'; row: number; col: number; isDock: boolean }) => void;
  isEditMode: boolean;
  activePage: number;
  setActivePage: (p: number) => void;
  totalPages: number;
  onAddPage: () => void;
  onDeletePage: (pageIndex: number) => void;
  isFullscreenDisplay: boolean;
  onToggleFullscreenDisplay?: () => void;
}

export function PhoneSimulator({
  gridItems,
  dockItems,
  backgroundUrl,
  selectedItemId,
  onSelectItem,
  isEditMode,
  activePage,
  setActivePage,
  totalPages,
  onAddPage,
  onDeletePage,
  isFullscreenDisplay,
  onToggleFullscreenDisplay
}: PhoneSimulatorProps) {
  const [currentTime, setCurrentTime] = useState('23:19');
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const lastTapRef = React.useRef<number>(0);

  const handleTouchEnd = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      if (isFullscreenDisplay && onToggleFullscreenDisplay) {
        onToggleFullscreenDisplay();
      }
    }
    lastTapRef.current = now;
  };

  const handleDoubleClick = () => {
    if (isFullscreenDisplay && onToggleFullscreenDisplay) {
      onToggleFullscreenDisplay();
    }
  };

  // Update clock in real-time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Play audio helper
  const playAudio = (audioUrl?: string) => {
    if (!audioUrl) return;
    try {
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.play().catch((e) => {
        console.warn('Audio play blocked or failed:', e);
      });
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  };

  // Filter gridItems belonging strictly to the ACTIVE PAGE
  const pageGridItems = gridItems.filter((item) => (item.page || 0) === activePage);

  // Grid layout helper: 4 columns, 6 rows (0-5)
  const renderGrid = () => {
    const gridMatrix: (string | null)[][] = Array(6)
      .fill(null)
      .map(() => Array(4).fill(null));

    // Populate matrix with item IDs to detect overlapping and filled cells
    pageGridItems.forEach((item) => {
      for (let r = item.row; r < Math.min(item.row + item.h, 6); r++) {
        for (let c = item.col; c < Math.min(item.col + item.w, 4); c++) {
          gridMatrix[r][c] = item.id;
        }
      }
    });

    const cells: React.ReactNode[] = [];

    // Render cells sequentially to preserve layout
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        const itemId = gridMatrix[r][c];

        if (itemId === null) {
          // Empty cell
          cells.push(
            <div
              key={`empty-${activePage}-${r}-${c}`}
              onClick={() => {
                if (!isFullscreenDisplay) {
                  onSelectItem({ type: 'empty', row: r, col: c, isDock: false });
                }
              }}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative group
                ${isEditMode && !isFullscreenDisplay
                  ? 'border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 cursor-pointer' 
                  : 'pointer-events-none opacity-0'
                }`}
            >
              {isEditMode && !isFullscreenDisplay && (
                <Plus className="text-white/30 group-hover:text-white/75 group-hover:scale-110 transition-all" size={20} />
              )}
            </div>
          );
        } else {
          // Find the item
          const item = pageGridItems.find((i) => i.id === itemId);
          if (!item) continue;

          // Only render the item from its top-left cell origin to avoid double rendering
          if (item.row === r && item.col === c) {
            const isSelected = selectedItemId === item.id;
            
            // Check widget / item spanning classes
            let spanClass = 'col-span-1 row-span-1 aspect-square';
            if (item.w === 2 && item.h === 2) {
              spanClass = 'col-span-2 row-span-2 aspect-square';
            } else if (item.w === 4 && item.h === 2) {
              spanClass = 'col-span-4 row-span-2 h-[145px]';
            } else if (item.w === 4 && item.h === 4) {
              spanClass = 'col-span-4 row-span-4 h-[300px]';
            }

            cells.push(
              <motion.div
                key={`item-${item.id}`}
                layoutId={`item-layout-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  
                  // In fullscreen viewing mode (or non-edit mode), tapping app plays sound
                  if (item.type === 'app' && item.audioUrl) {
                    playAudio(item.audioUrl);
                  }

                  // Selection trigger
                  if (!isFullscreenDisplay) {
                    onSelectItem(item);
                  }
                }}
                className={`relative cursor-pointer select-none group flex flex-col justify-between transition-all duration-300
                  ${spanClass}
                  ${isSelected && !isFullscreenDisplay ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 rounded-3xl scale-[0.98]' : ''}
                `}
                style={{
                  gridColumnStart: item.col + 1,
                  gridColumnEnd: item.col + item.w + 1,
                  gridRowStart: item.row + 1,
                  gridRowEnd: item.row + item.h + 1,
                }}
              >
                {/* Render corresponding element based on type */}
                {item.type === 'app' && renderAppIcon(item)}
                {item.type === 'widget_small' && renderSmallWidget(item)}
                {item.type === 'widget_medium' && renderMediumWidget(item)}

                {/* Edit badge */}
                {isEditMode && !isFullscreenDisplay && (
                  <div className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-white rounded-full p-1 shadow-md z-10 scale-90 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Edit3 size={10} />
                  </div>
                )}
              </motion.div>
            );
          }
        }
      }
    }

    return cells;
  };

  // 1. RENDER APP ICON
  const renderAppIcon = (item: GridItem) => {
    const isCustomImage = item.iconName === 'custom' && item.iconUrl;
    const isTransparent = item.transparentIconBg;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <div 
          className={`w-[58px] h-[58px] rounded-2xl flex items-center justify-center text-white relative transition-all overflow-hidden
            ${isTransparent 
              ? 'bg-transparent border border-white/5 shadow-none' 
              : 'bg-white/12 backdrop-blur-md border border-white/20 shadow-lg hover:brightness-110'
            }
            active:scale-95`}
        >
          {/* Frosted inner glow only if not transparent */}
          {!isTransparent && <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />}
          
          {isCustomImage ? (
            <img 
              src={item.iconUrl} 
              alt={item.label} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fail-safe for broken image URLs
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
              }}
            />
          ) : (
            <LucideIcon name={item.iconName || 'AppWindow'} className="text-white drop-shadow-sm" size={26} />
          )}

          {/* Sound icon badge if has sound attached */}
          {item.audioUrl && (
            <div className="absolute bottom-1 right-1 bg-black/40 p-0.5 rounded-full text-white/80">
              <Volume2 size={8} />
            </div>
          )}
        </div>
        <span className="text-white text-[10.5px] font-sans font-medium text-center mt-1.5 truncate w-full max-w-[68px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)]">
          {item.label}
        </span>
      </div>
    );
  };

  // 2. RENDER SMALL WIDGET (2x2)
  const renderSmallWidget = (item: GridItem) => {
    const showImage = item.widgetType === 'photo' && item.images && item.images[0];
    const isClock = item.widgetType === 'clock';
    const isWeather = item.widgetType === 'weather';
    const isStocks = item.widgetType === 'stocks';

    return (
      <div className="w-full h-full flex flex-col items-center">
        <div 
          onClick={(e) => {
            if (showImage && item.images && item.images[0]) {
              e.stopPropagation();
              setFullscreenPhoto(item.images[0]);
            }
          }}
          className="w-full aspect-square rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden flex flex-col relative group/widget"
        >
          {showImage ? (
            <img 
              src={item.images![0]} 
              alt={item.title || 'Widget image'} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              referrerPolicy="no-referrer"
            />
          ) : isClock ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-2">
              <span className="text-xs uppercase font-semibold text-cyan-200 tracking-wider">Ora Locale</span>
              <span className="text-3xl font-bold tracking-tight mt-1">{currentTime}</span>
              <span className="text-[10px] text-white/60 font-mono mt-0.5">iOS Simulator</span>
            </div>
          ) : isWeather ? (
            <div className="w-full h-full flex flex-col justify-between text-white p-3.5">
              <div className="flex justify-between items-start">
                <CloudSun className="text-amber-200 drop-shadow-md" size={32} />
                <span className="text-2xl font-bold font-sans">24°</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/90">Roma</p>
                <p className="text-[10px] text-white/60">Parzialmente Nuvoloso</p>
              </div>
            </div>
          ) : isStocks ? (
            <div className="w-full h-full flex flex-col justify-between text-white p-3.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold font-mono bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">AAPL</span>
                <TrendingUp className="text-emerald-400" size={18} />
              </div>
              <div>
                <p className="text-xl font-bold font-mono">$189.84</p>
                <p className="text-[10px] text-emerald-400 font-semibold">+1.48% (Oggi)</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
              Widget 2x2
            </div>
          )}
        </div>
        {item.title && (
          <span className="text-white/60 text-[9px] font-sans font-semibold uppercase tracking-wider text-center mt-1 truncate w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {item.title}
          </span>
        )}
      </div>
    );
  };

  // 3. RENDER MEDIUM WIDGET (4x2) - Polaroids Widget
  const renderMediumWidget = (item: GridItem) => {
    const isPolaroid = item.widgetType === 'polaroid';
    const photos = item.images || [];

    return (
      <div className="w-full h-full flex flex-col items-center justify-between">
        <div className="w-full h-[126px] rounded-[26px] bg-white/8 backdrop-blur-lg border border-white/18 shadow-xl flex items-center justify-around p-2.5 overflow-hidden relative">
          
          <div className="absolute -bottom-10 inset-x-0 h-16 bg-cyan-400/10 blur-xl pointer-events-none" />

          {isPolaroid ? (
            <>
              {/* Polaroid 1 (Left tilt) */}
              <div 
                onClick={(e) => {
                  if (photos[0]) {
                    e.stopPropagation();
                    setFullscreenPhoto(photos[0]);
                  }
                }}
                className="w-[28%] bg-white p-1 pb-3 shadow-md rounded-[2px] rotate-[-5deg] translate-y-1 transform transition-all duration-300 flex flex-col justify-between aspect-[3/4] cursor-zoom-in hover:rotate-0 hover:scale-105 hover:z-20"
              >
                <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative border border-black/5">
                  {photos[0] ? (
                    <img 
                      src={photos[0]} 
                      alt="Polaroid 1" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-200 to-neutral-300">
                      <Plus className="text-neutral-400" size={14} />
                    </div>
                  )}
                </div>
                <div className="h-2 w-full flex items-center justify-center">
                  <span className="text-[6px] font-semibold text-neutral-400 tracking-wide font-sans">MEMORIA</span>
                </div>
              </div>

              {/* Polaroid 2 (Straight / Centered) */}
              <div 
                onClick={(e) => {
                  if (photos[1]) {
                    e.stopPropagation();
                    setFullscreenPhoto(photos[1]);
                  }
                }}
                className="w-[28%] bg-white p-1 pb-3 shadow-lg rounded-[2px] translate-y-[-2px] transform transition-all duration-300 flex flex-col justify-between aspect-[3/4] z-10 cursor-zoom-in hover:scale-105 hover:z-20"
              >
                <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative border border-black/5">
                  {photos[1] ? (
                    <img 
                      src={photos[1]} 
                      alt="Polaroid 2" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-200 to-neutral-300">
                      <Plus className="text-neutral-400" size={14} />
                    </div>
                  )}
                </div>
                <div className="h-2 w-full flex items-center justify-center">
                  <span className="text-[6px] font-semibold text-neutral-400 tracking-wide font-sans">ESTATE</span>
                </div>
              </div>

              {/* Polaroid 3 (Right tilt) */}
              <div 
                onClick={(e) => {
                  if (photos[2]) {
                    e.stopPropagation();
                    setFullscreenPhoto(photos[2]);
                  }
                }}
                className="w-[28%] bg-white p-1 pb-3 shadow-md rounded-[2px] rotate-[5deg] translate-y-1 transform transition-all duration-300 flex flex-col justify-between aspect-[3/4] cursor-zoom-in hover:rotate-0 hover:scale-105 hover:z-20"
              >
                <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative border border-black/5">
                  {photos[2] ? (
                    <img 
                      src={photos[2]} 
                      alt="Polaroid 3" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-200 to-neutral-300">
                      <Plus className="text-neutral-400" size={14} />
                    </div>
                  )}
                </div>
                <div className="h-2 w-full flex items-center justify-center">
                  <span className="text-[6px] font-semibold text-neutral-400 tracking-wide font-sans">SOGNO</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-sm font-sans">
              Widget 4x2
            </div>
          )}
        </div>
        {item.title && (
          <span className="text-white/60 text-[9.5px] font-sans font-semibold uppercase tracking-wider text-center mt-1 truncate w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {item.title}
          </span>
        )}
      </div>
    );
  };

  // Dot navigations
  const handlePrevPage = () => {
    if (activePage > 0) setActivePage(activePage - 1);
  };

  const handleNextPage = () => {
    if (activePage < totalPages - 1) setActivePage(activePage + 1);
  };

  return (
    <div 
      id="iphone-wrapper"
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      className={`bg-black relative flex flex-col transition-all duration-500 overflow-hidden select-none
        ${isFullscreenDisplay 
          ? 'fixed inset-0 w-full h-full sm:max-w-[430px] sm:h-[92%] sm:rounded-[52px] sm:border-[8px] sm:border-slate-850 sm:shadow-2xl sm:m-auto rounded-none border-0 ring-0 shadow-none z-40' 
          : 'rounded-[52px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-4 ring-slate-800/50 w-[335px] h-[700px]'
        }`}
    >
      {/* High-fidelity background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url("${backgroundUrl}")` }}
      />
      
      {/* Dynamic/Dark shading overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Dynamic Island / Notch */}
      <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-[90px] h-[25px] bg-black rounded-full z-40 flex items-center justify-between px-3">
        <div className="w-2.5 h-2.5 bg-neutral-900 border border-neutral-800 rounded-full" />
        <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
      </div>

      {/* Status Bar: Only has the battery icon symbol, NO text percent like "58%" as requested! */}
      <div className={`px-6 flex justify-between items-end pb-1.5 text-white font-sans text-[12px] font-semibold z-30 relative select-none
        ${isFullscreenDisplay ? 'pt-5 h-14' : 'h-10'}`}
      >
        <span>{currentTime}</span>
        <div className="flex items-center gap-1.5">
          <Signal size={12} className="text-white" />
          <Wifi size={12} className="text-white" />
          <div className="flex items-center gap-0.5">
            {/* Battery symbol ONLY, no percentage string! */}
            <Battery size={15} className="text-white" />
          </div>
        </div>
      </div>

      {/* Main Home Screen Grid container - filters items belonging to activePage */}
      <div className="flex-1 px-4 pt-2 pb-4 overflow-y-auto z-20 relative scrollbar-none flex flex-col justify-between">
        <div className={`grid grid-cols-4 grid-rows-6 gap-x-2.5 gap-y-4 ${isFullscreenDisplay ? 'h-full flex-grow py-2' : 'h-[440px]'}`}>
          {renderGrid()}
        </div>
      </div>

      {/* Swipe Overlay Arrows for easier navigation on desktop */}
      {totalPages > 1 && (
        <>
          {activePage > 0 && (
            <button
              onClick={handlePrevPage}
              className="absolute left-1.5 top-[40%] transform -translate-y-1/2 bg-black/40 hover:bg-black/60 border border-white/10 text-white p-1.5 rounded-full z-30 transition-all active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {activePage < totalPages - 1 && (
            <button
              onClick={handleNextPage}
              className="absolute right-1.5 top-[40%] transform -translate-y-1/2 bg-black/40 hover:bg-black/60 border border-white/10 text-white p-1.5 rounded-full z-30 transition-all active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </>
      )}

      {/* Paginated dots (aesthetic & fully clickable!) */}
      <div className="h-5 flex items-center justify-center gap-1.5 z-20 relative select-none">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActivePage(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${activePage === idx 
                ? 'bg-white scale-125 shadow-sm' 
                : 'bg-white/40 hover:bg-white/60'
              }`}
            title={`Vai a pagina ${idx + 1}`}
          />
        ))}

        {/* "+" Button to add a page instantly in Edit Mode */}
        {isEditMode && !isFullscreenDisplay && (
          <button
            onClick={onAddPage}
            className="w-4 h-4 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold border border-cyan-500/30 transition-all ml-1"
            title="Aggiungi nuova pagina"
          >
            +
          </button>
        )}

        {/* "-" Button to remove current empty/stale page */}
        {isEditMode && totalPages > 1 && !isFullscreenDisplay && (
          <button
            onClick={() => onDeletePage(activePage)}
            className="w-4 h-4 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 flex items-center justify-center text-[10px] font-bold border border-red-500/30 transition-all ml-0.5"
            title="Elimina questa pagina"
          >
            -
          </button>
        )}
      </div>

      {/* Dock container */}
      <div className="p-3 pb-4 z-20 relative select-none">
        <div className="w-full h-[78px] rounded-[28px] bg-white/12 backdrop-blur-xl border border-white/18 shadow-xl flex justify-around items-center px-2">
          {dockItems.map((item, index) => {
            const isSelected = selectedItemId === item.id;
            const isCustomImage = item.iconName === 'custom' && item.iconUrl;
            const isTransparent = item.transparentIconBg;

            return (
              <motion.div
                key={item.id}
                layoutId={`dock-layout-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();

                  // Play sound on click in preview/fullscreen or normal modes
                  if (item.audioUrl) {
                    playAudio(item.audioUrl);
                  }

                  if (!isFullscreenDisplay) {
                    onSelectItem(item);
                  }
                }}
                className={`relative flex flex-col items-center justify-center cursor-pointer group w-[58px] h-[58px] rounded-2xl shadow-md transition-all overflow-hidden
                  ${isTransparent
                    ? 'bg-transparent border border-white/5 shadow-none'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 hover:brightness-115'
                  }
                  active:scale-95
                  ${isSelected && !isFullscreenDisplay ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900 scale-95' : ''}
                `}
              >
                {isCustomImage ? (
                  <img 
                    src={item.iconUrl} 
                    alt={item.label} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <LucideIcon name={item.iconName || 'AppWindow'} className="text-white drop-shadow-sm" size={26} />
                )}

                {/* Sound icon badge */}
                {item.audioUrl && (
                  <div className="absolute bottom-1 right-1 bg-black/40 p-0.5 rounded-full text-white/80">
                    <Volume2 size={8} />
                  </div>
                )}

                {/* Edit badge */}
                {isEditMode && !isFullscreenDisplay && (
                  <div className="absolute top-1 right-1 bg-cyan-500 text-white rounded-full p-0.5 shadow z-10 scale-75 opacity-90">
                    <Edit3 size={8} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Render empty dock slots if under 4 items */}
          {Array(Math.max(0, 4 - dockItems.length))
            .fill(null)
            .map((_, i) => {
              const colIndex = dockItems.length + i;
              return (
                <div
                  key={`dock-empty-${colIndex}`}
                  onClick={() => {
                    if (!isFullscreenDisplay) {
                      onSelectItem({ type: 'empty', row: 99, col: colIndex, isDock: true });
                    }
                  }}
                  className={`w-[58px] h-[58px] rounded-2xl flex items-center justify-center transition-all border border-dashed border-white/20 bg-white/5 hover:bg-white/10
                    ${isFullscreenDisplay ? 'pointer-events-none opacity-0' : 'cursor-pointer'}`}
                >
                  {isEditMode && !isFullscreenDisplay && <Plus className="text-white/30" size={16} />}
                </div>
              );
            })}
        </div>
      </div>

      {/* Home Indicator Bar */}
      <div 
        onClick={isFullscreenDisplay && onToggleFullscreenDisplay ? onToggleFullscreenDisplay : undefined}
        className={`h-5 flex items-center justify-center pb-2 z-30 relative select-none
          ${isFullscreenDisplay && onToggleFullscreenDisplay ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-all' : ''}`}
        title={isFullscreenDisplay ? "Clicca per uscire dallo Schermo Intero" : undefined}
      >
        <div className="w-[110px] h-1.5 bg-white/80 rounded-full" />
      </div>

      {/* Discreet Exit Button for Fullscreen Mode */}
      {isFullscreenDisplay && onToggleFullscreenDisplay && (
        <button
          onClick={onToggleFullscreenDisplay}
          className="absolute bottom-6 right-6 z-40 bg-black/45 hover:bg-black/80 text-white/80 hover:text-white rounded-full p-2 backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-90"
          title="Esci dallo Schermo Intero"
        >
          <X size={15} />
        </button>
      )}

      {/* INTERACTIVE FULLSCREEN PHOTO PREVIEW OVERLAY */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Img Container that fills the screen perfectly */}
            <img
              src={fullscreenPhoto}
              alt="Fullscreen iOS Image"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />

            {/* Premium, translucent circular floating close button below notch & status bar */}
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-14 right-4 bg-black/60 hover:bg-black/85 text-white/90 hover:text-white rounded-full p-2.5 backdrop-blur-md border border-white/10 shadow-xl transition-all active:scale-90 z-[60]"
              title="Chiudi anteprima"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
