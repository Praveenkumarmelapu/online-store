import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiCurrencyRupee, HiShoppingBag, HiUsers, HiClock, HiTrendingUp, HiBell } from 'react-icons/hi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { analyticsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(new Date().toISOString());
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  useEffect(() => {
    const fetchData = async (isPolling = false) => {
      try {
        const [dashRes, chartRes] = await Promise.all([
          analyticsAPI.getDashboard(isPolling ? lastCheckTime : null),
          analyticsAPI.getSalesChart(chartPeriod),
        ]);
        
        setDashboard(dashRes.data);
        setChartData(chartRes.data);
        
        if (dashRes.data.new_orders_count > 0) {
          setNewOrderAlert(true);
          toast.success(`${dashRes.data.new_orders_count} New order(s) received!`, {
            icon: '🔔',
            duration: 8000,
          });
          // Play a notification sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(err => console.log("Sound play delayed until interaction"));
        }
        
        if (dashRes.data.server_time) {
          setLastCheckTime(dashRes.data.server_time);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        if (!isPolling) setLoading(false);
      }
    };

    fetchData();
    
    // Poll for new orders every 10 seconds for faster feedback
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, [chartPeriod, lastCheckTime]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const kpiCards = [
    { title: 'Total Revenue', value: `₹${(dashboard?.total_revenue || 0).toLocaleString()}`, icon: HiCurrencyRupee, color: 'from-green-500 to-emerald-600', change: `₹${(dashboard?.today_revenue || 0).toLocaleString()} today` },
    { title: 'Total Orders', value: dashboard?.total_orders || 0, icon: HiShoppingBag, color: 'from-blue-500 to-indigo-600', change: `${dashboard?.today_orders || 0} today` },
    { title: 'Total Users', value: dashboard?.total_users || 0, icon: HiUsers, color: 'from-purple-500 to-violet-600', change: 'Registered customers' },
    { title: 'Pending Orders', value: dashboard?.pending_orders || 0, icon: HiClock, color: 'from-amber-500 to-orange-600', change: 'Awaiting processing' },
  ];

  const statusColors = {
    pending: 'badge-warning', confirmed: 'badge-info', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger',
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800 flex items-center gap-3">
            Dashboard
            {newOrderAlert && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </h1>
          <p className="text-dark-500 mt-1 text-sm">Welcome back! Here's your store overview.</p>
        </div>
        {newOrderAlert && (
          <button 
            onClick={() => {setNewOrderAlert(false); toast.dismiss();}}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <HiBell className="w-4 h-4" /> Clear Alerts
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpiCards.map((card, i) => (
          <div key={i} className="card p-4 sm:p-5 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`}></div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${card.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-2 sm:mb-3`}>
              <card.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[10px] sm:text-sm text-dark-500">{card.title}</p>
            <p className="font-display font-bold text-lg sm:text-2xl text-dark-800 mt-0.5">{card.value}</p>
            <p className="text-[9px] sm:text-xs text-dark-400 mt-1 truncate">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 flex items-center gap-2">
              <HiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" /> Revenue
            </h2>
            <div className="flex gap-1">
              <button onClick={() => setChartPeriod('daily')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium ${chartPeriod === 'daily' ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-500'}`}>
                Daily
              </button>
              <button onClick={() => setChartPeriod('monthly')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium ${chartPeriod === 'monthly' ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-500'}`}>
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-4">Orders Count</h2>
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Summary + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-4">This Month</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-dark-500 text-sm">Revenue</span>
              <span className="font-display font-bold text-dark-800 text-sm sm:text-base">₹{(dashboard?.monthly_revenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-500 text-sm">Orders</span>
              <span className="font-display font-bold text-dark-800 text-sm sm:text-base">{dashboard?.monthly_orders || 0}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {(dashboard?.recent_orders || []).length === 0 ? (
              <p className="text-dark-400 text-xs sm:text-sm text-center py-4">No orders yet</p>
            ) : (
              dashboard.recent_orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-dark-50 last:border-0">
                  <div className="min-w-0">
                    <span className="font-medium text-dark-800 text-xs sm:text-sm truncate block">{order.order_number}</span>
                    <span className="text-[10px] text-dark-400 truncate block">{order.user_email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="font-medium text-xs sm:text-sm">₹{parseFloat(order.final_amount).toFixed(0)}</span>
                    <span className={`${statusColors[order.status] || 'badge'} text-[10px] sm:text-xs`}>{order.status_display}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
