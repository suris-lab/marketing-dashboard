import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    facebook: Boolean(process.env.FB_ACCESS_TOKEN),
    instagram: Boolean(process.env.IG_ACCESS_TOKEN),
    linkedin: Boolean(process.env.LINKEDIN_ACCESS_TOKEN),
    edm: Boolean(process.env.MAILCHIMP_API_KEY),
    website: Boolean(
      process.env.GA4_PROPERTY_ID_HHYC ||
      process.env.GA4_PROPERTY_ID_24HOUR ||
      process.env.GA4_PROPERTY_ID_STC
    ),
  });
}
