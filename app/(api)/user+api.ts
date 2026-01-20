import { neon } from "@neondatabase/serverless";


export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Extract email from query parameters
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const user = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;


    if (user.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ data: user[0] });

  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



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
    const body = await request.json();

    const { user_id, key, value } = body;

    if (!user_id || !key) {
      return Response.json(
        { error: "userId and key are required" },
        { status: 400 }
      );
    }

    const safeColumn = key;
    if (!safeColumn) {
      return Response.json(
        { error: "Invalid field key" },
        { status: 400 }
      );
    }

    // Check if driver exists
    const existingUser = await sql`
      SELECT * FROM users WHERE user_id = ${user_id};
    `;



    let result;
    if (existingUser.length === 0) {
    
      result = await sql`
        INSERT INTO users (user_id, ${sql.unsafe(safeColumn)})
        VALUES (${user_id}, ${value})
        RETURNING *;
      `;
    } else {
      // Update existing driver
      result = await sql`
        UPDATE users
        SET ${sql.unsafe(safeColumn)} = ${value}
        WHERE user_id = ${user_id}
        RETURNING *;
      `;
    }

    return Response.json({ data: result[0] });
  } catch (error) {
    console.error("Error updating driver:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

