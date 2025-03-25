import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col items-center text-center",
        className
      )}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-poppins font-semibold mb-3">{title}</h3>
      <p className="text-slate-700 opacity-80">{description}</p>
    </div>
  );
}
