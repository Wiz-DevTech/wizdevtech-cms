import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { authRateLimit } from "@/lib/rate-limit"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["author", "editor", "viewer"]).default("author"),
})

export async function POST(request: NextRequest) {
  return authRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Get the role
    const userRole = await db.role.findUnique({
      where: { name: validatedData.role }
    })

    if (!userRole) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        roleId: userRole.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
            description: true,
          }
        },
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: "User created successfully"
    })
  } catch (error) {
    console.error("Registration error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
  })
}