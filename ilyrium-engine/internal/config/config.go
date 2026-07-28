package config

import (
	"os"
)

type Config struct {
	Port           string
	RedisURL       string
	UpstreamRPCURL string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379" // default
	}

	upstream := os.Getenv("UPSTREAM_RPC_URL")
	if upstream == "" {
		upstream = "https://api.devnet.solana.com"
	}

	return &Config{
		Port:           port,
		RedisURL:       redisURL,
		UpstreamRPCURL: upstream,
	}
}
