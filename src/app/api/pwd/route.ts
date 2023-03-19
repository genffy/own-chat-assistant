export async function POST(request: Request) {
  const { pwd } = await request.json();
  const isOk = pwd === process.env.PWD;
  return new Response(JSON.stringify({ ok: isOk }));
}
