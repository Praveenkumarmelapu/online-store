import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getUsers();
        setUsers(res.data?.results || res.data || []);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display font-bold text-3xl text-dark-800 mb-6">Users</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 text-dark-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Orders</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-dark-800">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-dark-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-dark-600">{user.email}</td>
                  <td className="px-4 py-3 text-dark-600">{user.phone || '—'}</td>
                  <td className="px-4 py-3 text-dark-600">{user.city ? `${user.city}, ${user.state}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className="badge-primary">{user.orders_count}</span>
                  </td>
                  <td className="px-4 py-3 text-dark-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_staff ? (
                      <span className="badge-info">Admin</span>
                    ) : user.is_active ? (
                      <span className="badge-success">Active</span>
                    ) : (
                      <span className="badge-danger">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
