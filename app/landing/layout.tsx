import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SharpR – Track. Analyze. Win.",
  description: "The ultimate betting tracker for serious bettors.",
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
