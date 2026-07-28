package proxy

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type FailoverProxy struct {
	primary  *httputil.ReverseProxy
	fallback *httputil.ReverseProxy
}

func createSingleProxy(targetURL string) (*httputil.ReverseProxy, error) {
	parsed, err := url.Parse(targetURL)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(parsed)
	origDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		origDirector(req)
		req.Host = parsed.Host
	}
	return proxy, nil
}

func NewFailoverProxy(primaryURL, fallbackURL string) (*FailoverProxy, error) {
	primaryProxy, err := createSingleProxy(primaryURL)
	if err != nil {
		return nil, err
	}

	fallbackProxy, err := createSingleProxy(fallbackURL)
	if err != nil {
		return nil, err
	}

	return &FailoverProxy{
		primary:  primaryProxy,
		fallback: fallbackProxy,
	}, nil
}

func (fp *FailoverProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Read request body to allow re-sending if primary fails
	var bodyBytes []byte
	if r.Body != nil {
		bodyBytes, _ = io.ReadAll(r.Body)
		r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	}

	// Capture response using ResponseRecorder
	rec := &responseRecorder{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
		body:           &bytes.Buffer{},
	}

	// Attempt Primary
	fp.primary.ServeHTTP(rec, r)

	// If primary failed with 5xx error or connection issue, try fallback
	if rec.statusCode >= 500 || rec.statusCode == 0 {
		log.Printf("[FAILOVER] Primary RPC returned status %d. Switching to fallback provider...", rec.statusCode)

		// Reset request body for fallback attempt
		if bodyBytes != nil {
			r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}

		// Reset recorder
		rec.header = make(http.Header)
		rec.statusCode = http.StatusOK
		rec.body.Reset()

		fp.fallback.ServeHTTP(w, r)
		return
	}

	// Primary succeeded — write recorded response to actual ResponseWriter
	for k, v := range rec.header {
		w.Header()[k] = v
	}
	w.WriteHeader(rec.statusCode)
	w.Write(rec.body.Bytes())
}

type responseRecorder struct {
	http.ResponseWriter
	statusCode int
	header     http.Header
	body       *bytes.Buffer
}

func (r *responseRecorder) Header() http.Header {
	if r.header == nil {
		r.header = make(http.Header)
	}
	return r.header
}

func (r *responseRecorder) WriteHeader(code int) {
	r.statusCode = code
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	return r.body.Write(b)
}
