import React from 'react';
import { Subscription } from '../types';

interface SummaryCardsProps {
  subscriptions: Subscription[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ subscriptions }) => {
  const activeSubs = subscriptions.filter(sub => sub.is_active);
  const monthlyTotal = activeSubs.reduce((acc, sub) => {
    return acc + (sub.billing_cycle === 'monthly' ? sub.cost : sub.cost / 12);
  }, 0);
  
  const yearlyTotal = activeSubs.reduce((acc, sub) => {
    return acc + (sub.billing_cycle === 'yearly' ? sub.cost : sub.cost * 12);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-sm font-medium text-slate-500 mb-1">Active Subscriptions</h3>
        <p className="text-3xl font-bold text-slate-900">{activeSubs.length}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-sm font-medium text-slate-500 mb-1">Monthly Spend</h3>
        <p className="text-3xl font-bold text-slate-900">${monthlyTotal.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-sm font-medium text-slate-500 mb-1">Yearly Spend</h3>
        <p className="text-3xl font-bold text-slate-900">${yearlyTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};
