import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
	return (
		<div className="flex flex-col gap-4">
			{[1, 2].map((skeletonId) => (
				<Card key={`skeleton-${skeletonId}`}>
					<CardHeader className="flex items-center gap-4">
						<div className="size-12 flex items-center justify-center rounded-full bg-primary/20 text-2xl">
							<Skeleton className="size-8" />
						</div>
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-24" />
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-3 w-full" />
						<div className="h-px w-full bg-border" />
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-6 w-24 rounded-3xl" />
							<Skeleton className="h-6 w-28 rounded-3xl" />
							<Skeleton className="h-6 w-32 rounded-3xl" />
							<Skeleton className="h-6 w-24 rounded-3xl" />
						</div>
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-6 w-20 rounded-3xl" />
							<Skeleton className="h-6 w-24 rounded-3xl" />
							<Skeleton className="h-6 w-28 rounded-3xl" />
						</div>
						<div className="h-px w-full bg-border" />
					</CardContent>
					<CardFooter className="flex justify-end gap-2">
						<Skeleton className="h-10 w-40 rounded-4xl" />
						<Skeleton className="h-10 w-40 rounded-4xl" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
};
