package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"ilyrium-engine/internal/config"
	"ilyrium-engine/internal/middleware"
	"ilyrium-engine/internal/proxy"
	"ilyrium-engine/internal/worker"

	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
)

func main() {
	cfg := config.Load()

	// Initialize Redis Connection
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.RedisURL,
	})

	// Create Failover Proxy (Primary -> Fallback)
	failoverProxy, err := proxy.NewFailoverProxy(cfg.PrimaryRPCURL, cfg.FallbackRPCURL)
	if err != nil {
		log.Fatalf("Failed to create failover proxy: %v", err)
	}

	// Start Background Usage Flusher Worker
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	flusher := worker.NewLogFlusher(rdb, cfg.DatabaseURL, cfg.FlushIntervalSec)
	go flusher.Start(ctx)

	// Initialize Router
	r := chi.NewRouter()

	// Attach Middlewares
	r.Use(middleware.AuthMiddleware(rdb))
	r.Use(middleware.RateLimitMiddleware(rdb, 10))

	// Route traffic to Failover Proxy
	r.HandleFunc("/*", func(w http.ResponseWriter, r *http.Request) {
		failoverProxy.ServeHTTP(w, r)
	})

	fmt.Println("==================================================")
	fmt.Println("        ILYRIUM SOLANA ROUTING ENGINE             ")
	fmt.Println("==================================================")
	fmt.Printf("Port:             %s\n", cfg.Port)
	fmt.Printf("Primary RPC:      %s\n", cfg.PrimaryRPCURL)
	fmt.Printf("Fallback RPC:     %s\n", cfg.FallbackRPCURL)
	fmt.Printf("Redis Cache:      %s\n", cfg.RedisURL)
	fmt.Printf("Log Flush SEC:    %ds\n", cfg.FlushIntervalSec)
	fmt.Println("==================================================")

	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
