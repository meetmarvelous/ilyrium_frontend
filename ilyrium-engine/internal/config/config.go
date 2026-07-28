package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port             string
	RedisURL         string
	PrimaryRPCURL    string
	FallbackRPCURL   string
	DatabaseURL      string
	FlushIntervalSec int
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379"
	}

	primaryRPC := os.Getenv("PRIMARY_RPC_URL")
	if primaryRPC == "" {
		primaryRPC = os.Getenv("UPSTREAM_RPC_URL")
		if primaryRPC == "" {
			primaryRPC = "https://api.devnet.solana.com"
		}
	}

	fallbackRPC := os.Getenv("FALLBACK_RPC_URL")
	if fallbackRPC == "" {
		fallbackRPC = "https://api.mainnet-beta.solana.com"
	}

	dbURL := os.Getenv("DATABASE_URL")

	flushIntervalStr := os.Getenv("FLUSH_INTERVAL_SECONDS")
	flushIntervalSec := 10
	if flushIntervalStr != "" {
		if val, err := strconv.Atoi(flushIntervalStr); err == nil && val > 0 {
			flushIntervalSec = val
		}
	}

	return &Config{
		Port:             port,
		RedisURL:         redisURL,
		PrimaryRPCURL:    primaryRPC,
		FallbackRPCURL:   fallbackRPC,
		DatabaseURL:      dbURL,
		FlushIntervalSec: flushIntervalSec,
	}
}
