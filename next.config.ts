import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We maintain CLAUDE.md by hand as the project's source of truth — don't
  // let `next dev` append its generated agent-rules block into it.
  agentRules: false,
};

export default nextConfig;
