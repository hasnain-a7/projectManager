import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

const TaskDetailsAccordion = ({
  task,
}: {
  task: Todo & { dueDate: string };
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem
      value={`task-${task.id}`}
      className="border-b last:border-b-0 cursor-pointer"
    >
      <AccordionTrigger className="hover:no-underline px-3 py-1">
        <div className="flex items-center w-full cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3" />

          <span className="flex-1 text-sm font-medium text-left truncate">
            {task.title || task.name}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-2">
        <div className="w-full rounded-lg bg-muted p-3">
          <div className="flex">
            <div className="space-y-4 ">
              <div className="w-full ">
                <div className="flex items-center mb-2 ">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Description
                  </p>
                </div>
                <p className="text-sm w-full text-foreground/80 line-clamp-3">
                  {task.todo || "No description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
export default TaskDetailsAccordion;
