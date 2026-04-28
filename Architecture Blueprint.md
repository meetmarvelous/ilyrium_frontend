# Ilyrium Architecture Blueprint

This document outlines the system architecture and data flow for the Ilyrium RPC platform, detailing how components interact to provide high-availability Solana infrastructure.

---

## 1. System Overview

The Ilyrium architecture is designed as a distributed proxy layer that sits between the end-user and a network of Solana RPC providers. The system is divided into three primary tiers:

1.  **Presentation Tier:** A Next.js-based dashboard for user management, billing, and API key monitoring.
2.  **Engine Tier:** A high-performance Golang routing service for request authentication and provider forwarding.
3.  **Data Tier:** Unified storage using **PostgreSQL** (identity/logs) and **Redis** (real-time state).

---

## 2. Request Lifecycle (The Hot Path)

When a customer makes an RPC request to an Ilyrium endpoint, the following sequence occurs:

1.  **Ingress:** The request hits the Golang Routing Engine at the edge.
2.  **Authentication:** The engine extracts the `API-Key` from the header/URL and queries **Redis** for instant validation.
3.  **Rate Limiting:** If the key is valid, the engine checks the current request-per-second (RPS) window in **Redis**.
4.  **Forwarding:** The engine identifies the most healthy upstream provider (e.g., Helius, QuickNode).
5.  **Proxying:** The request is forwarded, and the response is streamed back to the user.
6.  **Usage Logging:** The engine increments usage counters in **Redis** and periodically flushes logs to **PostgreSQL** for dashboard history.

---

## 3. Component Architecture

### **Core Routing Engine (Golang)**

- **Responsibilities:** Signature verification, load balancing, provider failover logic, and usage tracking.
- **Performance Goal:** Total overhead added by the proxy layer must remain below 3ms.

### **Management Dashboard (Next.js)**

*   **Responsibilities:** Plan selection, Solana-native payment integration, API key CRUD operations, and real-time usage visualization.
*   **Security:** JWT-based sessions with support for both email and wallet-based authentication.

### **Data Storage Strategy**

- **PostgreSQL:** Central database for users, plans, API keys, and historical usage logs.
- **Redis:** Cache for "Active" API keys and real-time rate-limit counters.

---

## 4. Network & Connectivity

### **Deployment Strategy**
The MVP will be deployed on **Vercel** to maximize operational efficiency and deployment speed. This provides a unified platform for both the Next.js dashboard and the Go-based routing logic (via Vercel Functions/Edge). Global scaling is managed through Vercel's global edge network.

### **Provider Redundancy**

The engine maintains a list of fallback providers. If the primary provider fails, the engine tries the secondary provider before returning an error to the user.

---

## 5. Testing & Quality Assurance

To ensure the reliability of the RPC infrastructure, a multi-stage testing strategy is implemented, covering local development, performance benchmarking, and resilience.

### **Testing Environments**

- **Local Backend Testing:** A local Solana cluster (`solana-test-validator`) is used during the development of the Golang engine. This eliminates network latency and cost during the initial logic validation.
- **Integration Testing:** The platform utilizes the "Free Tier" and "Devnet" endpoints of major upstream providers to verify request-response compatibility without incurring infrastructure costs.

### **Performance & Load Testing**

- **Concurrency Validation:** Utilizing tools such as **k6** or **Locust**, the routing engine is subjected to simulated bursts of 10,000+ concurrent requests. This verifies that the Redis-based rate-limiting and Go-routine management remain stable under extreme pressure.
- **Latency Benchmarking:** Continuous monitoring of the proxy "drift" (the time added by the Ilyrium layer) to ensure overhead remains below the 3ms target.

### **Resilience & Chaos Testing**

- **Provider Failover:** Manual simulation of provider outages (e.g., returning HTTP 500/504 errors) is used to verify that the routing engine correctly identifies unhealthy nodes and reroutes traffic within the sub-second threshold.
- **Edge Reliability:** Testing the Geo-DNS routing to ensure users are consistently directed to the optimal regional instance based on their physical location.

---

## 6. Development Milestones

1.  **Milestone 1:** Prototype the Golang Proxy with basic Redis rate-limiting.
2.  **Milestone 2:** Integrate Next.js dashboard with PostgreSQL for API key management.
3.  **Milestone 3:** Implement PostgreSQL batch logging for usage history.
4.  **Milestone 4:** Integrate Solana-native payments (New Wallet).

This architecture ensures that Ilyrium can scale horizontally to handle millions of requests while maintaining the reliability required for production-grade Solana applications.
