
import {
  Calendar,
  HeartPulse,
  Receipt,
  FileText,
  Smile,
  KeyRound,
  LucideIcon,
  Calculator,
  Image,
  Shield,
  PieChart,
  PiggyBank,
  Shrink,
  Camera,
  Download,
  PenSquare,
  FileImage,
  CaseUpper,
  QrCode,
  Instagram,
  Palette,
  Twitter,
  Pen,
} from 'lucide-react';

export type ToolCategory = 'Calculators' | 'Text Tools' | 'Media Tools' | 'Security Tools' | 'Business Tools' | 'Social Media';

export interface Tool {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: ToolCategory;
  isTrending?: boolean;
}

export const allTools: Tool[] = [
  // Social Media
  {
    name: 'Instagram Post Generator',
    description: 'Create realistic mockups of Instagram posts.',
    href: '/instagram-post-generator',
    icon: Instagram,
    category: 'Social Media',
    isTrending: true,
  },
  {
    name: 'Twitter Post Generator',
    description: 'Create realistic mockups of Twitter (X) posts.',
    href: '/twitter-post-generator',
    icon: Twitter,
    category: 'Social Media',
    isTrending: true,
  },
  // Media Tools
  {
    name: 'Image Compressor',
    description: 'Reduce image file size (MB to KB).',
    href: '/image-compressor',
    icon: Shrink,
    category: 'Media Tools',
  },
  {
    name: 'Passport Photo Maker',
    description: 'Create passport, PAN, or visa size photos.',
    href: '/passport-photo-maker',
    icon: Camera,
    category: 'Media Tools',
    isTrending: true,
  },
   {
    name: 'YT Thumbnail Downloader',
    description: 'Download HD thumbnails from YouTube videos.',
    href: '/youtube-thumbnail-downloader',
    icon: Download,
    category: 'Media Tools',
  },
  {
    name: 'Image to PDF Converter',
    description: 'Convert JPG, PNG images to PDF files.',
    href: '/image-to-pdf-converter',
    icon: FileImage,
    category: 'Media Tools',
  },
  {
    name: 'Instagram Filters',
    description: 'Apply Instagram-like filters to your photos.',
    href: '/image-filter-editor',
    icon: Palette,
    category: 'Media Tools',
    isTrending: true,
  },
  // Security Tools
  {
    name: 'Password Generator',
    description: 'Create strong, random passwords.',
    href: '/password-generator',
    icon: KeyRound,
    category: 'Security Tools',
  },
  // Business Tools
  {
    name: 'QR Code Generator',
    description: 'Create unique and professional QR codes in seconds.',
    href: '/qr-code-generator',
    icon: QrCode,
    category: 'Business Tools',
    isTrending: true,
  },
  {
    name: 'Invoice Generator',
    description: 'Create, preview, and print professional invoices.',
    href: '/invoice-generator',
    icon: Receipt,
    category: 'Business Tools',
  },
  {
    name: 'Digital Signature Pad',
    description: 'Create and download your digital signature.',
    href: '/digital-signature-pad',
    icon: PenSquare,
    category: 'Business Tools',
  },
  // Calculators
  {
    name: 'Age Calculator',
    description: 'Calculate age in years, months, days.',
    href: '/age-calculator',
    icon: Calendar,
    category: 'Calculators',
  },
  {
    name: 'BMI Calculator',
    description: 'Find your Body Mass Index.',
    href: '/bmi-calculator',
    icon: HeartPulse,
    category: 'Calculators',
  },
  {
    name: 'EMI Calculator',
    description: 'Monthly EMI for any loan.',
    href: '/emi-calculator',
    icon: Calculator,
    category: 'Calculators',
  },
  {
    name: 'GST Calculator',
    description: 'Add/Remove GST (5%, 12%, 18%, 28%).',
    href: '/gst-calculator',
    icon: Receipt,
    category: 'Calculators',
  },
  {
    name: 'SIP Calculator',
    description: 'Calculate returns on your SIP investment.',
    href: '/sip-calculator',
    icon: PieChart,
    category: 'Calculators',
  },
  {
    name: 'FD Calculator',
    description: 'Calculate Fixed Deposit maturity amount.',
    href: '/fd-calculator',
    icon: PiggyBank,
    category: 'Calculators',
  },
  // Text Tools
  {
    name: 'Word Counter',
    description: 'Count words and characters in your text.',
    href: '/word-counter',
    icon: FileText,
    category: 'Text Tools',
  },
  {
    name: 'Case Converter',
    description: 'Convert text to different letter cases.',
    href: '/case-converter',
    icon: CaseUpper,
    category: 'Text Tools',
  },
  {
    name: 'Text to Emoji',
    description: 'Convert your words into fun emojis.',
    href: '/text-to-emoji',
    icon: Smile,
    category: 'Text Tools',
  },
  {
    name: 'Text to Handwriting',
    description: 'Convert typed text into handwritten style.',
    href: '/text-to-handwriting',
    icon: Pen,
    category: 'Text Tools',
    isTrending: true,
  },
];

export const tools = allTools; // Keeping 'tools' export for compatibility if it's used elsewhere directly

export interface Category {
    name: string;
    icon: LucideIcon;
    tools: Tool[];
}

export const categories: Category[] = [
     {
      name: 'Social Media',
      icon: Instagram,
      tools: allTools.filter(t => t.category === 'Social Media'),
    },
    { 
        name: 'Media Tools', 
        icon: Image,
        tools: allTools.filter(t => t.category === 'Media Tools'),
    },
    { 
        name: 'Security Tools', 
        icon: Shield,
        tools: allTools.filter(t => t.category === 'Security Tools'),
    },
    {
        name: 'Business Tools',
        icon: Receipt,
        tools: allTools.filter(t => t.category === 'Business Tools'),
    },
    { 
        name: 'Calculators', 
        icon: Calculator,
        tools: allTools.filter(t => t.category === 'Calculators'),
    },
    { 
        name: 'Text Tools', 
        icon: FileText,
        tools: allTools.filter(t => t.category === 'Text Tools'),
    },
].filter(c => c.tools.length > 0);
