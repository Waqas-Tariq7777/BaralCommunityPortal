import React, { useState, useEffect } from "react";
import { useLanguageStore } from "../Store/LanguageStore.js";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguageStore();
  const [visible, setVisible] = useState(true); // initially shown
  const [collapsed, setCollapsed] = useState(false);

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setCollapsed(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        background: "#748dff", // deep purple
        padding: collapsed ? "4px" : "8px",
        borderRadius: collapsed ? "8px 0 0 8px" : "12px 0 0 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 10000,
        transition: "all 0.3s ease",
        fontSize: "14px",
        overflow: "hidden",
      }}
    >
      {collapsed ? (
        // Floating arrow when collapsed
        <button
          onClick={toggleCollapse}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "4px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdKeyboardArrowLeft />
        </button>
      ) : (
        <>
          <button
            onClick={() => changeLanguage("en")}
            style={{
              padding: "6px 12px",
              background: language === "en" ? "#fff" : "rgba(255,255,255,0.2)",
              color: language === "en" ? "#4f46e5" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "6px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("ur")}
            style={{
              padding: "6px 12px",
              background: language === "ur" ? "#fff" : "rgba(255,255,255,0.2)",
              color: language === "ur" ? "#4f46e5" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            اردو
          </button>
          <button
            onClick={toggleCollapse}
            style={{
              marginTop: "6px",
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <MdKeyboardArrowRight />
          </button>
        </>
      )}
    </div>
  );
}