import { neon } from "@neondatabase/serverless";
import mockdrivers from "lib/mockdrivers.js";
export async function GET(request: Request) {
  try {
    // const sql = neon(`${process.env.DATABASE_URL}`);
    // const response = await sql`SELECT * FROM drivers`;
    const response = mockdrivers;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const {
      userId,
      firstName,
      lastName,
      profileImageUrl,
      carImageUrl,
      carSeats,
      nationalIdNumber,
      nationalIdLink,
      goodConductLink,
    } = body;

    if (!userId || !firstName || !lastName || carSeats === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO drivers (
        user_id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        national_id_number,
        national_id_link,
        good_conduct_link
      )
      VALUES (
        ${userId},
        ${firstName},
        ${lastName},
        ${profileImageUrl},
        ${carImageUrl},
        ${carSeats},
        ${nationalIdNumber},
        ${nationalIdLink},
        ${goodConductLink}
      )
      RETURNING *;
    `;

    return Response.json({ data: result[0] }, { status: 201 });

  } catch (error) {
    console.error("Error creating driver:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// Patch
const COLUMN_MAP: Record<string, string> = {
  firstName: "first_name",
  lastName: "last_name",
  profileImageUrl: "profile_image_url",
  carImageUrl: "car_image_url",
  carSeats: "car_seats",
  nationalIdNumber: "national_id_number",
  nationalIdLink: "national_id_link",
  goodConductLink: "good_conduct_link",
  verified: "verified",
};


export async function PATCH(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const { userId, key, value } = body;

    if (!userId || !key) {
      return Response.json(
        { error: "userId and key are required" },
        { status: 400 }
      );
    }

    const safeColumn = COLUMN_MAP[key];
    if (!safeColumn) {
      return Response.json(
        { error: "Invalid field key" },
        { status: 400 }
      );
    }

    // Check if driver exists
    const existingDriver = await sql`
      SELECT * FROM drivers WHERE user_id = ${userId};
    `;

    let result;
    if (existingDriver.length === 0) {
      // Insert new driver
      result = await sql`
        INSERT INTO drivers (user_id, ${sql.unsafe(safeColumn)})
        VALUES (${userId}, ${value})
        RETURNING *;
      `;
    } else {
      // Update existing driver
      result = await sql`
        UPDATE drivers
        SET ${sql.unsafe(safeColumn)} = ${value}
        WHERE user_id = ${userId}
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




// export async function PATCH(request: Request) {
//   try {
//     const sql = neon(process.env.DATABASE_URL!);
//     const body = await request.json();

//     const {
//       driverId,
//       firstName,
//       lastName,
//       profileImageUrl,
//       carImageUrl,
//       carSeats,
//       nationalIdNumber,
//       nationalIdLink,
//       goodConductLink,
//       verified,
//     } = body;

//     if (!driverId) {
//       return Response.json(
//         { error: "driverId is required" },
//         { status: 400 }
//       );
//     }

//     const result = await sql`
//       UPDATE drivers
//       SET
//         first_name = COALESCE(${firstName}, first_name),
//         last_name = COALESCE(${lastName}, last_name),
//         profile_image_url = COALESCE(${profileImageUrl}, profile_image_url),
//         car_image_url = COALESCE(${carImageUrl}, car_image_url),
//         car_seats = COALESCE(${carSeats}, car_seats),
//         national_id_number = COALESCE(${nationalIdNumber}, national_id_number),
//         national_id_link = COALESCE(${nationalIdLink}, national_id_link),
//         good_conduct_link = COALESCE(${goodConductLink}, good_conduct_link),
//         verified = COALESCE(${verified}, verified)
//       WHERE id = ${driverId}
//       RETURNING *;
//     `;

//     return Response.json({ data: result[0] });

//   } catch (error) {
//     console.error("Error updating driver:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


