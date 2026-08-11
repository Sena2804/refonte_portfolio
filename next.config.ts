import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  /**
   * Le build recopie dans `.next/standalone` un serveur Node autonome et les
   * seuls fichiers de `node_modules` réellement utilisés à l'exécution. C'est ce
   * qui permet à l'image Docker de se passer de npm et de `node_modules`.
   * Sans effet sur `next dev`.
   */
  output: "standalone",
};

export default nextConfig;
