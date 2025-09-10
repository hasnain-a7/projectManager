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
    <AccordionItem value={`task-${task.id}`} className="border-none">
      <AccordionTrigger className="hover:no-underline px-3 py-1">
        <div className="flex items-center w-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3"></div>
          <span className="text-sm font-medium text-left flex-1">
            {task.title || task.name}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <div className="bg-gray-50 rounded-lg p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </span>
                </div>
                <p className="text-sm w-full text-gray-700 pl-2 ">
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
