import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface DataGroup {
  name: string;
  urls: string[];
  cacheConfig: {
    strategy: "freshness" | "performance";
    maxSize: number;
    maxAge: string;
    timeout?: string;
  };
}

interface NgswConfig {
  assetGroups: Array<{
    name: string;
    installMode: "prefetch" | "lazy";
    updateMode?: "prefetch" | "lazy";
    resources: { files: string[] };
  }>;
  dataGroups?: DataGroup[];
}

interface CompiledNgswJson {
  dataGroups: Array<{
    name: string;
    patterns: string[];
    strategy: string;
    maxSize: number;
    maxAge: number;
    timeoutMs?: number;
  }>;
}

const config = JSON.parse(
  readFileSync(join(__dirname, "../../ngsw-config.json"), "utf8"),
) as NgswConfig;

function patternMatches(pattern: string, url: string): boolean {
  // Glob con "*" sin RegExp dinamica (evita ReDoS y el hallazgo de semgrep).
  const partes = pattern.split("*");
  if (partes.length === 1) return pattern === url;
  const primero = partes.shift() ?? "";
  const ultimo = partes.pop() ?? "";
  const fin = url.length - ultimo.length;
  if (!url.startsWith(primero) || fin < primero.length || !url.endsWith(ultimo)) return false;
  let pos = primero.length;
  for (const parte of partes) {
    const i = url.indexOf(parte, pos);
    if (i < 0 || i + parte.length > fin) return false;
    pos = i + parte.length;
  }
  return true;
}

describe("ngsw-config", () => {
  it("precarga solo los recursos esenciales del shell y deja los medios lazy", () => {
    const shell = config.assetGroups.find((group) => group.name === "shell");
    const media = config.assetGroups.find((group) => group.name === "assets");

    expect(shell).toBeDefined();
    expect(shell?.installMode).toBe("prefetch");
    expect(shell?.resources.files).toEqual(
      expect.arrayContaining(["/*.js", "/*.css", "/index.html"]),
    );
    expect(media?.installMode).toBe("lazy");

    const tieneMediosEnShell = shell?.resources.files.some((f) =>
      /\.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)$/i.test(f),
    );
    expect(tieneMediosEnShell).toBe(false);
  });

  it("coloca primero las reglas de API y evita patrones comodin amplios", () => {
    const groups = config.dataGroups ?? [];

    expect(groups.map((group) => group.name)).toEqual(["health-check"]);
    expect(groups[0].urls).toEqual(["/health"]);
    expect(groups[0].cacheConfig).toEqual({
      strategy: "freshness",
      maxSize: 1,
      maxAge: "1m",
      timeout: "3s",
    });
    expect(
      groups.every((group) => !group.urls.some((url) => url.includes("*") || url.includes("/api/"))),
    ).toBe(true);
  });

  it("verifica que la regla /health coincida con la URL accesible y no use prefijos ficticios", () => {
    const healthGroup = config.dataGroups?.find((g) => g.name === "health-check");
    expect(healthGroup).toBeDefined();
    expect(healthGroup?.urls).toContain("/health");

    const urlPattern = healthGroup?.urls[0] ?? "";
    expect(patternMatches(urlPattern, "/health")).toBe(true);
    expect(urlPattern.startsWith("/api")).toBe(false);
  });

  it("no coincide con endpoints privados de ningun slice ni rutas no verificadas", () => {
    const patterns = (config.dataGroups ?? []).flatMap((group) => group.urls);
    const endpointsPrivados = [
      // Slice I1
      "/auth/login",
      "/me",
      "/admin/usuarios",
      // Slice I2
      "/turnos",
      "/indicadores/panel",
      // Slice I3
      "/ubicacion",
      "/cronotipo",
      "/planes",
      // Slice I4
      "/cafeina",
      "/push/suscripcion",
      "/notificaciones",
      // Slice I5
      "/sync/lote",
      "/diario",
      "/aptitud",
      "/turnos/123/confirmacion",
      "/historial/me",
    ];
    const catalogosNoVerificados = [
      "/bebidas",
      "/rutas",
      "/api/bebidas",
      "/api/rutas",
    ];

    for (const url of [...endpointsPrivados, ...catalogosNoVerificados]) {
      expect(patterns.some((pattern) => patternMatches(pattern, url))).toBe(false);
    }
  });

  it("valida la estructura compilada en ngsw.json si el build de produccion existe", () => {
    const distNgswPath = join(__dirname, "../../../../dist/apps/pwa/browser/ngsw.json");
    if (!existsSync(distNgswPath)) {
      return;
    }

    const compiled = JSON.parse(readFileSync(distNgswPath, "utf8")) as CompiledNgswJson;
    expect(compiled.dataGroups).toBeDefined();
    expect(compiled.dataGroups.length).toBe(1);
    expect(compiled.dataGroups[0].name).toBe("health-check");
    expect(compiled.dataGroups[0].strategy).toBe("freshness");

    const healthRegex = new RegExp(compiled.dataGroups[0].patterns[0]);
    expect(healthRegex.test("http://localhost:3000/health")).toBe(true);
    expect(healthRegex.test("https://transporte-cueva.pe/health")).toBe(true);
    expect(healthRegex.test("https://transporte-cueva.pe/me")).toBe(false);
    expect(healthRegex.test("https://transporte-cueva.pe/turnos")).toBe(false);
    expect(healthRegex.test("https://transporte-cueva.pe/bebidas")).toBe(false);
    expect(healthRegex.test("https://transporte-cueva.pe/rutas")).toBe(false);
  });
});
