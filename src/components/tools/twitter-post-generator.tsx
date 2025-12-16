'use client';

import React, { useReducer, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { MessageCircle, Repeat, Heart, BarChart, Bookmark, Share, MoreHorizontal, Verified, FileImage, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// --- TYPES AND STATE MANAGEMENT ---

type Theme = 'light' | 'dark';

interface TweetState {
  theme: Theme;
  name: string;
  username: string;
  isVerified: boolean;
  tweetDate: Date;
  avatarUrl: string | null;
  tweetImages: string[];
  tweetText: string;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
}

type Action =
  | { type: 'UPDATE_FIELD'; field: keyof TweetState; value: string | number | boolean | Date }
  | { type: 'SET_AVATAR'; url: string | null }
  | { type: 'ADD_TWEET_IMAGE'; url: string }
  | { type: 'REMOVE_TWEET_IMAGE'; index: number };

const initialState: TweetState = {
  theme: 'light',
  name: 'John Doe',
  username: 'johndoe',
  isVerified: true,
  tweetDate: new Date(),
  avatarUrl: null,
  tweetImages: [],
  tweetText: 'This is a sample tweet. @mentions, #hashtags, and https://links.com are all automatically converted.',
  replyCount: 0,
  retweetCount: 0,
  likeCount: 0,
  viewCount: 0,
};

function tweetReducer(state: TweetState, action: Action): TweetState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_AVATAR':
      if (state.avatarUrl) URL.revokeObjectURL(state.avatarUrl);
      return { ...state, avatarUrl: action.url };
    case 'ADD_TWEET_IMAGE':
        if(state.tweetImages.length < 4) {
            return { ...state, tweetImages: [...state.tweetImages, action.url]};
        }
        return state;
    case 'REMOVE_TWEET_IMAGE':
        const newImages = [...state.tweetImages];
        URL.revokeObjectURL(newImages[action.index]);
        newImages.splice(action.index, 1);
        return { ...state, tweetImages: newImages };
    default:
      return state;
  }
}

const formatStat = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};


// --- HELPER COMPONENTS ---

