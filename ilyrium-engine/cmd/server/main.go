package main

import (
	"fmt"
	"log"
	"net/http"

	"ilyrium-engine/internal/config"
	"ilyrium-engine/internal/middleware"
	"ilyrium-engine/internal/proxy"

	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
)

func main() {
	cfg := config.Load()

	// Initialize Redis Connection
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.RedisURL,
	})

	// Create reverse proxy to Solana RPC
	reverseProxy, err := proxy.NewReverseProxy(cfg.UpstreamRPCURL)
	if err != nil {
		log.Fatalf("Failed to create reverse proxy: %v", err)
	}

	// Initialize router
	r := chi.NewRouter()

	// Attach Middlewares
	r.Use(middleware.AuthMiddleware(rdb))
	r.Use(middleware.RateLimitMiddleware(rdb, 10)) // Example: 10 RPS limit

	// Forward all matching traffic to the proxy
	r.HandleFunc("/*", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy.ServeHTTP(w, r)
	})

	fmt.Printf("Ilyrium Routing Engine starting on port %s\n", cfg.Port)
	fmt.Printf("Upstream provider: %s\n", cfg.UpstreamRPCURL)
	fmt.Printf("Redis connected at: %s\n", cfg.RedisURL)

	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
