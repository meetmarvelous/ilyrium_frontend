package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/redis/go-redis/v9"
)

// AuthMiddleware extracts the API key from the Authorization header and verifies it via Redis.
func AuthMiddleware(rdb *redis.Client) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract API Key from Authorization header (Bearer <key>)
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Unauthorized: missing API key in Authorization header", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Unauthorized: invalid Authorization header format", http.StatusUnauthorized)
				return
			}

			apiKey := parts[1]

			// Check Redis for the API Key
			ctx := context.Background()
			val, err := rdb.Get(ctx, "apikey:"+apiKey).Result()
			if err == redis.Nil {
				http.Error(w, "Unauthorized: invalid API key", http.StatusUnauthorized)
				return
			} else if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if val != "active" {
				http.Error(w, "Forbidden: inactive API key", http.StatusForbidden)
				return
			}

			// Attach the API Key to context for rate limiting
			reqCtx := context.WithValue(r.Context(), APIKeyContextKey, apiKey)
			next.ServeHTTP(w, r.WithContext(reqCtx))
		})
	}
}
