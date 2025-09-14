import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { CheckCircle, Clock, FolderOpen } from "lucide-react";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/HomePageSatasCard";

const HomePage = () => {
  const { projects, taskCache, loading } = useTaskContext();
  const totalTasks = Object.values(taskCache).reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const TotalActiveTasks = Object.values(taskCache).reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.status === "active").length,
    0
  );
  const TotalCompletedTasks = Object.values(taskCache).reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.status === "completed").length,
    0
  );
  console.log("Total tasks in all projects:", totalTasks);
  console.log("Total active tasks:", TotalActiveTasks);
  console.log("Total completed tasks:", TotalCompletedTasks);

  const navigate = useNavigate();
  const handleProjectClick = (projectId: string) => {
    console.log(`Navigating to project: ${projectId}`);
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto p-6 flex-1">
          <section className="mb-8">
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
              <StatsCard
                title="Projects"
                value={projects.length}
                icon={FolderOpen}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              <StatsCard
                title="Active"
                value={TotalActiveTasks}
                icon={Clock}
                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
              />
              <StatsCard
                title="Completed"
                value={TotalCompletedTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-fuchsia-400 to-fuchsia-500"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">My Projects</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {projects.length} Projects
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {totalTasks} Tasks
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={taskCache[project?.id]?.tasks || []}
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
