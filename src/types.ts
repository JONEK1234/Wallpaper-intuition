export interface GridItem {
  id: string;
  row: number; // 0 to 5
  col: number; // 0 to 3
  w: number;   // 1 to 4
  h: number;   // 1 to 4
  type: 'app' | 'widget_small' | 'widget_medium' | 'widget_large';
  label?: string;
  iconName?: string; // Lucide icon name or 'custom'
  iconUrl?: string;  // Custom image URL or base64 data for the icon
  transparentIconBg?: boolean; // Toggles whether the app icon background is transparent
  audioUrl?: string; // Base64 data or link to an audio file played on click
  page?: number; // Multi-page support (0, 1, 2...)
  
  // Widget config
  widgetType?: 'photo' | 'weather' | 'clock' | 'stocks' | 'polaroid';
  images?: string[]; // Array of image URLs/base64 for photo/polaroid widgets
  title?: string;     // Custom title for the widget (e.g. "iScreen")
  themeColor?: string; // Accent tint
}

export interface BackgroundPreset {
  id: string;
  name: string;
  url: string;
}

export interface UserPhoto {
  id: string;
  name: string;
  url: string;
}
