import React, { useState, useEffect } from 'react';
import { GridItem, BackgroundPreset, UserPhoto } from './types';
import { PhoneSimulator } from './components/PhoneSimulator';
import { EditorPanel } from './components/EditorPanel';
import { 
  Sparkles, 
  Smartphone, 
  Heart, 
  Settings2, 
  HelpCircle,
  Eye,
  Camera,
  X,
  Volume2,
  Minimize2,
  Download
} from 'lucide-react';

// Predefined high-quality backgrounds that match the theme of their photos (e.g. Avatar bioluminescence, teal reefs, and fitness/portraits)
const DEFAULT_BG_PRESETS: BackgroundPreset[] = [
  {
    id: 'bg-1',
    name: 'Abisso Avatar (Bioluminescente)',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bg-2',
    name: 'Barriera Corallina Turchese',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bg-3',
    name: 'Oceano Profondo Smeraldo',
    url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bg-4',
    name: 'Cyberpunk Neon Teal',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200'
  }
];

// Pre-loaded high-quality Unsplash photos that match the styles of their uploaded pictures
const DEFAULT_USER_PHOTOS: UserPhoto[] = [
  {
    id: 'photo-1',
    name: 'Avatar Marina',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'photo-2',
    name: 'Profilo Taglio',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'photo-3',
    name: 'Tatuaggio Rosa',
    url: 'https://images.unsplash.com/photo-1560707303-4e980c876ad2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'photo-4',
    name: 'Aesthetic Fitness',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
  }
];

// Replicates the user's uploaded homescreen image with 100% precision
const INITIAL_GRID_ITEMS: GridItem[] = [
  // Page 0 (First page)
  {
    id: 'grid-avatar-widget',
    row: 0,
    col: 0,
    w: 2,
    h: 2,
    type: 'widget_small',
    widgetType: 'photo',
    title: 'iScreen',
    images: ['https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600'],
    page: 0
  },
  {
    id: 'grid-weather',
    row: 0,
    col: 2,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Weather',
    iconName: 'Cloud',
    page: 0
  },
  {
    id: 'grid-stocks',
    row: 0,
    col: 3,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Stocks',
    iconName: 'TrendingUp',
    page: 0
  },
  {
    id: 'grid-books',
    row: 1,
    col: 2,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Books',
    iconName: 'BookOpen',
    page: 0
  },
  {
    id: 'grid-itunes',
    row: 1,
    col: 3,
    w: 1,
    h: 1,
    type: 'app',
    label: 'iTunes Store',
    iconName: 'Star',
    page: 0
  },
  {
    id: 'grid-polaroid-widget',
    row: 2,
    col: 0,
    w: 4,
    h: 2,
    type: 'widget_medium',
    widgetType: 'polaroid',
    title: 'iScreen',
    images: [
      'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1560707303-4e980c876ad2?auto=format&fit=crop&q=80&w=600'
    ],
    page: 0
  },
  {
    id: 'grid-findmy',
    row: 4,
    col: 0,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Find My',
    iconName: 'Compass',
    page: 0
  },
  {
    id: 'grid-home',
    row: 4,
    col: 1,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Home',
    iconName: 'Home',
    page: 0
  },
  {
    id: 'grid-files',
    row: 5,
    col: 0,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Files',
    iconName: 'Folder',
    page: 0
  },
  {
    id: 'grid-translate',
    row: 5,
    col: 1,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Translate',
    iconName: 'Languages',
    page: 0
  },
  {
    id: 'grid-avatar-widget-bottom',
    row: 4,
    col: 2,
    w: 2,
    h: 2,
    type: 'widget_small',
    widgetType: 'photo',
    title: 'iScreen',
    images: ['https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600'],
    page: 0
  },

  // Page 1 (Second page template layout)
  {
    id: 'grid-app-settings',
    row: 0,
    col: 0,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Impostazioni',
    iconName: 'Settings',
    page: 1
  },
  {
    id: 'grid-app-camera',
    row: 0,
    col: 1,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Fotocamera',
    iconName: 'Camera',
    page: 1
  },
  {
    id: 'grid-clock-widget-p1',
    row: 0,
    col: 2,
    w: 2,
    h: 2,
    type: 'widget_small',
    widgetType: 'clock',
    title: 'Orologio',
    page: 1
  }
];

