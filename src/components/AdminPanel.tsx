import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // путь поправьте под ваш проект
import { Trash2, Ban } from 'lucide-react';

type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  bio?: string;
  is_public?: boolean;
  banned_until?: string | null;
};

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Получить всех пользователей
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, email, bio, is_public, banned_until');
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Удалить пользователя
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    setUsers(users => users.filter(u => u.id !== id));
  };

  // Забанить пользователя на 7 дней
  const handleBan = async (id: string) => {
    const bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('profiles').update({ banned_until: bannedUntil }).eq('id', id);
    setUsers(users =>
      users.map(u => (u.id === id ? { ...u, banned_until: bannedUntil } : u))
    );
  };

  // Разбанить пользователя
  const handleUnban = async (id: string) => {
    await supabase.from('profiles').update({ banned_until: null }).eq('id', id);
    setUsers(users =>
      users.map(u => (u.id === id ? { ...u, banned_until: null } : u))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-yellow-300 mt-8 p-8">
      <h3 className="text-2xl font-bold text-yellow-700 mb-6 flex items-center">
        <span className="mr-2">⚡</span>
        Admin Panel
      </h3>
      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Username</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Bio</th>
                <th className="py-2 px-3 text-left">Public</th>
                <th className="py-2 px-3 text-left">Ban status</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="py-2 px-3">{u.full_name}</td>
                  <td className="py-2 px-3">{u.username}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.bio}</td>
                  <td className="py-2 px-3">{u.is_public ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-3">
                    {u.banned_until
                      ? (
                        <span className="text-red-600">
                          Banned until {new Date(u.banned_until).toLocaleDateString()}
                        </span>
                      )
                      : <span className="text-green-600">Active</span>
                    }
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete user"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                    {u.banned_until ? (
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Unban user"
                        onClick={() => handleUnban(u.id)}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Ban user for 7 days"
                        onClick={() => handleBan(u.id)}
                      >
                        <Ban size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;