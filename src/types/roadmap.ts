export type Roadmap = {
  slug: string;
  title: string;
  description: string;
  targetAudience: string[];
  estimatedMonths: number;
  steps: RoadmapStep[];
};

export type RoadmapStep = {
  order: number;
  courseSlug: string;
  reason: string;
  optional?: boolean;
};
