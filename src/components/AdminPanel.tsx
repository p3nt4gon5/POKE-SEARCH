// import React, { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { Trash2, Ban } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useUserStats } from '../hooks/useUserStats';

// // Типы

// type UserProfile = {
//   id: string;
//   full_name: string;
//   username: string;
//   email: string;
//   bio?: string;
//   is_public?: boolean;
//   banned_until?: string | null;
// };

// type AdminPokemon = {
//   id: string;
//   pokemon_name: string;
//   pokemon_image: string;
//   hidden: boolean;
// };

// const AdminPanel: React.FC = () => {
//   const { user } = useAuth();
//   const {
//     userCount,
//     libraryCount,
//     favoritesCount,
//     loading: statsLoading
//   } = useUserStats();

//   const ADMIN_EMAIL = 'kekdanik715@gmail.com';

//   if (!user || user.email !== ADMIN_EMAIL) {
//     return null;
//   }

//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pokemons, setPokemons] = useState<AdminPokemon[]>([]);
//   const [newPokemon, setNewPokemon] = useState({ name: '', image: '' });

//   const fetchUsers = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('id, full_name, username, email, bio');
//     if (!error && data) setUsers(data);
//     setLoading(false);
//   };

//   const fetchPokemons = async () => {
//     const { data, error } = await supabase.from('admin_pokemon').select('*');
//     if (!error && data) setPokemons(data);
//   };

//   const handleDeletePokemon = async (id: string) => {
//     await supabase.from('admin_pokemon').delete().eq('id', id);
//     fetchPokemons();
//   };

//   const toggleVisibility = async (id: string, hidden: boolean) => {
//     await supabase.from('admin_pokemon').update({ hidden: !hidden }).eq('id', id);
//     fetchPokemons();
//   };

//   const handleAddPokemon = async () => {
//     if (!newPokemon.name || !newPokemon.image) return;
//     await supabase.from('admin_pokemon').insert({
//       pokemon_name: newPokemon.name,
//       pokemon_image: newPokemon.image,
//       hidden: false
//     });
//     setNewPokemon({ name: '', image: '' });
//     fetchPokemons();
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchPokemons();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     await supabase.from('profiles').delete().eq('id', id);
//     setUsers(users => users.filter(u => u.id !== id));
//   };

//   const handleBan = async (id: string) => {
//     const bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
//     await supabase.from('profiles').update({ banned_until: bannedUntil }).eq('id', id);
//     setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: bannedUntil } : u)));
//   };

//   const handleUnban = async (id: string) => {
//     await supabase.from('profiles').update({ banned_until: null }).eq('id', id);
//     setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: null } : u)));
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-blue-300 mt-8 p-8">
//       <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
//         <span className="mr-2">⚡</span>
//         Admin Panel
//       </h3>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">👥 Total Users</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : userCount}</p>
//         </div>
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">📚 In Library</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : libraryCount}</p>
//         </div>
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">⭐ Favorites</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : favoritesCount}</p>
//         </div>
//       </div>

//       {/* Users */}
//       <h4 className="text-lg font-semibold text-blue-700 mb-2">👤 Users</h4>
//       <div className="overflow-x-auto mb-8">
//         {loading ? (
//           <div>Loading users...</div>
//         ) : (
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-3 text-left">Name</th>
//                 <th className="py-2 px-3 text-left">Username</th>
//                 <th className="py-2 px-3 text-left">Email</th>
//                 <th className="py-2 px-3 text-left">Bio</th>
//                 <th className="py-2 px-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(u => (
//                 <tr key={u.id} className="border-b">
//                   <td className="py-2 px-3">{u.full_name}</td>
//                   <td className="py-2 px-3">{u.username}</td>
//                   <td className="py-2 px-3">{u.email}</td>
//                   <td className="py-2 px-3">{u.bio}</td>
//                   <td className="py-2 px-3 flex gap-2">
//                     <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(u.id)}><Trash2 size={18} /></button>
//                     {u.banned_until ? (
//                       <button className="text-blue-600 hover:text-blue-800" onClick={() => handleUnban(u.id)}>Unban</button>
//                     ) : (
//                       <button className="text-yellow-600 hover:text-yellow-800" onClick={() => handleBan(u.id)}><Ban size={18} /></button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pokemons */}
//       <h4 className="text-lg font-semibold text-blue-700 mb-2">🧩 Pokemons</h4>
//       <div className="space-y-4">
//         <div className="flex gap-2 items-center">
//           <input type="text" placeholder="Name" value={newPokemon.name} onChange={e => setNewPokemon(p => ({ ...p, name: e.target.value }))} className="border p-2 rounded" />
//           <input type="text" placeholder="Image URL" value={newPokemon.image} onChange={e => setNewPokemon(p => ({ ...p, image: e.target.value }))} className="border p-2 rounded" />
//           <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddPokemon}>Add</button>
//         </div>

