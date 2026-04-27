import { signOut } from "@/lib/auth";

export default async function SignOutPage() {
  await signOut({ redirectTo: "/" });
}
