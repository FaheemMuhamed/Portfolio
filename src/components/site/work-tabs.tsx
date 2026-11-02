"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkTabs({ tabs }: { tabs: { value: string; label: string; count: number; content: ReactNode }[] }) {
  return (
    <Tabs defaultValue={tabs[0]?.value}>
      <TabsList variant="line" className="-ml-1.5 gap-3">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="flex-none px-1.5 text-[13px]">
            {t.label}
            <span className="font-mono text-[11px] text-muted-foreground">{t.count}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="pt-6">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
