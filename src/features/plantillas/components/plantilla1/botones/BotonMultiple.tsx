import { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsPerfilProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export default function BotonMultiple({
  tabs,
  defaultTab,
  onChange,
}: TabsPerfilProps) {
  const [activeTab, setActiveTab] = useState(
    defaultTab ?? tabs[0]?.id
  );

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="border-b border-gray-300">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`
              relative
              pb-3
              text-sm
              whitespace-nowrap
              transition-colors
              ${
                activeTab === tab.id
                  ? "text-black font-medium"
                  : "text-gray-700 hover:text-black"
              }
            `}
          >
            {tab.label}

            {activeTab === tab.id && (
              <span
                className="
                relative
                pb-3
                text-base
                leading-5
                text-center
                max-w-[100px]
                "
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}