//         <table className="min-w-full text-sm border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-3 text-left">Name</th>
//               <th className="py-2 px-3 text-left">Image</th>
//               <th className="py-2 px-3 text-left">Status</th>
//               <th className="py-2 px-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pokemons.map(p => (
//               <tr key={p.id} className="border-b">
//                 <td className="py-2 px-3">{p.pokemon_name}</td>
//                 <td className="py-2 px-3"><img src={p.pokemon_image} alt={p.pokemon_name} className="h-8" /></td>
//                 <td className="py-2 px-3">{p.hidden ? '⛔ Hidden' : '✅ Visible'}</td>
//                 <td className="py-2 px-3 flex gap-2">
//                   <button className="text-red-600 hover:text-red-800" onClick={() => handleDeletePokemon(p.id)}><Trash2 size={18} /></button>
//                   <button className="text-blue-600 hover:text-blue-800" onClick={() => toggleVisibility(p.id, p.hidden)}>
//                     {p.hidden ? 'Show' : 'Hide'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;




// import React, { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { Trash2, Ban } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useUserStats } from '../hooks/useUserStats';
// import { useRole } from '../hooks/useRole'; // ✅ добавлен импорт

// type UserProfile = {
//   id: string;
//   full_name: string;
//   username: string;
//   email: string;
//   bio?: string;
//   is_public?: boolean;
//   banned_until?: string | null;
// };

// type AdminPokemon = {
//   id: string;
//   pokemon_name: string;
//   pokemon_image: string;
//   hidden: boolean;
// };

// const AdminPanel: React.FC = () => {
//   const { user } = useAuth();
//   const { role, loading: roleLoading } = useRole(); // ✅ добавлено

//   const {
//     userCount,
//     libraryCount,
//     favoritesCount,
//     loading: statsLoading
//   } = useUserStats();

//   if (!user || roleLoading) return null; // ⏳ загрузка роли
//   if (role !== 'admin') return null;     // ⛔ нет доступа

//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pokemons, setPokemons] = useState<AdminPokemon[]>([]);
//   const [newPokemon, setNewPokemon] = useState({ name: '', image: '' });

//   const fetchUsers = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('id, full_name, username, email, bio, banned_until');
//     if (!error && data) setUsers(data);
//     setLoading(false);
//   };

//   const fetchPokemons = async () => {
//     const { data, error } = await supabase.from('admin_pokemon').select('*');
//     if (!error && data) setPokemons(data);
//   };

//   const handleDeletePokemon = async (id: string) => {
//     await supabase.from('admin_pokemon').delete().eq('id', id);
//     fetchPokemons();
//   };

//   const toggleVisibility = async (id: string, hidden: boolean) => {
//     await supabase.from('admin_pokemon').update({ hidden: !hidden }).eq('id', id);
//     fetchPokemons();
//   };

//   const handleAddPokemon = async () => {
//     if (!newPokemon.name || !newPokemon.image) return;
//     await supabase.from('admin_pokemon').insert({
//       pokemon_name: newPokemon.name,
//       pokemon_image: newPokemon.image,
//       hidden: false
//     });
//     setNewPokemon({ name: '', image: '' });
//     fetchPokemons();
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchPokemons();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     await supabase.from('profiles').delete().eq('id', id);
//     setUsers(users => users.filter(u => u.id !== id));
//   };

//   const handleBan = async (id: string) => {
//     const bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
//     await supabase.from('profiles').update({ banned_until: bannedUntil }).eq('id', id);
//     setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: bannedUntil } : u)));
//   };

