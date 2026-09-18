package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow cross-origin connections from web frontend
	},
}

func generateColor() string {
	colors := []string{"#00f7ff", "#ff7700", "#a855f7", "#34d399", "#f43f5e", "#38bdf8"}
	return colors[rand.Intn(len(colors))]
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	visitorID := fmt.Sprintf("vis-%d", time.Now().UnixNano()%1000000)
	client := &Client{
		hub:       hub,
		conn:      conn,
		send:      make(chan []byte, 256),
		visitorID: visitorID,
		color:     generateColor(),
	}
	hub.register <- client

	// Writer goroutine
	go func() {
		defer func() {
			client.conn.Close()
		}()
		for message := range client.send {
			if err := client.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}()

	// Reader goroutine
	go func() {
		defer func() {
			hub.unregister <- client
			client.conn.Close()
		}()
		for {
			_, message, err := client.conn.ReadMessage()
			if err != nil {
				break
			}
			hub.broadcast <- message
		}
	}()
}

func main() {
	rand.Seed(time.Now().UnixNano())
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	hub := newHub()
	go hub.run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","service":"realtime-go","timestamp":"%s"}`, time.Now().UTC().Format(time.RFC3339))
	})

	log.Printf("🌌 Real-time Go Presence Server listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe error:", err)
	}
}
