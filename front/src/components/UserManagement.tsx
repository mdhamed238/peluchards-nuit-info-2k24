import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../store/AuthContext";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../constants/api";

interface User {
  id: number;
  username: string;
  editor: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Protect the route
  useEffect(() => {
    if (!currentUser?.editor) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.editor) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleEditorToggle = async (
    userId: number,
    newEditorStatus: boolean
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/user/update-editor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          editor: newEditorStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, editor: newEditorStatus } : user
        )
      );
    } catch (err) {
      setError("Failed to update user privileges");
    }
  };

  if (!currentUser?.editor) {
    return null;
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            {users.map((user) => (
              <div
                key={user.id}
                className='flex items-center justify-between p-4 border rounded-lg bg-white'
              >
                <div>
                  <h3 className='font-medium'>{user.username}</h3>
                  <p className='text-sm text-gray-500'>ID: {user.id}</p>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Editor</span>
                  <Switch
                    checked={user.editor}
                    onCheckedChange={(checked) =>
                      handleEditorToggle(user.id, checked)
                    }
                    disabled={user.id === currentUser.id}
                  />
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className='text-center text-gray-500'>No users found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
