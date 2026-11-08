"use client";

import React, { useState } from "react";
import { FileCode2, Copy, Check, Sliders, Box, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const ConfigGenerator: React.FC = () => {
  const [generatorType, setGeneratorType] = useState<"gitlab" | "compose">("gitlab");
  const [copied, setCopied] = useState(false);

  // GitLab CI Options
  const [ciRuntime, setCiRuntime] = useState<"node" | "python" | "java">("node");
  const [ciEnableCache, setCiEnableCache] = useState(true);
  const [ciEnableStaging, setCiEnableStaging] = useState(true);
  const [ciManualProd, setCiManualProd] = useState(true);
  const [ciNotifySlack, setCiNotifySlack] = useState(true);

  // Docker Compose Options
  const [composeDb, setComposeDb] = useState<"postgres" | "mysql" | "mongo" | "none">("postgres");
  const [composeCache, setComposeCache] = useState(true);
  const [composeWebPort, setComposeWebPort] = useState("3000");
  const [composeUseNetwork, setComposeUseNetwork] = useState(true);

  // Generate GitLab CI YAML
  const generateGitlabYaml = () => {
    const runtimeImages = {
      node: "node:20-alpine",
      python: "python:3.11-slim",
      java: "eclipse-temurin:17-jdk-alpine",
    };

    const cachePaths = {
      node: "node_modules/",
      python: ".cache/pip",
      java: ".m2/repository/",
    };

    let yaml = `# Pipeline générée pour ${ciRuntime.toUpperCase()}
image: ${runtimeImages[ciRuntime]}

stages:
  - build
  - test
${ciNotifySlack ? "  - notify\n" : ""}${ciEnableStaging || ciManualProd ? "  - deploy\n" : ""}`;

    if (ciEnableCache) {
      yaml += `
# Cache des dépendances entre exécutions de pipeline (Slide S167)
cache:
  key: "\${CI_COMMIT_REF_SLUG}"
  paths:
    - ${cachePaths[ciRuntime]}
`;
    }

    yaml += `
job_build:
  stage: build
  script:
    - echo "=== Compilation & Résolution des dépendances ==="
    ${ciRuntime === "node" ? "- npm ci\n    - npm run build" : ciRuntime === "python" ? "- pip install -r requirements.txt" : "- ./mvnw clean compile"}
  artifacts:
    expire_in: 3 days
    paths:
      - ${ciRuntime === "node" ? "dist/" : ciRuntime === "python" ? "src/" : "target/*.jar"}

job_test:
  stage: test
  script:
    - echo "=== Exécution de la suite de tests automatisés ==="
    ${ciRuntime === "node" ? "- npm test" : ciRuntime === "python" ? "- pytest --maxfail=1" : "- ./mvnw test"}
  dependencies:
    - job_build
`;

    if (ciNotifySlack) {
      yaml += `
job_notify:
  stage: notify
  script:
    - echo "Notification sur Merge Request réussie !"
    - curl -X POST -H 'Content-type: application/json' --data '{"text":"Pipeline CI validée pour MR !"}' $WEBHOOK_URL
  only:
    - merge_requests
`;
    }

    if (ciEnableStaging) {
      yaml += `
deploy_staging:
  stage: deploy
  script:
    - echo "Déploiement automatique sur l'instance de recette..."
    - ./scripts/deploy-staging.sh
  only:
    - develop
`;
    }

    if (ciManualProd) {
      yaml += `
deploy_production:
  stage: deploy
  script:
    - echo "Déploiement sous haute sécurité en production..."
    - ./scripts/deploy-production.sh
  only:
    - main
  when: manual # Validation humaine requise (Continuous Delivery)
`;
    }

    return yaml;
  };

  // Generate Docker Compose YAML
  const generateComposeYaml = () => {
    let yaml = `version: '3.8'

services:
  web-api:
    build: .
    container_name: devops_web_api
    ports:
      - "${composeWebPort}:${composeWebPort}"
    environment:
      - PORT=${composeWebPort}`;

    if (composeDb === "postgres") {
      yaml += `
      - DB_HOST=database # Service discovery DNS automatique (Slide S214)
      - DB_USER=devops
      - DB_PASS=secret123
      - DB_NAME=app_db`;
    } else if (composeDb === "mysql") {
      yaml += `
      - DB_HOST=database
      - DB_USER=devops
      - DB_PASS=secret123`;
    }

    if (composeCache) {
      yaml += `
      - REDIS_HOST=cache`;
    }

    yaml += `
    depends_on:`;
    if (composeDb !== "none") yaml += `\n      - database`;
    if (composeCache) yaml += `\n      - cache`;

    if (composeUseNetwork) {
      yaml += `
    networks:
      - lab-network`;
    }

    if (composeDb === "postgres") {
      yaml += `

  database:
    image: postgres:16-alpine
    container_name: devops_postgres
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: devops
      POSTGRES_PASSWORD: secret123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ${composeUseNetwork ? "networks:\n      - lab-network" : ""}`;
    }

    if (composeCache) {
      yaml += `

  cache:
    image: redis:7-alpine
    container_name: devops_redis
    restart: always
    ${composeUseNetwork ? "networks:\n      - lab-network" : ""}`;
    }

    if (composeDb === "postgres") {
      yaml += `

volumes:
  postgres_data:
    driver: local`;
    }

    if (composeUseNetwork) {
      yaml += `

networks:
  lab-network:
    driver: bridge`;
    }

    return yaml;
  };

  const yamlContent = generatorType === "gitlab" ? generateGitlabYaml() : generateComposeYaml();

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-[#121624] to-zinc-900/90 backdrop-blur-xl shadow-subtle-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cyan">Générateur DevOps</Badge>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-400">Export YAML Prêt pour la Production</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Générateur Visuel de Configurations (.gitlab-ci &amp; docker-compose)
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Configurez vos services, dépendances et étapes de build via une interface visuelle et obtenez un fichier YAML conforme aux meilleures pratiques du cours.
            </p>
          </div>

          <div className="flex gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              onClick={() => setGeneratorType("gitlab")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                generatorType === "gitlab"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              .gitlab-ci.yml
            </button>
            <button
              onClick={() => setGeneratorType("compose")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                generatorType === "compose"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              docker-compose.yml
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Live YAML Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-zinc-800 bg-[#0F121C]/90 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Paramètres de Configuration
            </h3>
          </div>

          {generatorType === "gitlab" ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1.5 font-semibold">Environnement &amp; Runtime :</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["node", "python", "java"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setCiRuntime(r)}
                      className={`p-2 rounded-lg border text-center font-mono capitalize transition-all ${
                        ciRuntime === r
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={ciEnableCache}
                    onChange={(e) => setCiEnableCache(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Activer le cache des dépendances (Slide S167)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={ciEnableStaging}
                    onChange={(e) => setCiEnableStaging(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Déploiement auto en Recette (branche develop)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={ciManualProd}
                    onChange={(e) => setCiManualProd(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Déploiement Production manuel (Continuous Delivery)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={ciNotifySlack}
                    onChange={(e) => setCiNotifySlack(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Notifications Webhook sur Merge Request (Slide S163)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1.5 font-semibold">Base de Données Dédiée :</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["postgres", "mysql", "none"] as const).map((db) => (
                    <button
                      key={db}
                      onClick={() => setComposeDb(db)}
                      className={`p-2 rounded-lg border text-center font-mono capitalize transition-all ${
                        composeDb === db
                          ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {db === "none" ? "Aucune" : db}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Port Hôte &amp; Conteneur :</label>
                <input
                  type="text"
                  value={composeWebPort}
                  onChange={(e) => setComposeWebPort(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={composeCache}
                    onChange={(e) => setComposeCache(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
                  />
                  <span>Ajouter un conteneur Cache Redis 7</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={composeUseNetwork}
                    onChange={(e) => setComposeUseNetwork(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
                  />
                  <span>Réseau Bridge avec Service Discovery DNS interne</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Live YAML Preview (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-black/90 backdrop-blur-xl overflow-hidden flex flex-col font-mono text-xs shadow-subtle-card">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400">
            <span className="font-bold text-zinc-300">
              {generatorType === "gitlab" ? ".gitlab-ci.yml" : "docker-compose.yml"}
            </span>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? "Copié !" : "Copier le code"}
            </Button>
          </div>

          <pre className="p-4 flex-1 overflow-x-auto text-zinc-200 leading-relaxed text-[11px]">
            {yamlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