//   const handleUnban = async (id: string) => {
//     await supabase.from('profiles').update({ banned_until: null }).eq('id', id);
//     setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: null } : u)));
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-blue-300 mt-8 p-8">
//       <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
//         <span className="mr-2">⚡</span>
//         Admin Panel
//       </h3>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">👥 Total Users</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : userCount}</p>
//         </div>
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">📚 In Library</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : libraryCount}</p>
//         </div>
//         <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
//           <h4 className="text-base text-blue-600 font-medium mb-1">⭐ Favorites</h4>
//           <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : favoritesCount}</p>
//         </div>
//       </div>

//       {/* Users */}
//       <h4 className="text-lg font-semibold text-blue-700 mb-2">👤 Users</h4>
//       <div className="overflow-x-auto mb-8">
//         {loading ? (
//           <div>Loading users...</div>
//         ) : (
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-3 text-left">Name</th>
//                 <th className="py-2 px-3 text-left">Username</th>
//                 <th className="py-2 px-3 text-left">Email</th>
//                 <th className="py-2 px-3 text-left">Bio</th>
//                 <th className="py-2 px-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(u => (
//                 <tr key={u.id} className="border-b">
//                   <td className="py-2 px-3">{u.full_name}</td>
//                   <td className="py-2 px-3">{u.username}</td>
//                   <td className="py-2 px-3">{u.email}</td>
//                   <td className="py-2 px-3">{u.bio}</td>
//                   <td className="py-2 px-3 flex gap-2">
//                     <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(u.id)}><Trash2 size={18} /></button>
//                     {u.banned_until ? (
//                       <button className="text-blue-600 hover:text-blue-800" onClick={() => handleUnban(u.id)}>Unban</button>
//                     ) : (
//                       <button className="text-yellow-600 hover:text-yellow-800" onClick={() => handleBan(u.id)}><Ban size={18} /></button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pokemons */}
//       <h4 className="text-lg font-semibold text-blue-700 mb-2">🧩 Pokemons</h4>
//       <div className="space-y-4">
//         <div className="flex gap-2 items-center">
//           <input type="text" placeholder="Name" value={newPokemon.name} onChange={e => setNewPokemon(p => ({ ...p, name: e.target.value }))} className="border p-2 rounded" />
//           <input type="text" placeholder="Image URL" value={newPokemon.image} onChange={e => setNewPokemon(p => ({ ...p, image: e.target.value }))} className="border p-2 rounded" />
//           <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddPokemon}>Add</button>
//         </div>

//         <table className="min-w-full text-sm border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-3 text-left">Name</th>
//               <th className="py-2 px-3 text-left">Image</th>
//               <th className="py-2 px-3 text-left">Status</th>
//               <th className="py-2 px-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pokemons.map(p => (
//               <tr key={p.id} className="border-b">
//                 <td className="py-2 px-3">{p.pokemon_name}</td>
//                 <td className="py-2 px-3"><img src={p.pokemon_image} alt={p.pokemon_name} className="h-8" /></td>
//                 <td className="py-2 px-3">{p.hidden ? '⛔ Hidden' : '✅ Visible'}</td>
//                 <td className="py-2 px-3 flex gap-2">
//                   <button className="text-red-600 hover:text-red-800" onClick={() => handleDeletePokemon(p.id)}><Trash2 size={18} /></button>
//                   <button className="text-blue-600 hover:text-blue-800" onClick={() => toggleVisibility(p.id, p.hidden)}>
//                     {p.hidden ? 'Show' : 'Hide'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;


import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Ban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';

type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  bio?: string;
  is_public?: boolean;
  banned_until?: string | null;
  role: string;
};

