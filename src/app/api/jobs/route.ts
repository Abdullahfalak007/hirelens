import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(req: Request) {
  try {
    const supabase = await createServerComponentClient();

    // Get the current authenticated user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) throw userErr;
    if (!user)
      return NextResponse.json(
        { data: [], message: "Unauthenticated" },
        { status: 401 },
      );

    // Find app_user row to get organization_id
    const { data: appUser, error: appUserErr } = await supabase
      .from("app_users")
      .select("organization_id")
      .eq("auth_id", user.id)
      .limit(1)
      .single();

    if (appUserErr) throw appUserErr;

    const orgId = (appUser as any)?.organization_id;

    // Fetch jobs for the organization
    const { data: jobs, error: jobsErr } = await supabase
      .from("jobs")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (jobsErr) throw jobsErr;

    return NextResponse.json({ data: jobs });
  } catch (err) {
    const errorInfo = handleApiError(err);
    return NextResponse.json(
      { message: errorInfo.message, code: errorInfo.code },
      { status: errorInfo.statusCode },
    );
  }
}
