import React, { useState, useRef, useEffect } from "react";
import { AiOutlineUser, AiOutlineUpload, AiOutlineDownload, AiOutlineCheckCircle, AiOutlineAlert } from "react-icons/ai";
import FormInput from "../../Components/Admin/FormInput.jsx";
import Button from "../../Components/Admin/Button.jsx";
import { useAdminStore } from "../../Store/AdminStore.js";
import { motion, AnimatePresence } from "framer-motion";

const initialFormData = {
  userName: "",
  email: "",
  password: "",
  houseNumber: "",
  mobileNumber: "",
  designation: "",
};

const RecordUpload = () => {
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const { addUser, uploadUsersCSV } = useAdminStore();

  // Auto-hide messages after 3s
  useEffect(() => {
    if (uploadResult || error) {
      const timer = setTimeout(() => {
        setUploadResult(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadResult, error]);

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.userName) errors.userName = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/.test(formData.password))
      errors.password = "Password must have uppercase, lowercase, number & min 6 chars";
    if (!formData.houseNumber) errors.houseNumber = "House number is required";
    if (!formData.mobileNumber) errors.mobileNumber = "Mobile number is required";
    if (!formData.designation) errors.designation = "Designation is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    setUploading(true); setError(null); setUploadResult(null);
    try {
      await addUser(formData);
      setUploadResult({ message: "User record created successfully" });
      setFormData(initialFormData);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) return setError({ message: "Only CSV files allowed" });

    setUploading(true); setError(null); setUploadResult(null);
    try {
      const res = await uploadUsersCSV(file);
      setUploadResult({ message: res.message, insertedCount: res.insertedCount, rejectedCount: res.rejectedCount });
    } catch (err) {
      setError({ message: err.message, rejectedUsers: err.rejectedUsers });
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleCSV = () => {
    const csv = "userName,email,password,houseNumber,mobileNumber,designation\nJohn Doe,john@example.com,Password123,H-101,03001234567,Manager";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "sample_users.csv"; link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b-4 border-[#748dff] rounded-t-lg px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#748dff] dark:bg-[#748dff] p-2 rounded-lg">
              <AiOutlineUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Record Management</h1>
              <p className="text-gray-600 dark:text-gray-300">Add new user records individually or via CSV upload</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-800 border-l border-r border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("form")}
            className={`cursor-pointer flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === "form"
                ? "border-b-2 border-[#748dff] text-[#748dff] bg-[#f0f3ff] dark:bg-slate-700"
                : "border-transparent text-gray-500 dark:text-gray-300"
            }`}
          >
            Individual Form
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`cursor-pointer flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === "csv"
                ? "border-b-2 border-[#748dff] text-[#748dff] bg-[#f0f3ff] dark:bg-gray-700"
                : "border-transparent text-gray-500 dark:text-gray-300"
            }`}
          >
            CSV Upload
          </button>
        </div>

        {/* Content with Flip Animation */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-l border-r border-b border-gray-200 dark:border-gray-700 rounded-b-lg p-6">
          <AnimatePresence exitBeforeEnter>
            {uploadResult && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-700 rounded-lg p-4 text-green-700 dark:text-green-200 mb-4"
              >
                <AiOutlineCheckCircle className="inline mr-2" /> {uploadResult.message}
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-400 border border-red-200 dark:border-red-500 rounded-lg p-4 text-red-700 dark:text-red-200 mb-4"
              >
                <AiOutlineAlert className="inline mr-2" /> {error.message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={activeTab} // triggers flip on tab change
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "form" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Name" required value={formData.userName} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"userName"}})} error={formErrors.userName}/>
                <FormInput label="Email" required value={formData.email} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"email"}})} error={formErrors.email} type="email"/>
                <FormInput label="Password" required value={formData.password} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"password"}})} error={formErrors.password} type={showPassword?"text":"password"} showPasswordToggle onTogglePassword={()=>setShowPassword(!showPassword)}/>
                <FormInput label="House Number" required value={formData.houseNumber} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"houseNumber"}})} error={formErrors.houseNumber}/>
                <FormInput label="Mobile Number" required value={formData.mobileNumber} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"mobileNumber"}})} error={formErrors.mobileNumber}/>
                <FormInput label="Designation" required value={formData.designation} onChange={(e)=>handleInputChange({...e, target:{...e.target,name:"designation"}})} error={formErrors.designation}/>
                <div className="md:col-span-2"><Button onClick={handleFormSubmit} loading={uploading}>Create User Record</Button></div>
              </div>
            )}
            {activeTab === "csv" && (
              <div className="space-y-4">
                <Button onClick={downloadSampleCSV} className="w-auto px-4 py-2"><AiOutlineDownload className="inline mr-2" />Download Sample CSV</Button>
                <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload}/>
                <Button onClick={()=>fileInputRef.current.click()} loading={uploading}><AiOutlineUpload className="inline mr-2" />Upload CSV</Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecordUpload;