type AdminPokemon = {
  id: string;
  pokemon_name: string;
  pokemon_image: string;
  hidden: boolean;
};

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    userCount,
    libraryCount,
    favoritesCount,
    loading: statsLoading
  } = useUserStats();

  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState<AdminPokemon[]>([]);
  const [newPokemon, setNewPokemon] = useState({ name: '', image: '' });
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);

  // 🛠 moved fetch functions above useEffect
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, email, bio, role, banned_until');
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const fetchPokemons = async () => {
    const { data, error } = await supabase.from('admin_pokemon').select('*');
    if (!error && data) setPokemons(data);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;

      const { data: roleData, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        return;
      }

      setRole(roleData?.role ?? null);
      setIsRoleLoaded(true);

      if (roleData?.role === 'admin') {
        fetchUsers();
        fetchPokemons();
      }
    };

    fetchInitialData();
  }, [user]);

  if (!user || !isRoleLoaded) return null;

  if (role !== 'admin') {
    return (
      <div className="text-center mt-20 text-blue-800 font-semibold">
        ⛔ You don't have permission to access the admin panel.
      </div>
    );
  }

  const handleDeletePokemon = async (id: string) => {
    await supabase.from('admin_pokemon').delete().eq('id', id);
    fetchPokemons();
  };

  const toggleVisibility = async (id: string, hidden: boolean) => {
    await supabase.from('admin_pokemon').update({ hidden: !hidden }).eq('id', id);
    fetchPokemons();
  };

  const handleAddPokemon = async () => {
    if (!newPokemon.name || !newPokemon.image) return;
    await supabase.from('admin_pokemon').insert({
      pokemon_name: newPokemon.name,
      pokemon_image: newPokemon.image,
      hidden: false
    });
    setNewPokemon({ name: '', image: '' });
    fetchPokemons();
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    setUsers(users => users.filter(u => u.id !== id));
  };

  const handleBanUser = async (id: string) => {
    const bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('profiles').update({ banned_until: bannedUntil }).eq('id', id);
    setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: bannedUntil } : u)));
  };

  const handleUnbanUser = async (id: string) => {
    await supabase.from('profiles').update({ banned_until: null }).eq('id', id);
    setUsers(users => users.map(u => (u.id === id ? { ...u, banned_until: null } : u)));
  };

  const updateUserRole = async (id: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-300 mt-8 p-8">
      <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
        <span className="mr-2">⚡</span>
        Admin Panel
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
          <h4 className="text-base text-blue-600 font-medium mb-1">👥 Total Users</h4>
          <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : userCount}</p>
        </div>
        <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
          <h4 className="text-base text-blue-600 font-medium mb-1">📚 Library Items</h4>
          <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : libraryCount}</p>
        </div>
        <div className="p-5 rounded-2xl shadow-md bg-white border border-blue-200">
          <h4 className="text-base text-blue-600 font-medium mb-1">⭐ Favorites</h4>
          <p className="text-3xl font-bold text-blue-800">{statsLoading ? '...' : favoritesCount}</p>
        </div>
      </div>

      {/* Users */}
      <h4 className="text-lg font-semibold text-blue-700 mb-2">👤 Users</h4>
      <div className="overflow-x-auto mb-8">
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
                <th className="py-2 px-3 text-left">Role</th>
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
                  <td className="py-2 px-3">{u.role}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(u.id)}><Trash2 size={18} /></button>
                    {u.banned_until ? (
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => handleUnbanUser(u.id)}>Unban</button>
                    ) : (
                      <button className="text-yellow-600 hover:text-yellow-800" onClick={() => handleBanUser(u.id)}><Ban size={18} /></button>
                    )}
                    <button className="text-purple-600 hover:text-purple-800" onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}>
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pokémons */}
      <h4 className="text-lg font-semibold text-blue-700 mb-2">🧩 Pokémons</h4>
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="Name" value={newPokemon.name} onChange={e => setNewPokemon(p => ({ ...p, name: e.target.value }))} className="border p-2 rounded" />
          <input type="text" placeholder="Image URL" value={newPokemon.image} onChange={e => setNewPokemon(p => ({ ...p, image: e.target.value }))} className="border p-2 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddPokemon}>Add</button>
        </div>

        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Image</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pokemons.map(p => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-3">{p.pokemon_name}</td>
                <td className="py-2 px-3"><img src={p.pokemon_image} alt={p.pokemon_name} className="h-8" /></td>
                <td className="py-2 px-3">{p.hidden ? '⛔ Hidden' : '✅ Visible'}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDeletePokemon(p.id)}><Trash2 size={18} /></button>
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => toggleVisibility(p.id, p.hidden)}>
                    {p.hidden ? 'Show' : 'Hide'}
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

export default AdminPanel;
