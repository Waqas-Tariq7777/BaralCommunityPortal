import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMic, FiX, FiVolume2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../assets/images/avatar.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";



const Chatbot = () => {
    const [blink, setBlink] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const messagesContainerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(",")[1];
                    handleSend(null, base64Audio, "audio/webm");
                };
                
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsListening(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
    };

    const speak = (text) => {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(text);
        const isUrdu = /[\u0600-\u06FF]/.test(text);
        utterance.lang = isUrdu ? "ur-PK" : "en-US";
        window.speechSynthesis.speak(utterance);
    };



    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [chatHistory]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = async (manualMessage = null, audioData = null, mimeType = null) => {
        const textToSend = manualMessage || message;
        if (!textToSend.trim() && !audioData || isLoading) return;

        const userMessage = { 
            sender: "user", 
            text: textToSend || (audioData ? "🎤 [Voice Message]" : "") 
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        setMessage("");
        setIsLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
            
            const response = await fetch(`${baseUrl}/api/chatbot/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: chatHistory,
                    audioData,
                    mimeType
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponseText = "";
            let fullStreamedText = "";

            // Add an initial empty bot message
            setChatHistory(prev => [...prev, { sender: "bot", text: "" }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') continue;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.error) throw new Error(data.error);
                            
                            fullStreamedText += data.text;

                            // Parse transcription and response
                            const transMatch = fullStreamedText.match(/TRANSCRIPTION:(.*?)(?=RESPONSE:|$)/s);
                            const respMatch = fullStreamedText.match(/RESPONSE:(.*)/s);

                            let currentTranscription = transMatch ? transMatch[1].trim() : "";
                            let currentResponse = respMatch ? respMatch[1].trim() : "";

                            setChatHistory(prev => {
                                const newHistory = [...prev];
                                // Update user transcription if available
                                if (audioData && currentTranscription) {
                                    newHistory[newHistory.length - 2].text = currentTranscription;
                                }
                                // Update bot response
                                if (currentResponse) {
                                    newHistory[newHistory.length - 1].text = currentResponse;
                                } else {
                                    // If no RESPONSE: tag yet, just show what we have so far (minus headers)
                                    newHistory[newHistory.length - 1].text = fullStreamedText.replace(/TRANSCRIPTION:.*RESPONSE:/s, "").replace(/TRANSCRIPTION:/s, "");
                                }
                                return newHistory;
                            });

                            if (currentResponse) botResponseText = currentResponse;
                        } catch (e) {
                            console.error("Error parsing stream chunk:", e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory(prev => [...prev, { sender: "bot", text: "Something went wrong. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999]">
            <AnimatePresence mode="wait">

                {/* CLOSED */}
                {!isOpen && (
                    <motion.div
                        key="closed"
                        className="relative flex items-center justify-center cursor-pointer group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsOpen(true)}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        {/* 3D Floating Button */}
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_8px_20px_rgba(99,102,241,0.5),inset_0_-3px_5px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all duration-300">
                            
                            {/* Inner glow/pulse effect */}
                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            
                            {/* Avatar */}
                            <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] p-0.5">
                                <img src={avatar} alt="AI Assistant" className="w-full h-full object-cover rounded-full animate-blink" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-6 h-1 bg-black rounded-full animate-eyeBlink"></div>
                                </div>
                            </div>

                            {/* Notification Badge / Online Indicator */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                        </div>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    key="tooltip"
                                    initial={{ x: -20, opacity: 0, scale: 0.9 }}
                                    animate={{ x: -15, opacity: 1, scale: 1 }}
                                    exit={{ x: -20, opacity: 0, scale: 0.9 }}
                                    className="absolute right-full top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.15)] whitespace-nowrap border border-slate-100 dark:border-slate-700 backdrop-blur-md"
                                >
                                    Ask Community AI ✨
                                    {/* Arrow pointing to button */}
                                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white dark:bg-slate-800 border-r border-t border-slate-100 dark:border-slate-700"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* OPEN */}
                {isOpen && (
                    <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 40, scale: 0.8, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="w-[calc(100vw-32px)] sm:w-[360px] h-[calc(100vh-32px)] sm:h-[550px] max-h-[550px] bg-slate-50 dark:bg-slate-900 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden relative"
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        {/* Header */}
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-4 flex justify-between items-center z-10 shadow-sm flex-shrink-0">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
                                        <img src={avatar} className="w-full h-full rounded-full bg-white object-cover" />
                                    </div>
                                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-extrabold text-[15px] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight truncate">Community AI</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 flex-shrink-0 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="truncate">Always active</span>
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => { setIsOpen(false); stopSpeaking(); }} 
                                className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-full"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={messagesContainerRef} className="flex-1 min-h-0 p-5 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar relative z-0">
                            {chatHistory?.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-5"
                                >
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
                                        <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                                            <img src={avatar} className="w-full h-full rounded-full bg-white object-cover" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-xl text-slate-800 dark:text-white">Hi there! 👋</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[220px] mx-auto leading-relaxed">Ask me anything about community services, complaints, or the portal.</p>
                                    </div>
                                </motion.div>
                            )}

                            {chatHistory.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group`}
                                >
                                    
                                    {msg.sender === "bot" && (
                                        <div className="flex flex-col items-start space-y-1.5 max-w-[88%]">
                                            <div className="flex items-end space-x-2 w-full">
                                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-sm border border-white/50 dark:border-slate-600/50 mb-0.5 z-10">
                                                    <img src={avatar} className="w-5 h-5 object-cover rounded-full mix-blend-multiply dark:mix-blend-normal" />
                                                </div>
                                                <div className={`relative bg-white dark:bg-slate-800 dark:text-slate-200 p-3.5 rounded-[20px] rounded-bl-sm shadow-[0_4px_15px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] border border-slate-100 dark:border-slate-700/60 text-[14px] leading-[1.6] markdown-content ${/[\u0600-\u06FF]/.test(msg.text) ? 'rtl' : ''}`}>
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </div>
                                            </div>
                                            {(!/[\u0600-\u06FF]/.test(msg.text) && msg.text.trim() && !(isLoading && idx === chatHistory.length - 1)) && (
                                                <button 
                                                    onClick={() => speak(msg.text)} 
                                                    className="ml-9 text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    <FiVolume2 size={13} />
                                                    <span>Play audio</span>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {msg.sender === "user" && (
                                        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3.5 rounded-[20px] rounded-br-sm max-w-[85%] text-[14px] shadow-[0_8px_16px_rgba(99,102,241,0.25),inset_0_-2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] font-medium leading-[1.5]">
                                            {msg.text}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-end space-x-2 max-w-[85%]">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-sm border border-white/50 mb-0.5">
                                            <img src={avatar} className="w-5 h-5 object-cover rounded-full opacity-60" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-[20px] rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700 flex space-x-1.5 items-center">
                                            <motion.div className="w-1.5 h-1.5 bg-indigo-400/80 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                                            <motion.div className="w-1.5 h-1.5 bg-indigo-400/80 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                                            <motion.div className="w-1.5 h-1.5 bg-indigo-400/80 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-10 flex-shrink-0">
                            <div className="relative flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/50 dark:border-slate-700/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.2)] focus-within:border-indigo-300 dark:focus-within:border-indigo-500 transition-all duration-300">
                                
                                <button 
                                    onClick={isListening ? stopListening : startListening} 
                                    className={`ml-1 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${isListening ? "bg-red-100 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-indigo-500 shadow-sm"}`}
                                    title={isListening ? "Stop Recording" : "Voice Input"}
                                >
                                    <FiMic size={17} />
                                </button>

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-[14px] text-slate-700 dark:text-white placeholder-slate-400 font-medium"
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />

                                <button 
                                    onClick={() => handleSend()} 
                                    disabled={!message.trim() && !isLoading}
                                    className={`mr-0.5 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${!message.trim() ? "bg-slate-200 dark:bg-slate-700 text-slate-400" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_10px_rgba(99,102,241,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_15px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"}`}
                                >
                                    <FiSend size={15} className={`${message.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Chatbot;