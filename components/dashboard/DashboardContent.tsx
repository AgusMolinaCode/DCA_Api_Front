import { TransactionList } from "./TransactionList";
import { TransactionEmpty } from "./TransactionEmpty";
import { getTransactions } from "@/lib/actions";

async function DashboardContent({ refreshData }: { refreshData?: () => void }) {
  const response = await getTransactions();
  const transactions = response.success && response.data ? response.data : [];
  const error = !response.success ? response.error : null; 

  if (!response.success || transactions.length === 0) {
    return <TransactionEmpty />;
  }

  return (
    <TransactionList
      transactions={transactions}
      refreshTransactions={refreshData}
    />
  );
}

export default DashboardContent;
