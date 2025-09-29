import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { CheckCircle, Clock, FolderOpen } from "lucide-react";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/HomePageSatasCard";
import Loader from "@/components/Loader";
import LatestUpdatedTasks from "@/components/LatestUpdatedTasks";

const HomePage = () => {
  const { projects, taskCache, loading } = useTaskContext();

  const totalTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) => acc + project.tasks.length,
      0
    );
  }, [taskCache]);

  const totalActiveTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === "active").length,
      0
    );
  }, [taskCache]);

  const totalCompletedTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) =>
        acc +
        project.tasks.filter((task) => task.status === "completed").length,
      0
    );
  }, [taskCache]);

  const latestTasks = useMemo(() => {
    return Object.values(taskCache)
      .flatMap((project) => project.tasks)
      .filter((task) => task.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
  }, [taskCache]);

  const navigate = useNavigate();
  const handleProjectClick = (projectId: string) => {
    console.log(`Navigating to project: ${projectId}`);
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto p-3 flex-1">
          <section className="mb-5">
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
                value={totalActiveTasks}
                icon={Clock}
                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
              />
              <StatsCard
                title="Completed"
                value={totalCompletedTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-fuchsia-400 to-fuchsia-500"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
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

            <div className="flex gap-2">
              <div className="w-3/4 h-min grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    tasks={taskCache[project?.id]?.tasks || []}
                    onClick={handleProjectClick}
                  />
                ))}
              </div>

              <LatestUpdatedTasks latestTasks={latestTasks} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
