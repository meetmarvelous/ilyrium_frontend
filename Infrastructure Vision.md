# Ilyrium Infrastructure & Deployment Roadmap

This document defines the primary technical strategy for Ilyrium, focusing on a software-first foundation with optional scalability paths for future expansion.

---

## 1. The Two Implementation Paths

Ilyrium can be implemented using either a hardware-heavy or a pure software-based approach. Both models are viable, serving different stages of business growth.

### **Path A: Hardware-Heavy (The Infrastructure Native)**
*   **What it is:** The acquisition or rental of bare-metal servers to host internal Solana validator/RPC nodes.
*   **Pros:** Maximized profit margins (no intermediary costs), minimized latency, and full stack control.
*   **Cons:** Significant upfront capital expenditure, high technical complexity, and downtime risk if physical components fail.

### **Path B: Pure Software (The Intelligent Aggregator)**
*   **What it is:** The development of a lightweight "meta-layer" that connects to 3rd-party providers (Helius, QuickNode, Triton) via API.
*   **Pros:** Low initial costs, instant scalability, and high-availability (if a provider fails, the system switches to an alternative).
*   **Cons:** Dependence on 3rd-party uptime and slightly higher latency due to the proxy jump.

---

## 2. Primary Strategy: Phase 1 (Software-Only Aggregation)

The preferred implementation for Ilyrium focuses on a **Pure Software Layer**. This approach leverages existing high-tier Solana RPC providers through a centralized, high-performance proxy.

### **Core Benefits of the Software-First Approach**
*   **Infrastructure Resilience:** Total reliance on a single server is eliminated. In the event of a provider failure, the system automatically redirects traffic to a functional alternative, ensuring near 100% uptime.
*   **Rapid Market Entry:** Development focuses on the user platform and routing logic rather than the logistical challenges of bare-metal server management.
*   **Capital Efficiency:** Operational costs are limited to software hosting and provider subscriptions, avoiding the high capital expenditure associated with Solana node hardware.
### **Solana (Native Crypto)**
*   **Functionality:** Direct, on-chain settlement for subscriptions using native SOL or SPL tokens (USDC).
*   **Target:** Web3-native teams and developers who prefer decentralized settlement and instant finality.
*   **Implementation:** A newly generated dedicated wallet will handle all incoming revenue.
*   **Global Reach:** Geographic low-latency is achieved by routing users to the nearest regional provider endpoint via software logic.

---

## 3. Optional Strategic Upgrades

While the Phase 1 software model is sufficient for long-term operations, the following upgrades are available as the platform scales.

### **Deployment Strategy**
The MVP will be deployed on **Vercel** to maximize operational efficiency and deployment speed. Global edge expansion can be implemented via Vercel's Edge Network in future growth phases.
*   **Deployment:** 1-2 proprietary bare-metal servers are integrated into the existing proxy network.
*   **Utility:** These local nodes handle "baseline" traffic, while the software aggregator handles overflow and emergency failover.

### **Option B: The Native Network (Long-term)**
For total vertical integration, the platform can evolve into a **Proprietary RPC Network**.
*   **Deployment:** A globally distributed network of proprietary Solana nodes.
*   **Utility:** This removes all dependency on third-party providers, offering the highest level of control and the maximum possible profit margins.

---

## 4. Implementation Stack (Phase 1 Focused)

The following technologies are selected for their ability to support Phase 1 operations while remaining compatible with future hybrid upgrades.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **User Platform** | **Next.js + Tailwind** | Fast, responsive UI for account management. |
| **Routing Engine** | **Golang** | High-performance request forwarding with minimal overhead. |
| **Data Layer** | **PostgreSQL (Supabase)**| Unified storage for users, API keys, and usage statistics. |
| **Caching** | **Redis** | Real-time rate limiting and API key session caching. |
| **Settlement** | **Solana (Native Crypto)** | On-chain payments using a dedicated Solana wallet. |

---

## 4. Execution Summary

The immediate focus is the completion of the **Phase 1 Software Aggregator**. This ensures a stable, high-availability service for launch. The platform will be hosted on **Vercel** for maximum reliability and deployment speed. Upgrading to Hybrid or Native infrastructure remains an optional secondary objective for when the user base reaches a critical mass and margin optimization becomes a priority.
