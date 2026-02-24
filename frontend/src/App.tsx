import { useEffect, useState } from "react";
import { SubscriptionService } from "./services/api";
import { Subscription, SubscriptionCreate } from "./types";
import { SummaryCards } from "./components/SummaryCards";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionList } from "./components/SubscriptionList";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await SubscriptionService.getAll();
      setSubscriptions(data);
    } catch (err) {
      setError(
        "Failed to load subscriptions. Please ensure the backend is running.",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = async (data: SubscriptionCreate) => {
    try {
      setIsSubmitting(true);
      await SubscriptionService.create(data);
      await fetchSubscriptions(); // Refresh list
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axError = err as { response?: { data?: { details?: Array<{ msg: string }> } } };
        setError(axError?.response?.data?.details?.[0]?.msg || 'Failed to add subscription. Check your inputs.');
      } else {
        setError('Failed to add subscription. Check your inputs.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    try {
      await SubscriptionService.delete(id);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    } catch {
      setError("Failed to delete subscription.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              SubTrack
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your recurring expenses with confidence.
            </p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-start">
            <div className="flex-1 font-medium text-sm">{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <SummaryCards subscriptions={subscriptions} />

        <SubscriptionForm
          onSubmit={handleAddSubscription}
          isSubmitting={isSubmitting}
        />

        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            Loading your subscriptions...
          </div>
        ) : (
          <SubscriptionList
            subscriptions={subscriptions}
            onDelete={handleDeleteSubscription}
          />
        )}
      </div>
    </div>
  );
}

export default App;
