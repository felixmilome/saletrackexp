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
    console.log({user});

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


// export async function GET(request: Request) {
//   try {
//     const sql = neon(`${process.env.DATABASE_URL}`);

//     const url = new URL(request.url);
//     const email = url.searchParams.get("email");

//     if (!email) {
//       return Response.json(
//         { error: "Email query parameter is required" },
//         { status: 400 }
//       );
//     }

//     // 1. Get user
//     const users = await sql`
//       SELECT * FROM users WHERE email = ${email};
//     `;

//     if (users.length === 0) {
//       return Response.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     const userObj = users[0];

//     // 2. Get driver using user.id
//     const drivers = await sql`
//       SELECT * FROM drivers WHERE user_id = ${userObj.id};
//     `;

//     const driverObj = drivers.length > 0 ? drivers[0] : null;

//    const profileObj = 
//    {
//       name: userObj?.name,
//       email: userObj?.email,
//       clerkId: userObj?.clerk_id,
//       user_id: userObj?.id,
//       driver_id: driverObj?.id,
//       vehicle_type: driverObj?.vehicle_type,
//       profile_image_slug: userObj?.profile_image_slug,
//       id_image_slug: driverObj?.id_image_slug,
//       account: 'client',
//       phone: null,
//       conduct_image_slug: driverObj?.good_image_slug
//    }

  

//     // 3. Return both
//     return Response.json(profileObj);

//   } catch (error) {
//     console.error("Error fetching user & driver:", error);
//     return Response.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




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


// export async function PATCH(request: Request) {
//   try {
//     const sql = neon(process.env.DATABASE_URL!);
//     const { user_id, name, email } = await request.json();

//     if (!user_id) {
//       return Response.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     const result = await sql`
//       UPDATE users
//       SET
//         name = COALESCE(${name}, name),
//         email = COALESCE(${email}, email)
//       WHERE user_id = ${user_id}
//       RETURNING *;
//     `;

//     return Response.json({ data: result[0] });

//   } catch (error) {
//     console.error("Error updating user:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// Patch
// const COLUMN_MAP: Record<string, string> = {
//   firstName: "first_name",
//   lastName: "last_name",
//   profileImageUrl: "profile_image_url",
//   carImageUrl: "car_image_url",
//   carSeats: "car_seats",
//   nationalIdNumber: "national_id_number",
//   nationalIdLink: "national_id_link",
//   goodConductLink: "good_conduct_link",
//   verified: "verified",
// };

export async function PATCH(request: Request) {

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const { user_id, key, value } = body;

    console.log(body);

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

    console.log(existingUser)

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

