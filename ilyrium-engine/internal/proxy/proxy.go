package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
)

// NewReverseProxy creates a reverse proxy that forwards requests to the given upstream URL
func NewReverseProxy(upstreamURL string) (*httputil.ReverseProxy, error) {
	parsedURL, err := url.Parse(upstreamURL)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(parsedURL)

	// Modify the director to ensure we forward correctly
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = parsedURL.Host
		// Any custom headers can be manipulated here before forwarding
	}

	return proxy, nil
}
