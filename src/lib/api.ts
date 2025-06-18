// lib/api.ts
export async function fetchMenus() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/menus?limit=100`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 10 }, // ISR kalau kamu pakai Next.js App Router
  })

  if (!res.ok) {
    throw new Error("Failed to fetch menus")
  }

  const data = await res.json()
  return data.docs // karena Payload return-nya { docs, totalDocs, ... }
}
