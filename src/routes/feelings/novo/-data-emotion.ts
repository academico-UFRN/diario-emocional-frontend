import {
	AngryIcon,
	BookIcon,
	BriefcaseIcon,
	ConfusedIcon,
	DollarIcon,
	FireIcon,
	Happy01Icon,
	HealtcareIcon,
	HeartIcon,
	InLoveIcon,
	LaughingIcon,
	Moon01Icon,
	NeutralIcon,
	Sad01Icon,
	Sad02Icon,
	SadDizzyIcon,
	ShockedIcon,
	SmileDizzyIcon,
	SmileIcon,
	StarFaceIcon,
	Sun01Icon,
	SunIcon,
	Tired01Icon,
	UnhappyIcon,
	UserIcon,
	UsersIcon,
} from "@hugeicons/core-free-icons";

export const especificFeelingsToChoose = [
	// 🔴 Emoções Vermelhas (Raiva/Paixão)
	{
		id: "FURIOSO",
		name: "Furioso",
		feeling: -5,
		energy: 3,
		icon: AngryIcon,
		primaryColor: "#dc2626",
	},
	{
		id: "APAIXONADO",
		name: "Apaixonado",
		feeling: 5,
		energy: 4,
		icon: InLoveIcon,
		primaryColor: "#ef4444",
	},
	{
		id: "FRUSTADO",
		name: "Frustado",
		feeling: -3,
		energy: 2,
		icon: UnhappyIcon,
		primaryColor: "#f87171",
	},

	// 🟠 Emoções Laranja (Energia/Entusiasmo)
	{
		id: "MOTIVADO",
		name: "Motivado",
		feeling: 4,
		energy: 5,
		icon: FireIcon,
		primaryColor: "#f97316",
	},
	{
		id: "EUFORICO",
		name: "Eufórico",
		feeling: 5,
		energy: 5,
		icon: StarFaceIcon,
		primaryColor: "#fb923c",
	},
	{
		id: "EMPOLGADO",
		name: "Empolgado",
		feeling: 4,
		energy: 4,
		icon: LaughingIcon,
		primaryColor: "#fdba74",
	},

	// 🟡 Emoções Amarelas (Alegria/Otimismo)
	{
		id: "FELIZ",
		name: "Feliz",
		feeling: 4,
		energy: 3,
		icon: Happy01Icon,
		primaryColor: "#fbbf24",
	},
	{
		id: "ALEGRE",
		name: "Alegre",
		feeling: 3,
		energy: 3,
		icon: SmileIcon,
		primaryColor: "#fcd34d",
	},
	{
		id: "ESPERANCOSO",
		name: "esperançoso",
		feeling: 2,
		energy: 2,
		icon: Sun01Icon,
		primaryColor: "#fde047",
	},

	// 🟢 Emoções Verdes (Paz/Calma)
	{
		id: "CALMO",
		name: "Calmo",
		feeling: 2,
		energy: -2,
		icon: SunIcon,
		primaryColor: "#10b981",
	},
	{
		id: "RELAXADO",
		name: "Relaxado",
		feeling: 3,
		energy: -1,
		icon: Moon01Icon,
		primaryColor: "#34d399",
	},
	{
		id: "SERENO",
		name: "Sereno",
		feeling: 2,
		energy: -1,
		icon: HeartIcon,
		primaryColor: "#6ee7b7",
	},

	// 🔵 Emoções Azuis (Tristeza/Melancolia)
	{
		id: "TRISTE",
		name: "Triste",
		feeling: -4,
		energy: -3,
		icon: Sad01Icon,
		primaryColor: "#3b82f6",
	},
	{
		id: "DESANIMADO",
		name: "Desanimado",
		feeling: -3,
		energy: -2,
		icon: Sad02Icon,
		primaryColor: "#60a5fa",
	},
	{
		id: "ANGUSTIADO",
		name: "Angustiado",
		feeling: -4,
		energy: 1,
		icon: SadDizzyIcon,
		primaryColor: "#93c5fd",
	},

	// 🟣 Emoções Roxas (Confusão/Ansiedade)
	{
		id: "CONFUSO",
		name: "Confuso",
		feeling: -1,
		energy: 0,
		icon: ConfusedIcon,
		primaryColor: "#a78bfa",
	},
	{
		id: "ANSIOSO",
		name: "Ansioso",
		feeling: -2,
		energy: 3,
		icon: SmileDizzyIcon,
		primaryColor: "#c4b5fd",
	},
	{
		id: "CHOCADO",
		name: "Chocado",
		feeling: 0,
		energy: 2,
		icon: ShockedIcon,
		primaryColor: "#ddd6fe",
	},

	// ⚫ Emoções Cinzas (Neutro/Cansado)
	{
		id: "NEUTRO",
		name: "Neutro",
		feeling: 0,
		energy: 0,
		icon: NeutralIcon,
		primaryColor: "#6b7280",
	},
	{
		id: "EXAUSTO",
		name: "Exausto",
		feeling: -2,
		energy: -4,
		icon: Tired01Icon,
		primaryColor: "#9ca3af",
	},
];

export const triggersToChoose = [
	{
		id: "TRABALHO",
		name: "Trabalho",
		icon: BriefcaseIcon,
	},
	{
		id: "ESTUDOS",
		name: "Estudos",
		icon: BookIcon,
	},
	{
		id: "FAMILIA",
		name: "Família",
		icon: UsersIcon,
	},
	{
		id: "AMIGOS",
		name: "Amigos",
		icon: UserIcon,
	},
	{
		id: "RELACIONAMENTO",
		name: "Relacionamento",
		icon: HeartIcon,
	},
	{
		id: "SAUDE",
		name: "Saúde",
		icon: HealtcareIcon,
	},
	{
		id: "FINANCAS",
		name: "Finanças",
		icon: DollarIcon,
	},
	{
		id: "LAZER",
		name: "Lazer",
		icon: SunIcon,
	},
	{
		id: "OUTROS",
		name: "Outros",
		icon: ConfusedIcon,
	},
];
