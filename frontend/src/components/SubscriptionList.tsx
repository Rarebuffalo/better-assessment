import React from 'react';
import { Subscription } from '../types';
import { Trash2 } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: number) => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onDelete }) => {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-100">
        <p className="text-slate-500">No subscriptions found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Billing Cycle</th>
              <th className="px-6 py-4">Next Payment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{sub.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {sub.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">${sub.cost.toFixed(2)}</td>
                <td className="px-6 py-4 capitalize">{sub.billing_cycle}</td>
                <td className="px-6 py-4">{new Date(sub.next_billing_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Delete Subscription"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
