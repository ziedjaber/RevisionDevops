"use client";

import React, { useState } from "react";
import { Server, Database, Smartphone, Globe, Shield, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ArchitectureDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"monolith" | "multitier" | "soa" | "microservices">("microservices");

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Schéma Interactif</span>
          <h3 className="text-lg font-bold text-zinc-100">Évolution Architecturale (ISIMS Slides S8–S25)</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          {(["monolith", "multitier", "soa", "microservices"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                activeTab === tab
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {tab === "monolith" && "1. Monolithe"}
              {tab === "multitier" && "2. Multi-Tier (3N)"}
              {tab === "soa" && "3. SOA (Bus ESB)"}
              {tab === "microservices" && "4. Microservices (MSA)"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "monolith" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Dans le monolithe, un seul livrable volumineux (fichier WAR/JAR unique) regroupe toute la logique métier, la persistance et l&apos;interface.
          </p>
          <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
            <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-amber-500/30 text-center shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold bg-amber-500 text-zinc-950 rounded-full">
                Application Monolithique (.WAR)
              </span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/60 text-xs text-zinc-200">
                  <Globe className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  IHM Web
                </div>
                <div className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/60 text-xs text-zinc-200">
                  <Server className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  Métier & Calculs
                </div>
                <div className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/60 text-xs text-zinc-200">
                  <Database className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  Accès Données
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-700/50 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Un seul runtime JVM / Serveur Tomcat
              </div>
            </div>
            <div className="w-0.5 h-6 bg-zinc-700 my-1"></div>
            <div className="p-4 px-8 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Base de données SQL unique et centralisée
            </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            ⚠️ <strong>Points critiques :</strong> Risque de régression global, goulot d&apos;étranglement lors du scaling, déploiements lourds nécessitant des coupures de service.
          </div>
        </div>
      )}

      {activeTab === "multitier" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Séparation physique et logique des 3 niveaux (Présentation, Traitement d&apos;application, Persistance) avec Load Balancer et DMZ (Slide S12).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80 items-center">
            <div className="p-4 rounded-xl bg-zinc-800/90 border border-cyan-500/30 text-center">
              <Smartphone className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-xs font-semibold text-zinc-100">Clients / Navigateurs</div>
              <div className="text-[10px] text-zinc-400 mt-1">Requêtes HTTPS</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/90 border border-purple-500/30 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-xs font-semibold text-zinc-100">WAF & Load Balancer</div>
              <div className="text-[10px] text-zinc-400 mt-1">Zone DMZ sécurisée</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/90 border border-amber-500/30 text-center">
              <Server className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <div className="text-xs font-semibold text-zinc-100">Serveurs d&apos;App (Business Tier)</div>
              <div className="text-[10px] text-zinc-400 mt-1">Cluster Tomcat / EJB</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/90 border border-emerald-500/30 text-center">
              <Database className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <div className="text-xs font-semibold text-zinc-100">Data Tier (SQL Cluster)</div>
              <div className="text-[10px] text-zinc-400 mt-1">Réplication Maître / Esclave</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
            ℹ️ <strong>Avancée :</strong> Indépendance de déploiement de la logique métier par rapport aux postes clients, mais base de données toujours partagée.
          </div>
        </div>
      )}

      {activeTab === "soa" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            L&apos;architecture orientée services (SOA) expose des services à gros grain réutilisables, mais dépend lourdement d&apos;un bus d&apos;entreprise central (ESB).
          </p>
          <div className="p-6 bg-zinc-900/60 rounded-xl border border-zinc-800/80 space-y-4">
            <div className="flex justify-around text-center">
              <div className="p-2.5 px-4 bg-zinc-800 rounded-lg border border-zinc-700 text-xs text-zinc-200">App Web Client</div>
              <div className="p-2.5 px-4 bg-zinc-800 rounded-lg border border-zinc-700 text-xs text-zinc-200">App Mobile Partenaire</div>
              <div className="p-2.5 px-4 bg-zinc-800 rounded-lg border border-zinc-700 text-xs text-zinc-200">Système ERP Interne</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-900/40 via-amber-900/40 to-purple-900/40 rounded-xl border-2 border-purple-500/50 text-center">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">Enterprise Service Bus (ESB) Central</div>
              <div className="text-[11px] text-zinc-400 mt-1">Routage SOAP/XML, transformation de messages, orchestration lourde</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-zinc-800/90 rounded-lg border border-zinc-700 text-xs text-zinc-300">Service Comptabilité (Coarse)</div>
              <div className="p-3 bg-zinc-800/90 rounded-lg border border-zinc-700 text-xs text-zinc-300">Service Logistique (Coarse)</div>
              <div className="p-3 bg-zinc-800/90 rounded-lg border border-zinc-700 text-xs text-zinc-300">Service CRM (Coarse)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "microservices" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Chaque microservice est à <strong>grain fin</strong>, autonome, géré par une <strong>Two-Pizza Team</strong>, possède sa propre base de données et communique via des API REST/gRPC légères.
          </p>
          <div className="p-6 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
            <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/40 text-center mb-6">
              <span className="text-xs font-semibold text-cyan-300">API Gateway / Reverse Proxy (Traefik, Nginx, Envoy)</span>
              <div className="text-[10px] text-zinc-400 mt-0.5">Routage dynamique, authentification JWT, limitation de débit</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-800/80 border border-emerald-500/30 text-center space-y-2">
                <span className="text-xs font-bold text-emerald-400">Microservice Paiement</span>
                <div className="text-[11px] text-zinc-300">Langage : <strong>Scala / Play</strong></div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-700/60 text-[10px] text-zinc-300 flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  PostgreSQL Dédié
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/80 border border-amber-500/30 text-center space-y-2">
                <span className="text-xs font-bold text-amber-400">Microservice Notification</span>
                <div className="text-[11px] text-zinc-300">Langage : <strong>Python / Flask</strong></div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-700/60 text-[10px] text-zinc-300 flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  Redis / PubSub Dédié
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/80 border border-cyan-500/30 text-center space-y-2">
                <span className="text-xs font-bold text-cyan-400">Microservice Catalogue</span>
                <div className="text-[11px] text-zinc-300">Langage : <strong>Node.js / Express</strong></div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-700/60 text-[10px] text-zinc-300 flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  MongoDB Dédié
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <strong>Propriétés clés :</strong> Isolation stricte des pannes, scalabilité ciblée par service, déploiement continu sans coordination lourde.
          </div>
        </div>
      )}
    </div>
  );
};
