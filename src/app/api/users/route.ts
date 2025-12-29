import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock user data - in real app, this would come from database
let users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@wizdevtech.com",
    role: "admin",
    avatar: "/api/placeholder/avatar-1.jpg",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date("2024-01-20"),
    status: "active",
    permissions: ["content:read", "content:write", "users:read", "analytics:read", "settings:read"]
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@wizdevtech.com",
    role: "editor",
    avatar: "/api/placeholder/avatar-2.jpg",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date("2024-01-19"),
    status: "active",
    permissions: ["content:read", "content:write", "analytics:read"]
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@wizdevtech.com",
    role: "viewer",
    avatar: "/api/placeholder/avatar-3.jpg",
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date("2024-01-18"),
    status: "active",
    permissions: ["content:read"]
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@wizdevtech.com",
    role: "editor",
    avatar: "/api/placeholder/avatar-4.jpg",
    createdAt: new Date("2024-01-12"),
    lastLogin: new Date("2024-01-15"),
    status: "inactive",
    permissions: ["content:read", "content:write"]
  }
];

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
  permissions: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive"]).default("active")
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).optional()
});

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredUsers = users;

    // Apply filters
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const newUser = {
      id: Date.now().toString(),
      ...validatedData,
      avatar: "/api/placeholder/default-avatar.jpg",
      createdAt: new Date(),
      lastLogin: null,
      permissions: getDefaultPermissions(validatedData.role)
    };

    users.push(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateUserSchema.parse(updateData);
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    users[userIndex] = {
      ...users[userIndex],
      ...validatedData
    };

    return NextResponse.json({
      success: true,
      data: users[userIndex],
      message: "User updated successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// Helper function to get default permissions based on role
function getDefaultPermissions(role: string): string[] {
  const permissionMap = {
    admin: ["content:read", "content:write", "content:delete", "users:read", "users:write", "users:delete", "analytics:read", "settings:read", "settings:write"],
    editor: ["content:read", "content:write", "analytics:read"],
    viewer: ["content:read"]
  };
  
  return permissionMap[role as keyof typeof permissionMap] || [];
}