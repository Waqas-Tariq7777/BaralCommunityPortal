import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMic, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../assets/images/avatar.png";

const Chatbot = () => {
    const [blink, setBlink] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = () => {
        if (!message.trim()) return;

        setChatHistory(prev => [...prev, { sender: "user", text: message }]);
        setMessage("");

        setTimeout(() => {
            setChatHistory(prev => [...prev, { sender: "bot", text: "Hello! How can I help you today?" }]);
        }, 700);
    };

    return (
        <div className="fixed bottom-5 right-2 z-99999">
            <AnimatePresence mode="wait">

                {/* CLOSED */}
                {!isOpen && (
                    <motion.div
                        key="closed"
                        className="relative flex items-center cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsOpen(true)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="relative rounded-2xl shadow-lg px-1 py-1 flex items-center space-x-1 max-w-xs bg-gradient-to-r from-white to-[#748dff]">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                                <img src={avatar} alt="robot" className="w-full h-full object-cover animate-blink" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-6 h-1 bg-black rounded-full animate-eyeBlink"></div>
                                </div>
                            </div>

                            <p className="text-sm font-bold whitespace-nowrap dark:text-white">Chatbot</p>

                            <div className="absolute bottom-[-6px] left-6 w-3 h-3 rotate-45 shadow-sm bg-gradient-to-r from-white to-[#748dff]"></div>
                        </div>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    key="tooltip"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: -10, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="absolute right-full top-1/2 -translate-y-1/2 bg-[#748dff] text-white px-3 py-2 rounded-lg text-sm shadow-md whitespace-nowrap"
                                >
                                    Hi! Do you need any help?
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* OPEN */}
                {isOpen && (
                    <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        className="w-80 h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#748dff] to-white text-white p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={avatar} className="w-8 h-8 rounded-full" />
                                <span className="font-semibold dark:text-white">Chatbot</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-[#748dff] cursor-pointer hover:text-blue-700">
                                <FiX size={25} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 dark:bg-slate-900">

                            {chatHistory?.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                                    <img src={avatar} className="w-16 h-16 rounded-full shadow-md" />
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Welcome! How can I help you today?</p>
                                </div>
                            )}

                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    
                                    {msg.sender === "bot" && (
                                        <div className="flex items-end space-x-2 max-w-[75%]">
                                            <img src={avatar} className="w-6 h-6 rounded-full" />
                                            <div className="bg-white dark:bg-slate-800 dark:text-white p-2 rounded-lg shadow text-sm">
                                                {msg.text}
                                            </div>
                                        </div>
                                    )}

                                    {msg.sender === "user" && (
                                        <div className="bg-[#748dff] text-white p-2 rounded-lg max-w-[75%] text-sm">
                                            {msg.text}
                                        </div>
                                    )}

                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-2 bg-white dark:bg-slate-900">

                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#748dff] to-transparent mb-2"></div>

                            <div className="flex items-center space-x-2 bg-[#f1f5ff] dark:bg-slate-800 px-2 py-2 rounded-xl">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent outline-none text-sm dark:text-white placeholder-gray-500"
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />

                                <button onClick={handleSend} className="bg-[#748dff] cursor-pointer text-white p-2 rounded-full hover:scale-105 transition">
                                    <FiSend size={16} />
                                </button>

                                <button className="text-[#748dff] cursor-pointer">
                                    <FiMic size={18} />
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