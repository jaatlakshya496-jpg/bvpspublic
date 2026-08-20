import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, 
  Bot, PhoneCall, ArrowRight, MessageSquare, 
  RotateCcw, Check, Sparkle
} from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';
import { RobotAvatar } from './RobotAvatar';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionLink?: {
    label: string;
    path: string;
    isExternal?: boolean;
  };
  options?: string[];
}

interface SmartIntent {
  patterns: RegExp[];
  keywords: string[];
  responseHinglish: string;
  path?: string;
  actionLabel?: string;
  followUps: string[];
}

// Ultra-tolerant Smart Intents in pure Hinglish
const SMART_INTENTS: SmartIntent[] = [
  // 1. Fee Structure
  {
    patterns: [
      /f+e+|f+i+|fees|fess|shulk|paisa|paise|kharch|kitna|kitne|rupee|rupaye|amount|charge|kitna lagega|pisa|fee structure|fees dikhao|fees batao/i,
    ],
    keywords: ['fee', 'fees', 'paisa', 'paise', 'rupee', 'shulk', 'kharch', 'amount', 'kitni fee', 'rupaye'],
    responseHinglish: "Fee structure page open kar diya gaya hai! Class 1-2: ₹3,000/yr, Class 3-5: ₹3,500/yr, Class 6-8: ₹4,500/yr, Class 9-10: ₹5,500/yr aur Class 11-12: ₹7,000/yr hai.",
    path: '/fee-structure',
    actionLabel: 'Fee Structure Dekhein',
    followUps: ['Admission Form Kholo', 'Class 11 Streams', 'School Timings']
  },

  // 2. Admission Form / Apply Online
  {
    patterns: [
      /admis|admi|dakhil|daakhil|pravesh|form|apply|bharna|bharna hai|admission|online|application|entry|admission form|form dikhao|form kholo|apply online/i,
    ],
    keywords: ['admission', 'form', 'apply', 'dakhila', 'pravesh', 'online form', 'application', 'bharna'],
    responseHinglish: "Online admission form open ho gaya hai! Session 2025-26 ke liye Class 1 se 12th tak admission open hain. Kripya student details fill karein.",
    path: '/application',
    actionLabel: 'Admission Form Fill Karein',
    followUps: ['Fees Kitni Hai?', 'Documents Kya Chahiye?', 'Streams in 11th']
  },

  // 3. Class 11 & 12 Streams / Subjects
  {
    patterns: [
      /stream|sankay|vishey|subject|arts|commerce|non med|science|11th|12th|gyarahvi|barahvi|subjects|medical|padhai/i,
    ],
    keywords: ['stream', 'streams', 'arts', 'commerce', 'non medical', 'science', 'subject', '11th', '12th', 'vishey'],
    responseHinglish: "Class 11th aur 12th ke streams page par available hain. BVPS mein 3 main streams hain: 1) Arts / Humanities, 2) Commerce, aur 3) Science Non-Medical.",
    path: '/streams',
    actionLabel: '11th-12th Streams Dekhein',
    followUps: ['Fee Structure', 'Admission Form', 'School Timings']
  },

  // 4. School Timings & Schedule
  {
    patterns: [
      /time|timing|samay|kab khulta|kab band|kitne baje|baje|prayer|assembly|schedule|chhutti|holiday|office time/i,
    ],
    keywords: ['timing', 'timings', 'time', 'samay', 'kab khulta hai', 'kab band hota hai', 'hours', 'schedule'],
    responseHinglish: "School timing Monday se Saturday morning 8:00 AM se 3:00 PM tak hai. Morning assembly sharp 8:00 AM par shuru hoti hai. Sunday holiday rehta hai.",
    path: '/school-timing',
    actionLabel: 'School Timings Dekhein',
    followUps: ['Principal Message', 'Contact Number', 'Admission Form']
  },

  // 5. Results & Sports Achievements
  {
    patterns: [
      /result|parinam|topper|marks|score|achievement|sports|khel|karate|cricket|football|trophy|gold medal|wrestling|champion/i,
    ],
    keywords: ['result', 'results', 'topper', 'marks', 'achievement', 'sports', 'karate', 'cricket', 'football', 'trophy'],
    responseHinglish: "School ka board exam result 100% pass rehta hai! Sports mein hamare students Football-Cricket mein District Champions aur State Karate & Wrestling mein Gold Medalists hain.",
    path: '/results',
    actionLabel: 'Results & Trophies Dekhein',
    followUps: ['Photo Gallery', 'Admission Form', 'School Facilities']
  },

  // 6. Photo Gallery
  {
    patterns: [
      /gallery|photo|tasveer|picture|images|pic|campus photo|program|function|building photo/i,
    ],
    keywords: ['gallery', 'photo', 'photos', 'picture', 'tasveer', 'images'],
    responseHinglish: "School photo gallery open ho gayi hai. Yahan aap school campus, sports events, science exhibitions aur cultural programs ki photos dekh sakte hain.",
    path: '/gallery',
    actionLabel: 'Photo Gallery Kholein',
    followUps: ['School Facilities', 'Results Page', 'Home Page']
  },

  // 7. Facilities / Computer Lab / Library
  {
    patterns: [
      /facility|facilities|suvidha|lab|computer|library|smart class|cctv|water|ground|playground|bus|vehicle|ro water/i,
    ],
    keywords: ['facility', 'facilities', 'library', 'computer', 'lab', 'smart class', 'playground', 'cctv', 'suvidha'],
    responseHinglish: "BVPS Kalayat ki modern facilities: 2000+ books wali Library, 25+ PCs Computer Lab, 12 Smart Classrooms, Big Playground, 24/7 CCTV aur RO Chilled Drinking Water.",
    path: '/facilities',
    actionLabel: 'All Facilities Dekhein',
    followUps: ['Sports Results', 'School Timings', 'Admission Form']
  },

  // 8. Principal's Desk
  {
    patterns: [
      /principal|headmaster|ramphal|sharma|director|pradhanacharya|owner|sir/i,
    ],
    keywords: ['principal', 'headmaster', 'ramphal sharma', 'director', 'pradhanacharya'],
    responseHinglish: "Bal Vikas Public School ke Principal Sh. Ramphal Sharma ji ka message page open kar diya gaya hai. 2004 se unke guidance mein school best education provide kar raha hai.",
    path: '/principal-message',
    actionLabel: "Principal's Desk Kholein",
    followUps: ['Contact School', 'About School', 'Admission Form']
  },

  // 9. Contact / Phone Number / Address
  {
    patterns: [
      /contact|phone|mobile|call|number|address|location|kahan|pata|sampark|email|kalayat|rasta/i,
    ],
    keywords: ['contact', 'phone', 'number', 'address', 'location', 'sampark', 'pata', 'call'],
    responseHinglish: "School Address: Bal Vikas Public School, Railway Road, Kalayat, Kaithal (Haryana). Helpline Phone: +91 98125 50200. Email: info@bvpskalayat.edu.in.",
    path: '/contact',
    actionLabel: 'Contact Details & Map',
    followUps: ['School Timings', 'Fees Structure', 'Admission Form']
  },

  // 10. Required Documents / Interview
  {
    patterns: [
      /document|documents|kaagaz|kagzat|aadhaar|tc|birth certificate|interview|rules|niyam|praman patra/i,
    ],
    keywords: ['document', 'documents', 'interview', 'rules', 'kaagaz', 'aadhaar', 'tc'],
    responseHinglish: "Admission ke zaroori documents: 1) Student Aadhaar Card, 2) Birth Certificate / TC, 3) Previous Report Card, 4) 4 Passport Photos, aur 5) Parent ID proof.",
    path: '/interview',
    actionLabel: 'Interview & Documents List',
    followUps: ['Admission Form', 'Fees Kitni Hai?', 'Enrollment Guide']
  },

  // 11. About School / History
  {
    patterns: [
      /about|history|bvps|school|parichay|baare me|itihas|founder/i,
    ],
    keywords: ['about', 'history', 'school', 'bvps', 'kalayat', 'parichay'],
    responseHinglish: "Bal Vikas Public School (BVPS) Kalayat, Kaithal mein 2004 se established ek leading senior secondary school hai jo high moral values aur quality education deta hai.",
    path: '/about',
    actionLabel: 'About Us Page Dekhein',
    followUps: ['Principal Desk', 'Facilities', 'Admission Form']
  },

  // 12. Home Page
  {
    patterns: [
      /home|shuru|start|main page|mukhya prashth|pehle page/i,
    ],
    keywords: ['home', 'start', 'shuru', 'main page'],
    responseHinglish: "Home page open kar diya gaya hai.",
    path: '/',
    actionLabel: 'Home Page',
    followUps: ['Fee Structure', 'Admission Form', 'Facilities']
  }
];

