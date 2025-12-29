// src/app/api/csrf-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { withCSRFProtection } from "@/lib/csrf";

// --- FIX: Add 'async' to the GET function ---
export async function GET(request: NextRequest) {
  return withCSRFProtection(async (request, context) => {
    // This endpoint is now protected by CSRF middleware
    // The withCSRFProtection wrapper will automatically generate and return a token for GET requests
    return NextResponse.json({
      message: "CSRF token endpoint",
      // The actual token is handled by the middleware
    });
  });
}

export async function POST(request: NextRequest) {
  return withCSRFProtection(async (request, context) => {
    try {
      const body = await request.json();
      
      // Handle POST request logic here
      // For example, validate CSRF token and process form data
      
      return NextResponse.json({
        success: true,
        message: "POST request successful",
        data: body,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withCSRFProtection(async (request, context) => {
    try {
      const body = await request.json();
      
      // Handle PUT request logic here
      // For example, update an existing resource
      
      return NextResponse.json({
        success: true,
        message: "PUT request successful",
        data: body,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withCSRFProtection(async (request, context) => {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json(
          { error: "ID parameter is required for DELETE" },
          { status: 400 }
        );
      }
      
      // Handle DELETE request logic here
      // For example, delete a resource by ID
      
      return NextResponse.json({
        success: true,
        message: `DELETE request successful for ID: ${id}`,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Error processing DELETE request" },
        { status: 500 }
      );
    }
  });
}