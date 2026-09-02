import { useMemo } from "react";

interface CareComponentProps {
	value: number; // -5 to 5
}

export const CareComponent = ({ value }: CareComponentProps) => {
	const { color, emoji, label, backgroundColor, shapeStyle, secondaryColor } =
		useMemo(() => {
			if (value <= 1) {
				return {
					color: "bg-red-400",
					secondaryColor: "bg-red-600",
					emoji: "😠",
					label: "Muito Desagradável",
					backgroundColor: "bg-red-50",
					shapeStyle: {
						borderRadius: "0%",
					},
				};
			} else if (value <= 2) {
				return {
					secondaryColor: "bg-orange-600",
					color: "bg-orange-400",
					emoji: "😒",
					label: "Desagradável",
					backgroundColor: "bg-orange-50",
					shapeStyle: {
						borderRadius: "2%",
					},
				};
			} else if (value <= 3) {
				return {
					color: "bg-gray-400",
					secondaryColor: "bg-gray-600",
					emoji: "😐",
					label: "Neutro",
					backgroundColor: "bg-gray-100",
					shapeStyle: {
						borderRadius: "4%",
					},
				};
			} else if (value <= 4) {
				return {
					color: "bg-lime-400",
					secondaryColor: "bg-lime-600",
					emoji: "🙂",
					label: "Agradável",
					backgroundColor: "bg-lime-50",
					shapeStyle: {
						borderRadius: "6%",
					},
				};
			} else {
				return {
					color: "bg-green-400",
					secondaryColor: "bg-green-600",
					emoji: "😄",
					label: "Muito Agradável",
					backgroundColor: "bg-green-50",
					shapeStyle: {
						borderRadius: "8%",
					},
				};
			}
		}, [value]);

	return (
		<div
			className={`${backgroundColor} rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-80`}
		>
			<div className="relative w-40 h-40 flex items-center justify-center">
				{/* Top */}
				<div
					className={`z-10 absolute ${color} rotate-[67.5deg] transition-all duration-500`}
					style={{
						width: "128px",
						height: "128px",
						...shapeStyle,
					}}
				></div>
				{/* Right */}
				<div
					className={`z-10 absolute ${color} rotate-45 transition-all duration-500`}
					style={{
						width: "128px",
						height: "128px",
						...shapeStyle,
					}}
				></div>
				{/* Bottom */}
				<div
					className={`z-10 absolute ${color} rotate-[22.5deg] transition-all duration-500`}
					style={{
						width: "128px",
						height: "128px",
						...shapeStyle,
					}}
				></div>
				{/* Left */}
				<div
					className={`z-10 absolute ${color} transition-all duration-500`}
					style={{
						width: "128px",
						height: "128px",
						...shapeStyle,
					}}
				></div>

				{/* Top */}
				<div
					className={`z-20 absolute ${secondaryColor} rotate-[67.5deg] transition-all duration-500`}
					style={{
						width: "64px",
						height: "64px",
						...shapeStyle,
					}}
				></div>
				{/* Right */}
				<div
					className={`z-20 absolute ${secondaryColor} rotate-45 transition-all duration-500`}
					style={{
						width: "64px",
						height: "64px",
						...shapeStyle,
					}}
				></div>
				{/* Bottom */}
				<div
					className={`z-20 absolute ${secondaryColor} rotate-[22.5deg] transition-all duration-500`}
					style={{
						width: "64px",
						height: "64px",
						...shapeStyle,
					}}
				></div>
				{/* Left */}
				<div
					className={`z-20 absolute ${secondaryColor} transition-all duration-500`}
					style={{
						width: "64px",
						height: "64px",
						...shapeStyle,
					}}
				></div>

				{/* Emoji */}
				<div className="z-30 absolute text-3xl">{emoji}</div>
			</div>

			{/* Label */}
			<div className="text-center">
				<h3 className="text-2xl font-bold text-gray-800">{label}</h3>
				<p className="text-gray-600">
					{value === 5
						? "Dia sensacional! ✨"
						: value === 4
							? "Dia muito bom!"
							: value === 3
								? "Dia normal!"
								: value === 2
									? "Dia ruim!"
									: value === 1
										? "Dia péssimo!"
										: value === 0}
				</p>
			</div>

			<style>{`
				@keyframes pulse {
					0%, 100% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
				}
			`}</style>
		</div>
	);
};
