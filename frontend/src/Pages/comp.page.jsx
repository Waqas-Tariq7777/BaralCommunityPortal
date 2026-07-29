import { MdOutlineSpeed } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { MdOutlinePublic } from "react-icons/md";
import { MdVerifiedUser } from "react-icons/md";
import { MdOutlineInfo } from "react-icons/md";
import { FaBullseye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdMiscellaneousServices } from "react-icons/md";
import bgImage from "./assets/dam.jpg"
import { FaHandshakeAngle } from "react-icons/fa6";

export default function About() {
    return (
        <>
            <div
                className="h-48 sm:h-64 md:h-80 bg-cover bg-center flex items-center justify-center px-4"
                style={{
                    backgroundImage: `url(${bgImage})`
                }} >

                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold px-4 py-2 rounded text-center drop-shadow-lg">
                    About US
                </h1>
            </div>

            <div className="relative -mt-10 sm:-mt-16 px-3 sm:px-6 pb-10">

                <div className="bg-white max-w-3xl mx-auto rounded-lg shadow-md p-4 sm:p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-5">
                        <MdOutlineInfo className="text-[#748dff] text-xl sm:text-2xl" />

                        <h2 className="text-xl sm:text-2xl font-medium text-[#748dff] ">
                            About Baral WAPDA Community Portal
                        </h2>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-5 text-sm sm:text-base">
                        The Baral WAPDA Community Portal is a dedicated digital platform created exclusively for the residents of Mangla WAPDA Colony. It is designed to make it easier for community members to submit utility-related complaints, share valuable suggestions, and provide constructive feedback directly to the relevant WAPDA departments without the hassle of lengthy paperwork or physical visits.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                        Our team understands the challenges that residents face when trying to get their concerns addressed in a timely manner. This portal serves as a single, centralized point of contact where issues can be recorded, monitored, and resolved efficiently.
                    </p>

                    <div className="flex items-center gap-3 mb-5">
                        <FaBullseye className=" text-[#748dff] text-xl sm:text-2xl" />

                        <h2 className="text-xl sm:text-2xl font-medium text-[#748dff] ">
                            Our Mission
                        </h2>
                    </div>


                    <p className="text-gray-700 leading-relaxed mb-5 text-sm sm:text-base">
                        Our mission is simple yet powerful: to create a faster, more transparent, and more accessible way for Mangla WAPDA residents to communicate with service departments. We believe that when residents have a clear and reliable channel to voice their concerns, the entire community benefits.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                        We are committed to bridging the gap between the people and the services they depend on daily. Whether it’s about improving electricity distribution, enhancing water supply systems, or resolving maintenance issues, we work with dedication to ensure that every resident’s voice is heard and acted upon.
                    </p>

                    <div className="flex items-center gap-3 mb-5">
                        <MdMiscellaneousServices className=" text-[#748dff] text-xl sm:text-2xl" />
                        <h2 className="text-xl sm:text-2xl font-medium text-[#748dff] ">
                            What We Offer
                        </h2>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                        This platform goes beyond just complaint registration — it empowers residents with tools and features that make interaction with WAPDA departments smoother and more effective. You can:
                    </p>

                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-5 text-sm sm:text-base">
                        <li>Submit complaints quickly and securely from anywhere.</li>
                        <li>Track the status of your complaint in real-time and receive timely updates.</li>
                        <li>Access historical records of your submissions for reference.</li>
                        <li>Share feedback and suggestions to help improve community facilities.</li>
                    </ul>

                    <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                        From electricity outages to water supply disruptions, faulty streetlights to sanitation concerns, our system covers a wide range of community service areas so that no issue goes unnoticed.
                    </p>

                    <div className="flex items-center gap-3 mb-5">
                        <MdVerifiedUser className=" text-[#748dff] text-xl sm:text-2xl" />
                        <h2 className="text-xl sm:text-2xl font-medium text-[#748dff] ">
                            Key Benefits
                        </h2>
                    </div>

                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 text-sm sm:text-base">
                        <li>
                            <span className="font-semibold">Speed:</span>
                            {" "}No more waiting in queues — submit your concern instantly.
                        </li>

                        <li>
                            <span className="font-semibold">Transparency:</span>
                            {" "}View every step of the complaint resolution process.
                        </li>

                        <li>
                            <span className="font-semibold">Accessibility:</span>
                            {" "}Easy to use for all age groups, anytime, anywhere.
                        </li>

                        <li>
                            <span className="font-semibold">Accountability:</span>
                            {" "}Complaints are routed directly to the concerned department for action.
                        </li>
                    </ul>
                    <div className="flex items-center gap-3 mb-5">
                        <FaHandshakeAngle className=" text-[#748dff] text-xl sm:text-2xl" />
                        <h2 className="text-xl sm:text-2xl font-medium text-[#748dff] ">
                            Together for a Better Community
                        </h2>
                    </div>


                    <p className="text-gray-700 leading-relaxed mb-5 text-sm sm:text-base">
                        We believe that a strong community is built on active participation, open communication, and mutual respect. Every complaint, suggestion, and piece of feedback is a building block toward a more efficient and responsive WAPDA service.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        By working together, residents and WAPDA departments can create a living environment that is safer, more reliable, and better connected. This portal is not just a tool — it is a partnership between the community and the services it depends on.
                    </p>

                </div>
            </div>
        </>
    )
}