// Smart Intent Resolver in Hinglish
function resolveSmartIntent(query: string): { 
  matchedIntent?: SmartIntent;
  responseHinglish: string;
  path?: string;
  actionLabel?: string;
  followUps: string[];
} {
  const clean = query.toLowerCase().trim();

  // Greetings in Hinglish
  if (/^(hi|hello|hey|namaste|pranam|namaskar|ram ram|shastriakal|greetings|radhe radhe|jai shree ram)/i.test(clean)) {
    return {
      responseHinglish: "Namaste! 🙏 Main BVPS Kalayat ka AI Assistant Controller hoon. Aap bolkar ya likhkar kuch bhi poochein (jaise Fees, Admission, Streams, Timings), main turant wahi page open kar dunga!",
      followUps: ['Fees Kitni Hai?', 'Admission Form Kholo', '11th Class Streams', 'School Timings']
    };
  }

  // 1. Regex Pattern match
  for (const intent of SMART_INTENTS) {
    if (intent.patterns.some(p => p.test(clean))) {
      return {
        matchedIntent: intent,
        responseHinglish: intent.responseHinglish,
        path: intent.path,
        actionLabel: intent.actionLabel,
        followUps: intent.followUps
      };
    }
  }

  // 2. Keyword substring match
  for (const intent of SMART_INTENTS) {
    if (intent.keywords.some(k => clean.includes(k))) {
      return {
        matchedIntent: intent,
        responseHinglish: intent.responseHinglish,
        path: intent.path,
        actionLabel: intent.actionLabel,
        followUps: intent.followUps
      };
    }
  }

  // 3. Fallback in Hinglish
  return {
    responseHinglish: `Maine aapka request samajh liya hai. BVPS Kalayat se related information (jaise Fees, Admission Form, Streams, Timings) ke liye neeche diye options choose karein.`,
    followUps: ['Fees Structure', 'Admission Form', 'Class 11 Streams', 'School Timings', 'Contact School']
  };
}

