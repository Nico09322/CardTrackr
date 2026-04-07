export default defineEventHandler(async () => {
    const url = process.env.SUPABASE_URL
    await fetch(`${url}/rest/v1/`)
    return { ok: true }
})