import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Project = {
  title: string;
  description: string;
  completed: number;
  total: number;
};

const projects: Project[] = [
  {
    title: "Gym Project",
    description: "Track workouts and goals",
    completed: 1,
    total: 1,
  },
  {
    title: "University CMS",
    description: "Manage students, courses, and results",
    completed: 5,
    total: 10,
  },
  {
    title: "E-Commerce App",
    description: "Admin + user dashboard",
    completed: 8,
    total: 15,
  },
  {
    title: "Sports",
    description: "safdkkkkkkkkkkkkkkk",
    completed: 4,
    total: 20,
  },
];

const ProjectCard = ({ title, description, completed, total }: Project) => {
  const percentage =
    total === 1
      ? 100
      : Math.min(100, Math.round((completed / total) * 70 + 30));

  const statusColor =
    percentage === 100
      ? "bg-green-500"
      : percentage >= 70
      ? "bg-blue-500"
      : percentage >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <Card className="w-full border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm font-medium">
          ✅ {completed}/{total} tasks done
        </p>
        <div className="flex items-center gap-3">
          <Progress value={percentage} className="h-2 flex-1 rounded-full" />{" "}
          <Badge className={cn("text-white text-xs", statusColor)}>
            {percentage}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto p-6 flex-1">
          <section className="mb-4">
            <div className="grid  auto-rows-min gap-2 md:grid-cols-3">
              <div className=" rounded-xl bg-primary" />

              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">My Projects</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