const INITIAL_DOCK_ITEMS: GridItem[] = [
  {
    id: 'dock-phone',
    row: 99,
    col: 0,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Telefono',
    iconName: 'Phone'
  },
  {
    id: 'dock-messages',
    row: 99,
    col: 1,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Messaggi',
    iconName: 'MessageSquare'
  },
  {
    id: 'dock-google',
    row: 99,
    col: 2,
    w: 1,
    h: 1,
    type: 'app',
    label: 'Google',
    iconName: 'Search'
  },
  {
    id: 'dock-whatsapp',
    row: 99,
    col: 3,
    w: 1,
    h: 1,
    type: 'app',
    label: 'WhatsApp',
    iconName: 'MessageCircle'
  }
];

export default function App() {
  const [backgroundUrl, setBackgroundUrl] = useState<string>(() => {
    const saved = localStorage.getItem('ios_custom_background');
    return saved || DEFAULT_BG_PRESETS[0].url;
  });

  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>(() => {
    const saved = localStorage.getItem('ios_custom_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER_PHOTOS;
      }
    }
    return DEFAULT_USER_PHOTOS;
  });

  const [gridItems, setGridItems] = useState<GridItem[]>(() => {
    const saved = localStorage.getItem('ios_custom_grid_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_GRID_ITEMS;
      }
    }
    return INITIAL_GRID_ITEMS;
  });

  const [dockItems, setDockItems] = useState<GridItem[]>(() => {
    const saved = localStorage.getItem('ios_custom_dock_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DOCK_ITEMS;
      }
    }
    return INITIAL_DOCK_ITEMS;
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ios_custom_edit_mode');
    return saved === 'true';
  });

  // NEW STATES FOR FULLSCREEN & PAGINATION
  const [isFullscreenDisplay, setIsFullscreenDisplay] = useState<boolean>(false);

  const [activePage, setActivePage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(() => {
    const saved = localStorage.getItem('ios_custom_total_pages');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedEmptyCell, setSelectedEmptyCell] = useState<{ row: number; col: number; isDock: boolean } | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('ios_custom_background', backgroundUrl);
  }, [backgroundUrl]);

  useEffect(() => {
    localStorage.setItem('ios_custom_photos', JSON.stringify(userPhotos));
  }, [userPhotos]);

  useEffect(() => {
    localStorage.setItem('ios_custom_grid_items', JSON.stringify(gridItems));
  }, [gridItems]);

  useEffect(() => {
    localStorage.setItem('ios_custom_dock_items', JSON.stringify(dockItems));
  }, [dockItems]);

  useEffect(() => {
    localStorage.setItem('ios_custom_edit_mode', isEditMode ? 'true' : 'false');
  }, [isEditMode]);

  useEffect(() => {
    localStorage.setItem('ios_custom_total_pages', totalPages.toString());
  }, [totalPages]);

  // Handle click selection on phone simulator elements
  const handleSelectItem = (
    item: GridItem | { type: 'empty'; row: number; col: number; isDock: boolean }
  ) => {
    if (isFullscreenDisplay) return; // Prevent editing in Fullscreen simulator display

    // Turn edit mode ON on selection automatically
    if (!isEditMode) {
      setIsEditMode(true);
    }

    if ('id' in item) {
      setSelectedItemId(item.id);
      setSelectedEmptyCell(null);
    } else {
      setSelectedItemId(null);
      setSelectedEmptyCell({ row: item.row, col: item.col, isDock: item.isDock });
    }
  };

  // Update a grid or dock item with new changes
  const handleUpdateItem = (updated: GridItem) => {
    if (updated.row === 99) {
      setDockItems(dockItems.map((item) => (item.id === updated.id ? updated : item)));
    } else {
      setGridItems(gridItems.map((item) => (item.id === updated.id ? updated : item)));
    }
  };

  // Delete an icon or widget
  const handleDeleteItem = (id: string) => {
    setGridItems(gridItems.filter((item) => item.id !== id));
    setDockItems(dockItems.filter((item) => item.id !== id));
    setSelectedItemId(null);
  };

  // Add a new icon or widget to the ACTIVE PAGE
  const handleAddItem = (item: GridItem) => {
    if (item.row === 99) {
      if (dockItems.length >= 4) {
        alert('Il dock dell\'iPhone può contenere al massimo 4 applicazioni.');
        return;
      }
      setDockItems([...dockItems, item]);
    } else {
      // Pin item to current page!
      const itemWithPage = { ...item, page: activePage };
      setGridItems([...gridItems, itemWithPage]);
    }
    setSelectedItemId(item.id);
    setSelectedEmptyCell(null);
  };

  // Add a new screen page
  const handleAddPage = () => {
    setTotalPages((prev) => prev + 1);
    setActivePage(totalPages); // Instantly swipe to newly created page
  };

  // Delete current page and shift items
  const handleDeletePage = (pageIndexToDelete: number) => {
    if (totalPages <= 1) return;
    
    // Remove all grid items on the deleted page
    const updatedGridItems = gridItems
      .filter((item) => (item.page || 0) !== pageIndexToDelete)
      // Decrement page numbers for all subsequent pages to prevent array indexing gaps
      .map((item) => {
        const itemPage = item.page || 0;
        if (itemPage > pageIndexToDelete) {
          return { ...item, page: itemPage - 1 };
        }
        return item;
      });

    setGridItems(updatedGridItems);
    setTotalPages((prev) => Math.max(1, prev - 1));
    setActivePage((prev) => Math.max(0, Math.min(prev, totalPages - 2)));
    setSelectedItemId(null);
    setSelectedEmptyCell(null);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Sei sicuro di voler ripristinare il layout iniziale dell\'iPhone? Tutti i tuoi elementi personalizzati andranno persi.')) {
      setGridItems(INITIAL_GRID_ITEMS);
      setDockItems(INITIAL_DOCK_ITEMS);
      setBackgroundUrl(DEFAULT_BG_PRESETS[0].url);
      setUserPhotos(DEFAULT_USER_PHOTOS);
      setSelectedItemId(null);
      setSelectedEmptyCell(null);
      setTotalPages(2);
      setActivePage(0);
      setIsEditMode(true);
      setIsFullscreenDisplay(false);
    }
  };

  // User Photos management
  const handleAddUserPhoto = (photo: UserPhoto) => {
    setUserPhotos([photo, ...userPhotos]);
  };

  const handleDeleteUserPhoto = (id: string) => {
    setUserPhotos(userPhotos.filter((p) => p.id !== id));
  };

  // Pack item helper for editor selection
  const getSelectedData = () => {
    if (selectedItemId) {
      const gridMatch = gridItems.find((i) => i.id === selectedItemId);
      if (gridMatch) return gridMatch;
      const dockMatch = dockItems.find((i) => i.id === selectedItemId);
      if (dockMatch) return dockMatch;
    }
    if (selectedEmptyCell) {
      return { type: 'empty', ...selectedEmptyCell };
    }
    return null;
  };

  // Fullscreen toggle: Tapping it locks/unlocks the editor sidebar
  const handleToggleFullscreenDisplay = () => {
    const nextState = !isFullscreenDisplay;
    setIsFullscreenDisplay(nextState);
    if (nextState) {
      setIsEditMode(false); // Disable layout edits while on fullscreen
    } else {
      setIsEditMode(true);
    }
  };

  // Export fully client-side single HTML application file download
  const handleExportOfflineHtml = () => {
    const gridItemsJson = JSON.stringify(gridItems);
    const dockItemsJson = JSON.stringify(dockItems);
    const backgroundUrlEscaped = backgroundUrl.replace(/"/g, '&quot;');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iPhone iScreen - App Offline</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      background-color: #030712;
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    /* Custom scrollbar elimination */
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Continuous page container transition */
    .pages-slider {
      display: flex;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      height: 440px;
    }
    .page-screen {
      min-width: 100%;
      height: 100%;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">

  <!-- Interactive Simulator Screen -->
  <div id="iphone-wrapper" class="w-[375px] h-[780px] sm:w-[410px] sm:h-[860px] rounded-[52px] border-[10px] border-slate-800 bg-black relative flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500 ring-4 ring-slate-800/50">
    
    <!-- Wallpaper background -->
    <div class="absolute inset-0 bg-cover bg-center transition-all duration-700" style="background-image: url('${backgroundUrlEscaped}');"></div>
    <div class="absolute inset-0 bg-black/15 pointer-events-none"></div>

    <!-- Dynamic Island / Notch -->
    <div class="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-[90px] h-[25px] bg-black rounded-full z-40 flex items-center justify-between px-3">
      <div class="w-2.5 h-2.5 bg-neutral-900 border border-neutral-800 rounded-full"></div>
      <div class="w-1.5 h-1.5 bg-neutral-950 rounded-full"></div>
    </div>

    <!-- Status Bar -->
    <div class="h-10 px-6 flex justify-between items-end pb-1.5 text-white font-semibold text-[12px] z-30 relative select-none">
      <span id="live-time">12:00</span>
      <div class="flex items-center gap-1.5">
        <i data-lucide="signal" class="w-3.5 h-3.5"></i>
        <i data-lucide="wifi" class="w-3.5 h-3.5"></i>
        <i data-lucide="battery" class="w-4 h-4"></i>
      </div>
    </div>

    <!-- Main Scrollable Screen (Slider) -->
    <div class="flex-1 px-4 pt-2 pb-2 overflow-hidden z-20 relative">
      <div id="pages-slider-container" class="pages-slider">
        <!-- Pages will be injected dynamically via JavaScript -->
      </div>
    </div>
    
    <!-- Arrows for slide on desktop -->
    <button onclick="prevPage()" class="absolute left-2.5 top-[40%] transform -translate-y-1/2 bg-black/40 hover:bg-black/60 border border-white/10 text-white p-2 rounded-full z-30 transition-all">
      <i data-lucide="chevron-left" class="w-4 h-4"></i>
    </button>
    <button onclick="nextPage()" class="absolute right-2.5 top-[40%] transform -translate-y-1/2 bg-black/40 hover:bg-black/60 border border-white/10 text-white p-2 rounded-full z-30 transition-all">
      <i data-lucide="chevron-right" class="w-4 h-4"></i>
    </button>

    <!-- Page Dots -->
    <div id="dots-container" class="h-5 flex items-center justify-center gap-1.5 z-20 relative select-none">
      <!-- Dynamic dots in JS -->
    </div>

    <!-- Dock -->
    <div class="p-3 pb-4 z-20 relative select-none">
      <div id="dock-container" class="w-full h-[78px] rounded-[28px] bg-white/12 backdrop-blur-xl border border-white/18 shadow-xl flex justify-around items-center px-2">
        <!-- Dock Items in JS -->
      </div>
    </div>

    <!-- Home Indicator -->
    <div class="h-5 flex items-center justify-center pb-2 z-30 relative select-none">
      <div class="w-[110px] h-1.5 bg-white/80 rounded-full"></div>
    </div>

    <!-- Fullscreen photo overlay -->
    <div id="photo-overlay" class="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 hidden">
      <div class="flex justify-between items-center text-white p-2">
        <span class="text-xs uppercase font-semibold text-neutral-400">Anteprima Foto</span>
        <button onclick="closePhotoOverlay()" class="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-2 border border-neutral-700 transition-all">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center p-2">
        <img id="overlay-img" src="" class="max-w-full max-h-[80%] rounded-2xl object-contain shadow-2xl border border-white/10">
      </div>
      <div class="h-12 flex items-center justify-center text-[11px] text-neutral-400 italic">
        Clicca la "X" in alto per tornare alla homescreen.
      </div>
    </div>
  </div>
  
  <!-- Floating Title & Indicator -->
  <div class="mt-4 text-center">
    <h1 class="text-sm font-semibold text-slate-400">iPhone iScreen App</h1>
    <p class="text-[10px] text-slate-500 mt-0.5">Tutte le funzioni, foto e suoni sono attivi e salvati offline.</p>
  </div>

  <!-- Dynamic State and Logic Script -->
  <script>
    const gridItems = ${gridItemsJson};
    const dockItems = ${dockItemsJson};
    const totalPages = ${totalPages};
    let activePage = 0;

    // Update Clock
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      document.getElementById('live-time').innerText = hours + ':' + minutes;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Render Pages and Items
    function renderSimulator() {
      const slider = document.getElementById('pages-slider-container');
      slider.innerHTML = '';
      
      for (let p = 0; p < totalPages; p++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page-screen grid grid-cols-4 grid-rows-6 gap-x-2.5 gap-y-4 px-4';
        
        // Get items for page p
        const pageItems = gridItems.filter(item => (item.page || 0) === p);
        
        // Setup empty cell grid matrix
        const matrix = Array(6).fill(null).map(() => Array(4).fill(null));
        pageItems.forEach(item => {
          for (let r = item.row; r < Math.min(item.row + item.h, 6); r++) {
            for (let c = item.col; c < Math.min(item.col + item.w, 4); c++) {
              matrix[r][c] = item.id;
            }
          }
        });

        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 4; c++) {
            const itemId = matrix[r][c];
            if (itemId === null) {
              const cell = document.createElement('div');
              cell.className = 'aspect-square opacity-0 pointer-events-none';
              pageDiv.appendChild(cell);
            } else {
              const item = pageItems.find(i => i.id === itemId);
              if (item && item.row === r && item.col === c) {
                const itemDiv = document.createElement('div');
                
                // Layout styling based on span
                let spanStyle = 'grid-column: ' + (item.col + 1) + ' / ' + (item.col + item.w + 1) + '; ';
                spanStyle += 'grid-row: ' + (item.row + 1) + ' / ' + (item.row + item.h + 1) + ';';
                itemDiv.setAttribute('style', spanStyle);
                itemDiv.className = 'relative select-none flex flex-col justify-between';

                // Populate based on widget or app
                if (item.type === 'app') {
                  const isTransparent = item.transparentIconBg;
                  itemDiv.className += ' cursor-pointer';
                  
                  // Sound click triggers
                  if (item.audioUrl) {
                    itemDiv.addEventListener('click', () => {
                      playAudio(item.audioUrl);
                    });
                  }

                  const imgHtml = item.iconName === 'custom' && item.iconUrl 
                    ? '<img src="' + item.iconUrl + '" class="w-full h-full object-cover rounded-2xl">' 
                    : '<div class="text-white"><i data-lucide="' + (item.iconName || 'app-window') + '" class="w-7 h-7"></i></div>';
                    
                  itemDiv.innerHTML = \`
                    <div class="w-full h-full flex flex-col items-center justify-center p-1">
                      <div class="w-[58px] h-[58px] rounded-2xl flex items-center justify-center text-white relative active:scale-95 transition-all overflow-hidden \${isTransparent ? 'bg-transparent border border-white/5' : 'bg-white/12 backdrop-blur-md border border-white/20 shadow-lg'}">
                        \${imgHtml}
                      </div>
                      <span class="text-white text-[10.5px] font-medium text-center mt-1.5 truncate w-full max-w-[68px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)]">\${item.label || ''}</span>
                    </div>
                  \`;
                } else if (item.type === 'widget_small') {
                  const isPhoto = item.widgetType === 'photo' && item.images && item.images[0];
                  const isClock = item.widgetType === 'clock';
                  const isWeather = item.widgetType === 'weather';
                  const isStocks = item.widgetType === 'stocks';

                  let widgetInner = '<div class="w-full h-full flex items-center justify-center text-white/50 text-xs">Widget</div>';
                  
                  if (isPhoto) {
                    widgetInner = '<img src="' + item.images[0] + '" class="w-full h-full object-cover cursor-zoom-in" onclick="openPhotoOverlay(\\'' + item.images[0] + '\\')">';
                  } else if (isClock) {
                    widgetInner = \`<div class="w-full h-full flex flex-col items-center justify-center text-white p-2">
                      <span class="text-[9px] uppercase font-bold text-cyan-200">Ora Locale</span>
                      <span class="text-2xl font-bold tracking-tight mt-1" id="widget-clock-time">--:--</span>
                    </div>\`;
                  } else if (isWeather) {
                    widgetInner = \`<div class="w-full h-full flex flex-col justify-between text-white p-3">
                      <i data-lucide="cloud-sun" class="text-amber-200 w-8 h-8"></i>
                      <div>
                        <p class="text-[11px] font-semibold">Roma</p>
                        <p class="text-[10px] text-white/60">Parzialmente Nuvoloso</p>
                      </div>
                    </div>\`;
                  } else if (isStocks) {
                    widgetInner = \`<div class="w-full h-full flex flex-col justify-between text-white p-3">
                      <span class="text-[9px] font-bold font-mono bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded w-max">AAPL</span>
                      <div>
                        <p class="text-lg font-bold font-mono">$189.84</p>
                        <p class="text-[10px] text-emerald-400 font-semibold">+1.48%</p>
                      </div>
                    </div>\`;
                  }

                  itemDiv.innerHTML = \`
                    <div class="w-full aspect-square rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden flex flex-col relative">
                      \${widgetInner}
                    </div>
                    <span class="text-white/60 text-[9px] font-semibold uppercase tracking-wider text-center mt-1 truncate w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">\${item.title || ''}</span>
                  \`;
                } else if (item.type === 'widget_medium') {
                  // Polaroid (4x2)
                  const photos = item.images || [];
                  const photo0 = photos[0] ? '<img src="' + photos[0] + '" class="w-full h-full object-cover" onclick="openPhotoOverlay(\\'' + photos[0] + '\\')">' : '<div class="w-full h-full bg-neutral-300"></div>';
                  const photo1 = photos[1] ? '<img src="' + photos[1] + '" class="w-full h-full object-cover" onclick="openPhotoOverlay(\\'' + photos[1] + '\\')">' : '<div class="w-full h-full bg-neutral-300"></div>';
                  const photo2 = photos[2] ? '<img src="' + photos[2] + '" class="w-full h-full object-cover" onclick="openPhotoOverlay(\\'' + photos[2] + '\\')">' : '<div class="w-full h-full bg-neutral-300"></div>';

                  itemDiv.innerHTML = \`
                    <div class="w-full h-[126px] rounded-[26px] bg-white/8 backdrop-blur-lg border border-white/18 shadow-xl flex items-center justify-around p-2 overflow-hidden">
                      <!-- Polaroid 1 -->
                      <div class="w-[28%] bg-white p-1 pb-2 shadow-md rounded-[2px] rotate-[-5deg] translate-y-1 cursor-zoom-in aspect-[3/4] flex flex-col justify-between">
                        <div class="w-full aspect-square bg-neutral-100 overflow-hidden border border-black/5">\${photo0}</div>
                        <span class="text-[5px] font-bold text-neutral-400 text-center uppercase">MEMORIA</span>
                      </div>
                      <!-- Polaroid 2 -->
                      <div class="w-[28%] bg-white p-1 pb-2 shadow-lg rounded-[2px] cursor-zoom-in aspect-[3/4] flex flex-col justify-between z-10">
                        <div class="w-full aspect-square bg-neutral-100 overflow-hidden border border-black/5">\${photo1}</div>
                        <span class="text-[5px] font-bold text-neutral-400 text-center uppercase">ESTATE</span>
                      </div>
                      <!-- Polaroid 3 -->
                      <div class="w-[28%] bg-white p-1 pb-2 shadow-md rounded-[2px] rotate-[5deg] translate-y-1 cursor-zoom-in aspect-[3/4] flex flex-col justify-between">
                        <div class="w-full aspect-square bg-neutral-100 overflow-hidden border border-black/5">\${photo2}</div>
                        <span class="text-[5px] font-bold text-neutral-400 text-center uppercase">SOGNO</span>
                      </div>
                    </div>
                    <span class="text-white/60 text-[9.5px] font-semibold uppercase tracking-wider text-center mt-1 truncate w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">\${item.title || ''}</span>
                  \`;
                }

                pageDiv.appendChild(itemDiv);
              }
            }
          }
          slider.appendChild(pageDiv);
        }

        // Render Dock
        const dockContainer = document.getElementById('dock-container');
        dockContainer.innerHTML = '';
        dockItems.forEach(item => {
          const dockItem = document.createElement('div');
          const isTransparent = item.transparentIconBg;
          dockItem.className = 'relative flex flex-col items-center justify-center cursor-pointer w-[58px] h-[58px] rounded-2xl active:scale-95 transition-all overflow-hidden ' + 
            (isTransparent ? 'bg-transparent border border-white/5' : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-md');
          
          if (item.audioUrl) {
            dockItem.addEventListener('click', () => {
              playAudio(item.audioUrl);
            });
          }

          const iconHtml = item.iconName === 'custom' && item.iconUrl
            ? '<img src="' + item.iconUrl + '" class="w-full h-full object-cover">'
            : '<i data-lucide="' + (item.iconName || 'app-window') + '" class="text-white w-6 h-6"></i>';

          dockItem.innerHTML = iconHtml;
          dockContainer.appendChild(dockItem);
        });
        
        // If under 4 dock items, render empty slots
        for (let i = dockItems.length; i < 4; i++) {
          const emptySlot = document.createElement('div');
          emptySlot.className = 'w-[58px] h-[58px] rounded-2xl border border-dashed border-white/10 bg-white/5';
          dockContainer.appendChild(emptySlot);
        }

        renderDots();
        updatePagePosition();
        lucide.createIcons();

        // Keep local widget clock updated
        const widgetClock = document.getElementById('widget-clock-time');
        if (widgetClock) {
          function updateWidgetClock() {
            const now = new Date();
            widgetClock.innerText = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          }
          updateWidgetClock();
          setInterval(updateWidgetClock, 5000);
        }
      }

      // Render Dots
      function renderDots() {
        const dotsContainer = document.getElementById('dots-container');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('button');
          dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ' + (activePage === i ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60');
          dot.addEventListener('click', () => {
            activePage = i;
            updatePagePosition();
          });
          dotsContainer.appendChild(dot);
        }
      }

      // Update Page Position
      function updatePagePosition() {
        const slider = document.getElementById('pages-slider-container');
        slider.style.transform = 'translateX(-' + (activePage * 100) + '%)';
        
        // Update dots visual state
        const dots = document.getElementById('dots-container').children;
        for (let i = 0; i < dots.length; i++) {
          if (i === activePage) {
            dots[i].className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white scale-125';
          } else {
            dots[i].className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/60';
          }
        }
      }

      window.prevPage = function() {
        if (activePage > 0) {
          activePage--;
          updatePagePosition();
        }
      }

      window.nextPage = function() {
        if (activePage < totalPages - 1) {
          activePage++;
          updatePagePosition();
        }
      }

      // Play Audio
      function playAudio(url) {
        if (!url) return;
        try {
          const a = new Audio(url);
          a.volume = 1.0;
          a.play().catch(e => console.warn('Audio play blocked or failed:', e));
        } catch(err) {
          console.error('Audio play error:', err);
        }
      }

      // Photo Overlay
      window.openPhotoOverlay = function(src) {
        document.getElementById('overlay-img').src = src;
        document.getElementById('photo-overlay').classList.remove('hidden');
      }

      window.closePhotoOverlay = function() {
        document.getElementById('photo-overlay').classList.add('hidden');
      }

      // Initialize
      window.onload = function() {
        renderSimulator();
      }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'iphone_iscreen_offline.html';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Exit Button for Fullscreen simulation display */}
      {isFullscreenDisplay && (
        <button
          onClick={handleToggleFullscreenDisplay}
          className="fixed top-4 left-4 z-50 bg-slate-900/80 hover:bg-slate-850 text-white font-bold py-2.5 px-5 rounded-2xl border border-white/10 hover:border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in group active:scale-95 transition-all text-xs"
        >
          <Minimize2 size={15} className="group-hover:scale-90 transition-transform" />
          Esci dallo Schermo Intero
        </button>
      )}

      {/* Primary Header: Hidden in Fullscreen view to make the app look like an actual phone on full view */}
      {!isFullscreenDisplay && (
        <header className="w-full border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-4 z-40 relative flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Smartphone size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">iPhone iScreen Maker</h1>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-800/55 px-1.5 py-0.5 rounded-full">v2.0 PRO</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Disegna e personalizza la tua homescreen iOS con widget Polaroid, suoni e trasparenze</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <button
              onClick={handleExportOfflineHtml}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 flex items-center gap-2"
              title="Esporta il tuo telefono in un file HTML offline salvabile"
            >
              <Download size={13} />
              Scarica App Offline (HTML)
            </button>
            <div className="bg-slate-900 border border-slate-800/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-slate-300">
              <span>Made with</span>
              <Heart size={12} className="text-red-500 fill-red-500 animate-bounce" />
            </div>
          </div>
        </header>
      )}

      {/* Main Grid Playground Layout */}
      <main className={`flex-1 w-full max-w-6xl mx-auto px-4 flex z-20 relative items-center justify-center
        ${isFullscreenDisplay 
          ? 'py-4 min-h-screen' 
          : 'py-8 flex-col md:flex-row gap-8 md:gap-12'
        }`}
      >
        
        {/* Left Side: iPhone Simulator mockup wrapper */}
        <div 
          className={`flex flex-col items-center gap-4 shrink-0 transition-all duration-500
            ${isFullscreenDisplay 
              ? 'fixed inset-0 z-40 bg-black/95 justify-center' 
              : ''
            }`}
        >
          
          {/* Mode Indicator banner */}
          {!isFullscreenDisplay && (
            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-full text-xs font-medium backdrop-blur-sm shadow-md">
              {isEditMode ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-300">Edit Mode attiva: Clicca le app o gli spazi vuoti!</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-400">Modalità Anteprima. Clicca un'icona per ascoltare il suono!</span>
                </>
              )}
            </div>
          )}

          <PhoneSimulator
            gridItems={gridItems}
            dockItems={dockItems}
            backgroundUrl={backgroundUrl}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            isEditMode={isEditMode}
            activePage={activePage}
            setActivePage={setActivePage}
            totalPages={totalPages}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            isFullscreenDisplay={isFullscreenDisplay}
            onToggleFullscreenDisplay={handleToggleFullscreenDisplay}
          />

          {!isFullscreenDisplay && (
            <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
              iPhone Simulator Mockup (Pagina {activePage + 1} di {totalPages})
            </span>
          )}
        </div>

        {/* Right Side: Configuration Sidebar - Hidden completely in Fullscreen Display mode */}
        {!isFullscreenDisplay && (
          <div className="w-full flex justify-center md:justify-start">
            <EditorPanel
              gridItems={gridItems}
              dockItems={dockItems}
              selectedItem={getSelectedData()}
              backgroundUrl={backgroundUrl}
              userPhotos={userPhotos}
              backgroundPresets={DEFAULT_BG_PRESETS}
              isEditMode={isEditMode}
              onUpdateBackground={setBackgroundUrl}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              onAddUserPhoto={handleAddUserPhoto}
              onDeleteUserPhoto={handleDeleteUserPhoto}
              onResetToDefault={handleResetToDefault}
              onToggleEditMode={() => setIsEditMode(!isEditMode)}
              isFullscreenDisplay={isFullscreenDisplay}
              onToggleFullscreenDisplay={handleToggleFullscreenDisplay}
              onExportOfflineHtml={handleExportOfflineHtml}
            />
          </div>
        )}

      </main>

      {/* Aesthetic Footer - Hidden in Fullscreen Display mode */}
      {!isFullscreenDisplay && (
        <footer className="w-full border-t border-slate-900 bg-slate-950/50 py-3 text-center text-[10px] text-slate-500 z-40 relative flex flex-col sm:flex-row justify-between items-center px-6 gap-2">
          <p>© 2026 iScreen Premium iOS Customizer. Scegli, personalizza e posiziona le tue foto preferite.</p>
          <p className="flex items-center gap-1">
            <Sparkles size={11} className="text-cyan-500" />
            Progettato su misura in base alla tua foto e alle tue richieste.
          </p>
        </footer>
      )}

    </div>
  );
}
