import { neon } from "@neondatabase/serverless";


// export async function GET(request: Request) {
//   try {
//     const sql = neon(`${process.env.DATABASE_URL}`);

//     // Extract email from query parameters
//     const url = new URL(request.url);
//     const email = url.searchParams.get("email");

//     if (!email) {
//       return Response.json(
//         { error: "Email query parameter is required" },
//         { status: 400 }
//       );
//     }

//     const user = await sql`
//       SELECT * FROM users WHERE email = ${email};
//     `;

//     if (user.length === 0) {
//       return Response.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     return Response.json({ data: user[0] });

//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return Response.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // 1. Get user
    const users = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (users.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userObj = users[0];

    // 2. Get driver using user.id
    const drivers = await sql`
      SELECT * FROM drivers WHERE user_id = ${userObj.id};
    `;

    const driverObj = drivers.length > 0 ? drivers[0] : null;

   const profileObj = 
   {
      name: userObj?.name,
      email: userObj?.email,
      clerkId: userObj?.clerkId,
      userId: userObj?.id,
      driverId: driverObj?.id,
      car_seats: driverObj?.car_seats,
      profileImage: userObj?.profileImage,
      idImage: driverObj?.idImage,
      account: 'client',
      conductImage: driverObj?.goodConduct
   }

  

    // 3. Return both
    return Response.json(profileObj);

  } catch (error) {
    console.error("Error fetching user & driver:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}




export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    console.log({request});
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

     console.log({response});

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

