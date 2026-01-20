import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, Lightbulb, Plus, ArrowRight } from 'lucide-react';

/**
 * Student Finance Dashboard - Main View Mockup
 * 
 * Based on personas:
 * - Alex: Wants quick spending overview + roommate balances
 * - Maria: Needs semester budget tracking + debt collection
 * - Yuki: Wants currency clarity + shareable reports
 */

const DashboardMockup = () => {
  // Sample data
  const currentBalance = 1247.50;
  const monthlyIncome = 800;
  const monthlyExpenses = 652.30;
  const budgetProgress = [
    { category: 'Food & Dining', spent: 185, limit: 200, color: 'yellow' },
    { category: 'Entertainment', spent: 45, limit: 100, color: 'green' },
    { category: 'Transportation', spent: 62, limit: 60, color: 'red' },
  ];
  
  const roommateSplits = [
    { name: 'Sarah', owes: 45, status: 'pending' },
    { name: 'Mike', owes: 0, status: 'paid' },
  ];
  
  const aiInsights = [
    { type: 'warning', message: "You're spending 40% more on food delivery this week", action: "View breakdown" },
    { type: 'positive', message: "Great job! You're $55 under budget for entertainment", action: null },
    { type: 'tip', message: "Your coffee habit costs $120/month. Campus coffee saves $70", action: "Set coffee budget" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Alex 👋</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Balance & Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100">Current Balance</span>
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold mb-6">
              ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Income (MTD)
                </div>
                <div className="text-xl font-semibold">${monthlyIncome}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" />
                  Expenses (MTD)
                </div>
                <div className="text-xl font-semibold">${monthlyExpenses}</div>
              </div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Budget Progress</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {budgetProgress.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const colorClass = 
                  budget.color === 'green' ? 'bg-green-500' :
                  budget.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-red-500';
                
                return (
                  <div key={budget.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                      <span className="text-sm text-gray-600">
                        ${budget.spent} / ${budget.limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${colorClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    {percentage > 90 && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Close to limit</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, idx) => {
                const bgClass = 
                  insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                  insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200';
                
                const iconClass =
                  insight.type === 'warning' ? '⚠️' :
                  insight.type === 'positive' ? '✅' :
                  '💡';

                return (
                  <div key={idx} className={`border ${bgClass} rounded-xl p-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="mr-2">{iconClass}</span>
                          {insight.message}
                        </p>
                      </div>
                      {insight.action && (
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ml-4 whitespace-nowrap">
                          {insight.action}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 font-medium py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Generate new insights
            </button>
          </div>
        </div>

        {/* Right Column - Roommate Splits & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Users className="w-5 h-5" />
                Split Bill
              </button>
            </div>
          </div>

          {/* Roommate Balances */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Roommate Balances</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {roommateSplits.map((split) => (
                <div key={split.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                      {split.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{split.name}</p>
                      <p className="text-xs text-gray-500">
                        {split.status === 'paid' ? '✓ Settled' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  {split.owes > 0 ? (
                    <span className="text-green-600 font-semibold">
                      +${split.owes}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">$0</span>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all splits →
            </button>
          </div>

          {/* Recent Transactions Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {[
                { merchant: 'Starbucks', amount: -5.75, category: 'Food' },
                { merchant: 'Part-time Job', amount: +200, category: 'Income' },
                { merchant: 'Amazon', amount: -32.50, category: 'Shopping' },
              ].map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{txn.merchant}</p>
                    <p className="text-xs text-gray-500">{txn.category}</p>
                  </div>
                  <span className={`font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all transactions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
