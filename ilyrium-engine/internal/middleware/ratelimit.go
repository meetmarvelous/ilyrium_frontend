package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

// RateLimitMiddleware applies a simple fixed window rate limit per second based on the API key.
func RateLimitMiddleware(rdb *redis.Client, requestsPerSecond int64) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			apiKey, ok := r.Context().Value(APIKeyContextKey).(string)
			if !ok || apiKey == "" {
				http.Error(w, "Internal Server Error: Missing API key in context", http.StatusInternalServerError)
				return
			}

			// Generate a key based on the current second
			currentSecond := time.Now().Unix()
			redisKey := fmt.Sprintf("ratelimit:%s:%d", apiKey, currentSecond)

			ctx := context.Background()
			count, err := rdb.Incr(ctx, redisKey).Result()
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// Set expiry on the first increment
			if count == 1 {
				rdb.Expire(ctx, redisKey, time.Second*2) // Keep for 2 seconds to be safe
			}

			if count > requestsPerSecond {
				http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
