import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SubscriptionCreate } from '../types';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  cost: z.number().positive('Cost must be greater than 0'),
  billing_cycle: z.enum(['monthly', 'yearly']),
  next_billing_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  category: z.string().min(1, 'Category is required').max(100),
  is_active: z.boolean(),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionCreate) => void;
  isSubmitting: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      billing_cycle: 'monthly',
      is_active: true,
    },
  });

  const handleFormSubmit = (data: SubscriptionFormValues) => {
    onSubmit(data as SubscriptionCreate);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Add Subscription</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            {...register('name')}
            placeholder="e.g. Netflix"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cost</label>
          <input
            {...register('cost', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cost && <p className="mt-1 text-xs text-red-500">{errors.cost.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cycle</label>
          <select
            {...register('billing_cycle')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.billing_cycle && <p className="mt-1 text-xs text-red-500">{errors.billing_cycle.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Next Payment</label>
          <input
            {...register('next_billing_date')}
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.next_billing_date && <p className="mt-1 text-xs text-red-500">{errors.next_billing_date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <input
            {...register('category')}
            placeholder="e.g. Entertainment"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
};
