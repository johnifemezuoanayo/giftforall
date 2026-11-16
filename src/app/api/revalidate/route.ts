import { revalidateTag } from "next/cache";
import { SITE_DATA_TAG } from "@/lib/api";

// The backend calls this after something is changed in the dashboard.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ message: "Not allowed" }, { status: 401 });
  }

  revalidateTag(SITE_DATA_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
