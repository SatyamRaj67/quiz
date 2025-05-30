"use client";

import React from "react";
import { Brain } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
}

export function PageHeader({
  title,
  description,
  icon: Icon = Brain,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        <h1 className="bg-gradient-to-r from-gray-900 to-black bg-clip-text text-4xl font-bold text-transparent dark:from-gray-100 dark:to-white">
          {title}
        </h1>
      </div>
      <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
