import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Linkedin, Github, Globe, X } from "lucide-react";

function DevInfo() {
	const [open, setOpen] = useState(false);
	const popupRef = useRef();

	useEffect(() => {
		function handleClickOutside(event) {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative inline-block text-left">
			{/* Button */}
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex-nowrap"
				title="Developer Info"
			>
				{/* Larger icon */}
				<User className="flex-shrink-0 h-8 w-8" />
				<span className="hidden sm:inline truncate max-w-[8rem]">
					Developer Info
				</span>
			</button>

			{/* Popup */}
			{open && (
				<div
					ref={popupRef}
					className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-xs sm:left-auto sm:right-0 sm:translate-x-0 sm:max-w-sm bg-gray-800 text-white rounded-lg shadow-lg p-4 z-50 break-words animate-popup-in"
				>
					{/* Close button */}
					<div className="flex justify-end">
						<button onClick={() => setOpen(false)}>
							<X className="h-6 w-6" />
						</button>
					</div>

					{/* User Info */}
					<div className="flex flex-col gap-1 mb-2">
						<span className="font-bold text-sm">Prathviraj Hanimanale</span>
						<span className="text-xs text-gray-300">
							MERN Stack | CMRIT, 7th Sem
						</span>
						<span className="text-xs text-gray-300">USN: 1CR22IS109</span>
					</div>

					{/* Contact & Links */}
					<div className="flex flex-col gap-2 text-sm">
						<div className="flex flex-wrap items-center gap-2">
							<Phone className="h-6 w-6" /> <span>+91 8147188611</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Mail className="h-6 w-6" /> <span>prathvioct09@gmail.com</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Mail className="h-6 w-6" /> <span>prha22ise@cmrit.ac.in</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Linkedin className="h-6 w-6" />
							<a
								href="https://www.linkedin.com/in/prathvirajh"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								LinkedIn
							</a>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Github className="h-6 w-6" />
							<a
								href="https://github.com/prathvihan108"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								GitHub
							</a>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Globe className="h-6 w-6" />
							<a
								href="https://prathvirajh-portfolio.vercel.app/"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								Portfolio
							</a>
						</div>
					</div>
				</div>
			)}

			<style>
				{`
          @keyframes popup-in {
            0% { opacity: 0; transform: translateY(-5px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-popup-in {
            animation: popup-in 0.15s ease-out forwards;
          }
        `}
			</style>
		</div>
	);
}

export default DevInfo;
