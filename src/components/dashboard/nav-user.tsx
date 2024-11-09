import { auth } from "@/auth";

export async function NavUser() {
  const session = await auth();

  if (!session?.user) return null;

  return {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  };
}
