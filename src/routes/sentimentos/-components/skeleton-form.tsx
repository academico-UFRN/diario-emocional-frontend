import { Skeleton } from "@/components/ui/skeleton";

const feelingWidths = [
	{ id: "furious", width: "w-24" },
	{ id: "passionate", width: "w-28" },
	{ id: "frustrated", width: "w-20" },
	{ id: "motivated", width: "w-32" },
	{ id: "euphoric", width: "w-24" },
	{ id: "excited", width: "w-28" },
	{ id: "happy", width: "w-20" },
	{ id: "joyful", width: "w-32" },
	{ id: "hopeful", width: "w-24" },
	{ id: "calm", width: "w-28" },
	{ id: "relaxed", width: "w-20" },
	{ id: "serene", width: "w-32" },
	{ id: "sad", width: "w-24" },
	{ id: "discouraged", width: "w-28" },
	{ id: "anguished", width: "w-20" },
	{ id: "confused", width: "w-32" },
	{ id: "anxious", width: "w-24" },
	{ id: "shocked", width: "w-28" },
];

const triggerWidths = [
	{ id: "work", width: "w-24" },
	{ id: "exercise", width: "w-28" },
	{ id: "family", width: "w-32" },
	{ id: "other", width: "w-20" },
];

export const FormSkeleton = () => {
	return (
		<div className="flex flex-col gap-8" aria-busy="true">
			<section className="flex h-80 flex-col items-center justify-center gap-4 rounded-3xl bg-muted/50">
				<Skeleton className="size-40 rounded-full" />
				<div className="flex flex-col items-center gap-2">
					<Skeleton className="h-6 w-28" />
					<Skeleton className="h-4 w-24" />
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<Skeleton className="h-4 w-36" />
				<div className="relative h-2 w-full rounded-full bg-muted">
					<Skeleton className="absolute left-0 top-0 h-2 w-3/4 rounded-full" />
					<Skeleton className="absolute left-3/4 top-1/2 size-6 -translate-y-1/2 rounded-full" />
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<Skeleton className="h-4 w-96 max-w-full" />
				<div className="flex flex-wrap gap-2">
					{feelingWidths.map(({ id, width }) => (
						<Skeleton
							key={`feeling-skeleton-${id}`}
							className={`h-9 ${width} rounded-3xl`}
						/>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<Skeleton className="h-4 w-3/4 max-w-lg" />
				<div className="flex flex-wrap gap-2">
					{triggerWidths.map(({ id, width }) => (
						<Skeleton
							key={`trigger-skeleton-${id}`}
							className={`h-9 ${width} rounded-3xl`}
						/>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<Skeleton className="h-4 w-96 max-w-full" />
				<Skeleton className="h-28 w-full rounded-2xl" />
			</section>

			<div className="flex justify-end">
				<Skeleton className="h-9 w-24 rounded-4xl" />
			</div>
		</div>
	);
};
