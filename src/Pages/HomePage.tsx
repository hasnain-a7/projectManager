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
    return Object.entries(taskCache) // [projectId, projectData]
      .flatMap(([projectId, project]) =>
        project.tasks.map((task) => ({
          ...task,
          projectId, // add projectId
          projectTitle: project.title, // add project title (if available in your cache)
        }))
      )
      .filter((task) => task.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
  }, [taskCache]);

  console.log(latestTasks);

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
          <section className="mb-3">
            <div className="grid auto-rows-min gap-2 md:grid-cols-4">
              <StatsCard
                title="Projects"
                value={projects.length}
                icon={FolderOpen}
                color="bg-gradient-to-br from-sky-500 to-sky-600"
              />
              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-teal-500 to-teal-600"
              />
              <StatsCard
                title="Active"
                value={totalActiveTasks}
                icon={Clock}
                color="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              <StatsCard
                title="Completed"
                value={totalCompletedTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-violet-500 to-violet-600"
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
              <div className="w-3/4 h-min grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
