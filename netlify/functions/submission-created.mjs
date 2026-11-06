// Runs automatically on every verified Netlify form submission.
// For the "intake" form it creates or updates a HubSpot contact and opens a
// deal at "Intake received". Needs HUBSPOT_TOKEN set in Netlify env vars
// (HubSpot private app with crm.objects.contacts.write and crm.objects.deals.write).

const API = "https://api.hubapi.com";
const PIPELINE = "default";
const STAGE_INTAKE_RECEIVED = "4580942530";

async function hs(path, body, token) {
  const res = await fetch(API + path, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HubSpot ${path} ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

const clean = (v) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : "");

export const handler = async (event) => {
  const token = process.env.HUBSPOT_TOKEN;
  const { payload } = JSON.parse(event.body || "{}");
  if (!payload || payload.form_name !== "intake") return { statusCode: 200, body: "skip" };
  if (!token) {
    console.warn("HUBSPOT_TOKEN not set; intake not sent to HubSpot");
    return { statusCode: 200, body: "no token" };
  }

  const d = payload.data || {};
  const email = clean(d.contact_email).toLowerCase();
  if (!email) return { statusCode: 200, body: "no email" };

  const [firstname, ...rest] = clean(d.contact_name).split(/\s+/);
  const business = clean(d.business_name) || clean(d.legal_name) || email;

  try {
    const up = await hs(
      "/crm/v3/objects/contacts/batch/upsert",
      {
        inputs: [
          {
            idProperty: "email",
            id: email,
            properties: {
              email,
              firstname: firstname || "",
              lastname: rest.join(" "),
              phone: clean(d.contact_phone),
              jobtitle: clean(d.contact_role),
              company: business,
              website: clean(d.current_site),
              lifecyclestage: "lead",
            },
          },
        ],
      },
      token
    );
    const contactId = up.results?.[0]?.id;

    const lines = [
      ["What they do", d.what_you_do],
      ["Goal", d.goal],
      ["Pages", d.pages],
      ["Budget", d.budget],
      ["Launch date", d.launch_date],
      ["Why that date", d.deadline_reason],
      ["Current site", d.current_site],
      ["Current host", d.current_host],
      ["Domains", d.domains],
      ["Sites they like", d.sites_liked],
      ["Sites they dislike", d.sites_disliked],
      ["Files", d.files_link],
      ["Notes", d.notes],
    ]
      .map(([k, v]) => [k, clean(v)])
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    await hs(
      "/crm/v3/objects/deals",
      {
        properties: {
          dealname: `${business} website`,
          pipeline: PIPELINE,
          dealstage: STAGE_INTAKE_RECEIVED,
          description: lines.slice(0, 60000),
        },
        associations: contactId
          ? [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] }]
          : [],
      },
      token
    );
    return { statusCode: 200, body: "ok" };
  } catch (err) {
    // Never fail the submission; Netlify still stores it and emails the notification.
    console.error(err.message);
    return { statusCode: 200, body: "hubspot error" };
  }
};
