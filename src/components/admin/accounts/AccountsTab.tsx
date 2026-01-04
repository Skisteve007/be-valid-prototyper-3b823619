import { useState } from "react";
import { AccountsDirectoryTab } from "./AccountsDirectoryTab";
import { AccountDetailPage } from "./AccountDetailPage";
import { DemoCockpit } from "./DemoCockpit";

type View = 
  | { type: "directory" }
  | { type: "detail"; accountId: string }
  | { type: "run"; accountId: string; deploymentId: string };

export const AccountsTab = () => {
  const [view, setView] = useState<View>({ type: "directory" });

  const handleSelectAccount = (accountId: string) => {
    setView({ type: "detail", accountId });
  };

  const handleBack = () => {
    if (view.type === "run") {
      setView({ type: "detail", accountId: view.accountId });
    } else {
      setView({ type: "directory" });
    }
  };

  const handleRunDemo = (accountId: string, deploymentId: string) => {
    setView({ type: "run", accountId, deploymentId });
  };

  if (view.type === "run") {
    return (
      <DemoCockpit
        accountId={view.accountId}
        deploymentId={view.deploymentId}
        onBack={handleBack}
      />
    );
  }

  if (view.type === "detail") {
    return (
      <AccountDetailPage
        accountId={view.accountId}
        onBack={handleBack}
        onRunDemo={handleRunDemo}
      />
    );
  }

  return (
    <AccountsDirectoryTab onSelectAccount={handleSelectAccount} />
  );
};