export function UnifiedAiAgent() {
  const [, setLocation] = useLocation();

  // Entrance Banner State (Auto-appears at entry, speaks in Hinglish, then slides to side)
  const [showEntranceGreeting, setShowEntranceGreeting] = useState(false);

  // Chatboard & Voice State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  // Feedback HUD toast
  const [hudToast, setHudToast] = useState<{ title: string; subtitle: string } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      text: "[🙏 Namaste! Bal Vikas Public School, Kalayat mein aapka swagat hai!]\n\nMain aapka AI Assistant hoon jo poori website ko control karta hai. Aap bolkar ya likhkar jo bhi bolenge, main turant wahi page open kar dunga!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ['Fees Kitni Hai?', 'Admission Form Kholo', '11th Class Streams', 'School Timings']
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isSpeaking]);

  // Automatic Entrance Greeting on Site Landing in Hinglish
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('bvps_entrance_greeted');
    if (!hasSeenGreeting) {
      setShowEntranceGreeting(true);
      
      const welcomeSpeech = 
        "Namaste! Bal Vikas Public School, Kalayat mein aapka swagat hai! Main aapka AI Assistant hoon. Aap bolkar ya likhkar jo bhi kahenge, main turant wahi page open kar dunga!";

      // Fallback timer: auto-dismiss if audio autoplay is restricted
      const safetyTimer = setTimeout(() => {
        setShowEntranceGreeting(false);
        sessionStorage.setItem('bvps_entrance_greeted', 'true');
      }, 6000);

      speakVoice(welcomeSpeech, () => {
        clearTimeout(safetyTimer);
        setTimeout(() => {
          setShowEntranceGreeting(false);
          sessionStorage.setItem('bvps_entrance_greeted', 'true');
        }, 1200);
      });

      return () => clearTimeout(safetyTimer);
    }
  }, []);

  // Web Speech Recognition Engine
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Works great for Hinglish phonetics and words

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleExecuteCommand(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition setup:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Text-to-Speech Engine
  const speakVoice = (text: string, onFinish?: () => void) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) {
      onFinish?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.lang.includes('en-IN'));
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onFinish?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onFinish?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // Toggle Voice Listening
  const toggleListening = () => {
    stopVoice();
    if (!recognitionRef.current) {
      alert("Please allow microphone permission in Chrome, Edge, or Safari browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = 'hi-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
        setIsListening(false);
      }
    }
  };

  // Execute Voice / Text Command
  const handleExecuteCommand = (rawText: string) => {
    if (!rawText.trim()) return;

    // Add user message to chat
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Resolve Intent & Execute Action
    const result = resolveSmartIntent(rawText);

    // Navigate immediately if page path is found!
    if (result.path) {
      setLocation(result.path);
    }

    // Show HUD toast notification in Hinglish
    setHudToast({
      title: `Command: "${rawText}"`,
      subtitle: result.responseHinglish
    });
    setTimeout(() => setHudToast(null), 4000);

    // Add bot response to chat in Hinglish
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.responseHinglish,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: result.path ? { label: result.actionLabel || 'Page Open Karein', path: result.path } : undefined,
        options: result.followUps
      };

      setMessages(prev => [...prev, botMsg]);
      speakVoice(result.responseHinglish);
    }, 250);
  };

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 1. ENTRANCE GREETING POP-OVER (Auto-greets & speaks in Hinglish, then slides away) */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showEntranceGreeting && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-xl bg-gradient-to-r from-slate-950 via-primary to-slate-900 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-400/60 flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-300">
          
          {/* Animated Robot Avatar */}
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/10 p-1 flex items-center justify-center border border-amber-300/40 shadow-inner">
            <RobotAvatar size="md" isSpeaking={isSpeaking} isGreeting={true} showHands={true} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-amber-300 font-extrabold text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                [🙏 Namaste! Bal Vikas Public School, Kalayat]
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              "School ki taraf se aapka hardik swagat hai! Main aapka <span className="text-amber-300 font-bold">AI Controller</span> hoon. Aap bolkar ya likhkar website chala sakte hain."
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => {
              stopVoice();
              setShowEntranceGreeting(false);
              sessionStorage.setItem('bvps_entrance_greeted', 'true');
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            title="Dismiss / Continue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 2. HUD TOAST (Appears whenever voice/command is executed)            */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {hudToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-amber-400/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-300 truncate">{hudToast.title}</p>
            <p className="text-xs text-slate-200 leading-tight mt-0.5 line-clamp-2">{hudToast.subtitle}</p>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 3. PERSISTENT FLOATING SIDE DOCK (Always ready to listen or chat)   */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-20 sm:right-24 z-50 flex items-center gap-2 select-none">
        
        {/* Floating Voice + Chat Button in Hinglish */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Open AI Voice & Chat Controller"
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-primary via-[#1e3a8a] to-secondary text-white pl-2.5 pr-4 py-2.5 rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-amber-300/50 group"
        >
          {/* Mini Robot Avatar in Button */}
          <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center shrink-0">
            <RobotAvatar size="sm" isSpeaking={isSpeaking} isListening={isListening} showHands={false} />
          </div>

          <div className="flex flex-col text-left pr-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Sparkle className="w-2.5 h-2.5 text-amber-300 animate-spin" />
              BVPS AI Controller
            </span>
            <span className="text-xs font-bold leading-none text-white">
              {isListening ? 'Sun Raha Hoon 🎤' : isSpeaking ? 'Bol Raha Hoon 🔊' : 'Bolein Ya Chat Karein 🙏'}
            </span>
          </div>

          {/* Quick Mic Action on button */}
          <span 
            onClick={(e) => {
              e.stopPropagation();
              toggleListening();
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 hover:bg-amber-400 hover:text-slate-900 text-white'
            }`}
            title={isListening ? "Stop listening" : "Tap to Speak (Mic On Karein)"}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 font-bold" />}
          </span>

          {/* Online badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 4. INTEGRATED VOICE & CHATBOARD DIALOG MODAL (Hinglish)             */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-3 sm:right-6 w-[95vw] sm:w-[440px] max-h-[85vh] h-[650px] z-50 bg-white rounded-3xl shadow-2xl border-2 border-primary/20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-250">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-[#1e3a8a] to-primary p-3.5 text-white flex items-center justify-between shadow-sm relative shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 p-0.5 border border-amber-300/60 flex items-center justify-center shrink-0">
                <RobotAvatar size="sm" isSpeaking={isSpeaking} isListening={isListening} showHands={false} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm leading-tight text-white">BVPS AI Site Controller</h3>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-amber-400 text-primary rounded-full uppercase tracking-wider">Active</span>
                </div>
                <p className="text-[11px] text-white/80">
                  Bolein ya likhein — jo bolenge wahi page open hoga!
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5">
              {/* Mute Voice */}
              <button
                onClick={() => {
                  if (isSpeaking) stopVoice();
                  setIsVoiceMuted(!isVoiceMuted);
                }}
                title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
                className={`p-1.5 rounded-lg transition-colors ${isVoiceMuted ? 'bg-red-500/30 text-red-200' : 'bg-white/15 hover:bg-white/25 text-white'}`}
              >
                {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  stopVoice();
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                  setIsChatOpen(false);
                }}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="Close chatboard"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Listening / Speaking Bar in Hinglish */}
          {(isListening || isSpeaking) && (
            <div className={`py-1.5 px-4 text-xs font-semibold flex items-center justify-between shrink-0 transition-colors ${
              isListening ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span>Mic on hai... apna question bolein...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>AI voice mein bol raha hai...</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => {
                  if (isListening) recognitionRef.current?.stop();
                  if (isSpeaking) stopVoice();
                }}
                className="text-[10px] font-bold bg-black/25 px-2 py-0.5 rounded hover:bg-black/40"
              >
                Stop
              </button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex gap-2.5 max-w-[90%] ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-2xl rounded-tr-sm p-3.5 shadow-sm'
                      : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-slate-200/80'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <RobotAvatar size="sm" isSpeaking={isSpeaking} showHands={false} />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-line select-text font-normal">
                      {msg.text}
                    </p>

                    {/* Direct Page Link Button */}
                    {msg.actionLink && (
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            if (msg.actionLink?.path) {
                              setLocation(msg.actionLink.path);
                              setIsChatOpen(false);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <span>{msg.actionLink.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>
                    )}

                    {/* Replay Audio in Hinglish */}
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakVoice(msg.text)}
                        className="self-start inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-primary mt-1 font-medium transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-secondary" />
                        <span>Voice Sunein</span>
                      </button>
                    )}

                    {/* Follow-up Prompt Pills */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 mt-1 border-t border-slate-100">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleExecuteCommand(opt)}
                            className="text-xs bg-slate-100 hover:bg-amber-400 hover:text-slate-900 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-all text-left"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice Prompt Shortcuts in Hinglish */}
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider">
              Quick Commands:
            </span>
            {['Fees Structure', 'Admission Form', '11th Streams', 'School Timings', 'Facilities', 'Principal Message'].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteCommand(q)}
                className="whitespace-nowrap text-xs bg-white text-primary font-medium px-3 py-1 rounded-full border border-slate-300/80 hover:bg-primary hover:text-white transition-colors shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Bottom Voice Mic + Text Input Form in Hinglish */}
          <div className="p-3 bg-white border-t border-border flex items-center gap-2 shrink-0">
            {/* Big Mic Button */}
            <button
              onClick={toggleListening}
              title={isListening ? "Mic band karein" : "Mic on karein (bolkar poochein)"}
              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-900 hover:scale-105 active:scale-95'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 font-bold" />}
            </button>

            {/* Text Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteCommand(inputVal);
              }}
              className="flex-1 flex items-center gap-2 bg-slate-100 rounded-2xl px-3.5 py-1.5 border border-slate-200 focus-within:border-primary focus-within:bg-white transition-all"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Kuch bhi likhein ya mic daba kar bolein..."
                className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                aria-label="Send message"
                className="p-1.5 rounded-xl bg-primary text-white disabled:opacity-40 disabled:hover:bg-primary hover:bg-primary/90 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
