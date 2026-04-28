# Ilyrium Technical Decisions

This document records the foundational technical selections for the Ilyrium RPC platform, detailing the rationale behind the selected stack for the routing engine, data layer, and payment settlement.

---

## 1. Routing Engine: Golang vs. Rust

The routing engine is the core entry point for all customer RPC requests. The selection depends on the balance between development velocity and micro-latency optimization.

| Feature | Golang (Recommended) | Rust (Expansion) |
| :--- | :--- | :--- |
| **Throughput** | High built-in concurrency. | Maximum hardware efficiency. |
| **Development** | Faster iteration (MVP focus). | Slower build/test cycles. |
| **Cost** | Lower engineering overhead. | Higher maintenance specialist cost. |

**Decision:** **Golang** is selected for the Routing Engine. Its simplicity and "standard library" features allow for a robust proxy build without unnecessary complexity.

---

## 2. Telemetry & Analytics: Redis & ClickHouse

Ilyrium utilizes two distinct database technologies to handle real-time validation and long-term data processing.

### **Redis (In-Memory Access)**
*   **Role:** Instant API key verification and real-time rate-limiting.
*   **Constraint:** Prioritized for speed during the "Hot Path" of an RPC call.

### **PostgreSQL (Unified Data Store)**
*   **Role:** User accounts, billing, and usage archiving.
*   **Rationale:** To avoid overengineering with a secondary analytical database, PostgreSQL will handle usage logs and statistical aggregation for the MVP dashboard.
*   **Future Scaling:** Specialized columnar storage (e.g., ClickHouse) can be integrated if data volume exceeds relational limits.

---

## 3. Payment & Settlement: Solana (Native Crypto)
*   **Functionality:** Direct, on-chain settlement for subscriptions using native SOL or SPL tokens (USDC).
*   **Target:** Web3-native teams and developers who prefer decentralized settlement and instant finality.
*   **Implementation:** All revenue is collected via a newly generated, dedicated project wallet. This avoids the complexity of fiat gateways and KYC requirements for the MVP phase.

---

## 4. Final Architecture Verdict

The Ilyrium infrastructure is built on the following "Best of Both Worlds" stack:

*   **Routing Logic:** Golang
*   **Rate Limiting & Hot State:** Redis
*   **Storage & Analytics:** PostgreSQL
*   **Billing:** Solana (Crypto-only)
*   **User UI:** Next.js
*   **Hosting:** Vercel

---

## 5. Economic & Operational Analysis

The selection of the technical stack is guided by the total cost of ownership (TCO), balancing infrastructure expenditure against engineering resources.

### **Server vs. Engineering Costs**
While Rust offers superior hardware utilization (zero-cost abstractions), the marginal decrease in server costs is offset by increased engineering time. In the initial phases of market entry, the financial priority is placed on **development velocity**.
*   **Golang Implementation:** Lightweight concurrency (Goroutines) allows a single server instance to handle hundreds of thousands of concurrent connections. The simplicity of the language reduces the hours required for feature development and debugging.
*   **Rust Implementation:** While providing the theoretical maximum of hardware performance, the complexity of memory ownership models increases the developmental timeline significantly.

### **The Decision Rationale**
The adoption of Golang ensures that capital is utilized primarily for platform growth rather than specialized engineering maintenance. Infrastructure scaling remains cost-effective due to the high-concurrency nature of the language, while the speed of deployment provides a competitive time-to-market advantage.

This combination ensures that Ilyrium remains performant enough to compete with top-tier RPC providers while maintaining the flexibility to ship updates quickly.
