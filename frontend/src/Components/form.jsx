import { PiUser } from "react-icons/pi";
export default function Record() {
    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center">

                <div className="bg-white rounded-xl shadow-md w-full max-w-5xl mx-2 sm:mx-0">

                    <div className="flex flex-col sm:flex-row items-center p-5 gap-6 text-center sm:text-left">
                        <div className="bg-[#748dff] text-white text-2xl sm:text-3xl p-3 rounded-lg">
                            <PiUser />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl sm:text-3xl">User Record Management</h2>
                            <p className="pt-2 text-gray-500 text-sm sm:text-base">
                                Add new user records individually or via CSV upload
                            </p>
                        </div>
                    </div>

                    <div className="flex border-t border-t-[#748dff] border-t-2">
                        <button className="w-1/2 text-center py-2 sm:py-3 bg-[#a1b2fd] text-white text-sm sm:text-base">
                            Individual Form
                        </button>
                        <button className="w-1/2 text-center py-2 sm:py-3 text-sm sm:text-base">
                            CSV Upload
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 p-4 sm:p-5 gap-4 sm:gap-5 text-black">

                        <div className="space-y-4">
                            <div>
                                <label>Name <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full mt-2 border text-gray-500 p-2 rounded text-sm sm:text-base" />
                            </div>

                            <div>
                                <label>Password <span className="text-red-500">*</span></label>
                                <input type="password" className="w-full mt-2 border p-2 rounded text-gray-500 text-sm sm:text-base" />
                            </div>

                            <div>
                                <label>Mobile Number <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border mt-2 p-2 rounded text-gray-500 text-sm sm:text-base" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label>Email <span className="text-red-500">*</span></label>
                                <input type="email" className="w-full border mt-2 p-2 rounded text-gray-500 text-sm sm:text-base" />
                            </div>

                            <div>
                                <label>House Number <span className="text-red-500">*</span></label>
                                <input type="number" className="w-full border mt-2 p-2 rounded text-gray-500 text-sm sm:text-base" />
                            </div>

                            <div>
                                <label>Designation <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border mt-2 p-2 rounded text-gray-500 text-sm sm:text-base" />
                            </div>
                        </div>

                    </div>

                    <div className="px-3 sm:px-4">
                        <button className="bg-[#748dff] text-white w-full py-2.5 sm:py-3 mt-2 rounded-lg text-sm sm:text-base">
                            Create User Record
                        </button>
                    </div>

                </div>

            </div >
        </>
    )
}