const HighlightedTweetText = ({ text, theme }: { text: string, theme: Theme }) => {
  const parts = text.split(/(@\w+|#\w+|https?:\/\/\S+)/g);
  return (
    <p className={cn("text-base whitespace-pre-wrap break-words", theme === 'light' ? 'text-gray-900' : 'text-gray-100')}>
      {parts.map((part, i) => {
        if (part.startsWith('@') || part.startsWith('#') || part.startsWith('http')) {
          return <span key={i} className="text-blue-500">{part}</span>;
        }
        return part;
      })}
    </p>
  );
};

const TweetImageGrid = ({ images }: { images: string[] }) => {
    if (images.length === 0) return null;

    if (images.length === 1) {
        return <Image src={images[0]} alt="Tweet media" width={500} height={500} className="mt-3 w-full h-auto object-cover rounded-2xl border border-gray-200 dark:border-gray-800" />;
    }
    
    if (images.length === 2) {
        return (
            <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <Image src={images[0]} alt="Tweet media 1" width={250} height={250} className="h-full w-full object-cover" />
                <Image src={images[1]} alt="Tweet media 2" width={250} height={250} className="h-full w-full object-cover" />
            </div>
        );
    }
    
    if (images.length === 3) {
        return (
            <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-[16/9]">
                <div className="row-span-2"><Image src={images[0]} alt="Tweet media 1" width={250} height={500} className="h-full w-full object-cover" /></div>
                <div><Image src={images[1]} alt="Tweet media 2" width={250} height={250} className="h-full w-full object-cover" /></div>
                <div><Image src={images[2]} alt="Tweet media 3" width={250} height={250} className="h-full w-full object-cover" /></div>
            </div>
        )
    }

    return (
         <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-video">
            {images.map((src, i) => <Image key={i} src={src} alt={`Tweet media ${i+1}`} width={250} height={250} className="h-full w-full object-cover" />)}
        </div>
    );
}

// --- MAIN PREVIEW COMPONENT ---

const TweetPreview = React.forwardRef<HTMLDivElement, { state: TweetState }>(({ state }, ref) => {
  const { theme, name, username, isVerified, tweetDate, avatarUrl, tweetImages, tweetText, replyCount, retweetCount, likeCount, viewCount } = state;
  const formattedDate = format(tweetDate, "h:mm a '·' MMM d, yyyy");

  return (
    <div ref={ref} className={cn("w-full max-w-xl mx-auto rounded-xl border p-4 font-sans", theme === 'light' ? 'bg-white text-black border-gray-200' : 'bg-black text-white border-gray-800')}>
        <div className="flex items-start">
            <Avatar className="h-12 w-12">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
                <div className="flex items-center">
                    <span className="font-bold">{name}</span>
                    {isVerified && <Verified className="h-5 w-5 ml-1 fill-current text-blue-500" />}
                </div>
                <span className={cn(theme === 'light' ? 'text-gray-500' : 'text-gray-400')}>@{username}</span>
            </div>
            <MoreHorizontal className={cn("h-5 w-5", theme === 'light' ? 'text-gray-500' : 'text-gray-400')} />
        </div>

        <div className="mt-3">
             <HighlightedTweetText text={tweetText} theme={theme} />
             <TweetImageGrid images={tweetImages} />
        </div>

        <div className={cn("mt-3 text-sm", theme === 'light' ? 'text-gray-500' : 'text-gray-400')}>{formattedDate}</div>
        
        <div className={cn("mt-3 border-t", theme === 'light' ? 'border-gray-200' : 'border-gray-800')}></div>
        
        <div className={cn("flex justify-between items-center mt-3 text-sm", theme === 'light' ? 'text-gray-500' : 'text-gray-400')}>
             <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>{formatStat(replyCount)}</span>
             </div>
             <div className="flex items-center space-x-2">
                <Repeat className="h-5 w-5" />
                <span>{formatStat(retweetCount)}</span>
             </div>
             <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>{formatStat(likeCount)}</span>
             </div>
             <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>{formatStat(viewCount)}</span>
             </div>
             <div className="flex items-center space-x-4">
                <Bookmark className="h-5 w-5" />
                <Share className="h-5 w-5" />
            </div>
        </div>
    </div>
  );
});
TweetPreview.displayName = 'TweetPreview';


// --- MAIN PAGE COMPONENT ---
export default function TwitterPostGenerator(): JSX.Element {
  const [state, dispatch] = useReducer(tweetReducer, initialState);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = useCallback(() => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `toolpoket-tweet-${state.username}.png`;
        link.href = dataUrl;
        link.click();
        setIsDownloading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDownloading(false);
      });
  }, [state.username]);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files?.[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          dispatch({ type: 'SET_AVATAR', url });
      }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files?.[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          dispatch({ type: 'ADD_TWEET_IMAGE', url });
      }
  }

  return (
    <div className="space-y-8">
      {/* Top Section: Preview */}
      <div className="w-full">
        <TweetPreview state={state} ref={previewRef} />
      </div>

      {/* Bottom Section: Controls */}
      <Card>
        <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label>Theme</Label>
                    <Select value={state.theme} onValueChange={(v: Theme) => dispatch({ type: 'UPDATE_FIELD', field: 'theme', value: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent>
                    </Select>
                </div>
                <div>
                     <Label>Avatar</Label>
                    <Button variant="outline" className="w-full justify-start" onClick={() => avatarInputRef.current?.click()}>
                        <FileImage className="mr-2 h-4 w-4" /> Click to upload
                    </Button>
                    <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" />
                </div>
                <div>
                    <Label>Tweet Images (Up to 4)</Label>
                    <Button variant="outline" className="w-full justify-start" onClick={() => imageInputRef.current?.click()} disabled={state.tweetImages.length >= 4}>
                        <FileImage className="mr-2 h-4 w-4" /> Click to upload
                    </Button>
                     <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label>Name</Label>
                    <Input value={state.name} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })} />
                </div>
                 <div className="flex gap-2 items-end">
                    <div className="flex-grow">
                        <Label>Username</Label>
                        <Input value={state.username} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'username', value: e.target.value })} />
                    </div>
                    <div className="flex items-center h-10 px-3 border rounded-md">
                        <Checkbox id="verified" checked={state.isVerified} onCheckedChange={v => dispatch({ type: 'UPDATE_FIELD', field: 'isVerified', value: v as boolean })}/>
                        <Label htmlFor="verified" className="ml-2">Verified</Label>
                    </div>
                </div>
                 <div>
                    <Label>Tweet Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={'outline'} className="w-full justify-start text-left font-normal">
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {format(state.tweetDate, "PPP p")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={state.tweetDate} onSelect={d => d && dispatch({ type: 'UPDATE_FIELD', field: 'tweetDate', value: d})} initialFocus />
                            <div className="p-2 border-t border-border">
                               <Input type="time" step="1" value={format(state.tweetDate, "HH:mm:ss")} 
                                   onChange={e => {
                                       const [h,m,s] = e.target.value.split(':').map(Number);
                                       const newDate = new Date(state.tweetDate);
                                       newDate.setHours(h,m,s);
                                       dispatch({ type: 'UPDATE_FIELD', field: 'tweetDate', value: newDate});
                                   }}
                               />
                            </div>
                        </PopoverContent>
                      </Popover>
                 </div>
            </div>
            <div>
                <Label>Tweet Text</Label>
                <Textarea value={state.tweetText} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'tweetText', value: e.target.value })} maxLength={4000}/>
                <p className="text-xs text-right text-muted-foreground mt-1">{state.tweetText.length} / 4000</p>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <Label>Reply Count</Label>
                    <Input type="number" value={state.replyCount} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'replyCount', value: parseInt(e.target.value) || 0 })} />
                </div>
                 <div>
                    <Label>Retweet Count</Label>
                    <Input type="number" value={state.retweetCount} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'retweetCount', value: parseInt(e.target.value) || 0 })} />
                </div>
                 <div>
                    <Label>Like Count</Label>
                    <Input type="number" value={state.likeCount} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'likeCount', value: parseInt(e.target.value) || 0 })} />
                </div>
                 <div>
                    <Label>View Count</Label>
                    <Input type="number" value={state.viewCount} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'viewCount', value: parseInt(e.target.value) || 0 })} />
                </div>
             </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleDownload} className="w-full" disabled={isDownloading}>
        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
        {isDownloading ? 'Generating Image...' : 'Download Post'}
      </Button>
    </div>
  );
}
