import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("tracking-tight scroll-m-20", {
	variants: {
		variant: {
			h1: "text-4xl font-extrabold lg:text-5xl",
			h2: "text-3xl font-semibold border-b pb-2",
			h3: "text-2xl font-semibold",
			h4: "text-xl font-semibold",
		},
	},
	defaultVariants: {
		variant: "h1",
	},
});

interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {
	as?: "h1" | "h2" | "h3" | "h4";
}

export function Heading({ className, variant, as, ...props }: HeadingProps) {
	const Component = as || variant || "h1";
	return (
		<Component
			className={cn(headingVariants({ variant }), className)}
			{...props}
		/>
	);
}
