'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Emoji } from 'react-apple-emojis';

interface User {
  _id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  solvedCount: number;
  banned: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [xpAdjustment, setXpAdjustment] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const url = `/api/admin/users${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleResetStreak = async (userId: string) => {
    if (!confirm('Reset this user\'s streak to 0?')) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${userId}/streak`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: 0 }),
      });

      if (!res.ok) throw new Error('Failed to reset streak');
      fetchUsers();
      setSelectedUser(null);
    } catch (error: any) {
      alert(error.message || 'Failed to reset streak');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjustXP = async (userId: string) => {
    if (!xpAdjustment) {
      alert('Please enter an XP adjustment amount');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${userId}/xp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment: xpAdjustment }),
      });

      if (!res.ok) throw new Error('Failed to adjust XP');
      fetchUsers();
      setSelectedUser(null);
      setXpAdjustment(0);
    } catch (error: any) {
      alert(error.message || 'Failed to adjust XP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanToggle = async (userId: string, currentlyBanned: boolean) => {
    const action = currentlyBanned ? 'unban' : 'ban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: !currentlyBanned }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} user`);
      fetchUsers();
      setSelectedUser(null);
    } catch (error: any) {
      alert(error.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Gold':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Silver':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'Bronze':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      default:
        return 'bg-foreground/10 text-foreground border-foreground/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/70">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-foreground/70">Manage platform users</p>
      </div>

      {/* Search */}
      <Card className="border-2 border-foreground/10">
        <CardContent className="pt-6">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-2 border-foreground/10">
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center py-8 text-foreground/70">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 border-2 border-foreground/10 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <Badge className={getRankColor(user.rank)}>{user.rank}</Badge>
                      {user.banned && (
                        <Badge className="bg-red-500/10 text-red-700 border-red-500/20">Banned</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/70">
                      <span>{user.email}</span>
                      <span>XP: {user.xp}</span>
                      <span>Streak: {user.streak} days</span>
                      <span>Solved: {user.solvedCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Emoji name="gear" className="w-4 h-4 mr-1" />
                      Actions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="border-2 border-foreground/10 w-full max-w-md">
            <CardHeader>
              <CardTitle>User Actions: {selectedUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Reset Streak</h4>
                <Button
                  variant="outline"
                  onClick={() => handleResetStreak(selectedUser._id)}
                  disabled={actionLoading}
                  className="w-full"
                >
                  Reset Streak to 0
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Adjust XP</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="XP adjustment (+/-)"
                    value={xpAdjustment || ''}
                    onChange={(e) => setXpAdjustment(parseInt(e.target.value) || 0)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleAdjustXP(selectedUser._id)}
                    disabled={actionLoading || !xpAdjustment}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Ban/Unban</h4>
                <Button
                  variant="outline"
                  onClick={() => handleBanToggle(selectedUser._id, selectedUser.banned)}
                  disabled={actionLoading}
                  className={`w-full ${selectedUser.banned ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                >
                  {selectedUser.banned ? 'Unban User' : 'Ban User'}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedUser(null);
                  setXpAdjustment(0);
                }}
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

