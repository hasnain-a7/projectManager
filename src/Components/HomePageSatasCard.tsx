import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  color = "bg-primary",
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
  color?: string;
}) => (
  <Card className={cn("rounded-xl text-white overflow-hidden", color)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        {Icon && <Icon className="w-6 h-6 opacity-75" />}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {description && <p className="text-sm opacity-75">{description}</p>}
    </CardContent>
  </Card>
);
