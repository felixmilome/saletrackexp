import { neon } from "@neondatabase/serverless";
import mockdrivers from "lib/mockdrivers";
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
