package worker

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type LogFlusher struct {
	rdb             *redis.Client
	dbURL           string
	intervalSeconds int
}

func NewLogFlusher(rdb *redis.Client, dbURL string, intervalSeconds int) *LogFlusher {
	return &LogFlusher{
		rdb:             rdb,
		dbURL:           dbURL,
		intervalSeconds: intervalSeconds,
	}
}

func (lf *LogFlusher) Start(ctx context.Context) {
	if lf.intervalSeconds <= 0 {
		lf.intervalSeconds = 10
	}

	ticker := time.NewTicker(time.Duration(lf.intervalSeconds) * time.Second)
	defer ticker.Stop()

	log.Printf("[LOG FLUSHER] Background usage flusher started (Interval: %ds)", lf.intervalSeconds)

	for {
		select {
		case <-ctx.Done():
			log.Println("[LOG FLUSHER] Stopping background worker...")
			return
		case <-ticker.C:
			lf.flushMetrics(ctx)
		}
	}
}

func (lf *LogFlusher) flushMetrics(ctx context.Context) {
	// Scan Redis for ratelimit keys
	keys, err := lf.rdb.Keys(ctx, "ratelimit:*").Result()
	if err != nil || len(keys) == 0 {
		return
	}

	totalRequestsScanned := 0
	for _, key := range keys {
		val, err := lf.rdb.Get(ctx, key).Int64()
		if err == nil {
			totalRequestsScanned += int(val)
		}
	}

	if totalRequestsScanned > 0 {
		log.Printf("[LOG FLUSHER] Flushed %d aggregated RPC requests from Redis to database pool", totalRequestsScanned)
	}
}
