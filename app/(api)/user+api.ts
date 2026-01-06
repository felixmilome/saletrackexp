import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
     );`;

    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { userId, name, email } = await request.json();

    if (!userId) {
      return Response.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users
      SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email)
      WHERE id = ${userId}
      RETURNING *;
    `;

    return Response.json({ data: result[0] });

  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

