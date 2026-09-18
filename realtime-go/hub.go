package main

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type VisitorMessage struct {
	Type      string    `json:"type"` // "presence", "cursor", "join", "leave"
	VisitorID string    `json:"visitorId"`
	X         float64   `json:"x"`
	Y         float64   `json:"y"`
	Dimension string    `json:"dimension"`
	Color     string    `json:"color"`
	Timestamp time.Time `json:"timestamp"`
	Count     int       `json:"count,omitempty"`
}

type Client struct {
	hub       *Hub
	conn      *websocket.Conn
	send      chan []byte
	visitorID string
	color     string
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			count := len(h.clients)
			h.mu.Unlock()

			msg, _ := json.Marshal(VisitorMessage{
				Type:      "presence",
				VisitorID: client.visitorID,
				Color:     client.color,
				Count:     count,
				Timestamp: time.Now(),
			})
			h.broadcastMessage(msg)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			count := len(h.clients)
			h.mu.Unlock()

			msg, _ := json.Marshal(VisitorMessage{
				Type:      "leave",
				VisitorID: client.visitorID,
				Count:     count,
				Timestamp: time.Now(),
			})
			h.broadcastMessage(msg)

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *Hub) broadcastMessage(message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for client := range h.clients {
		select {
		case client.send <- message:
		default:
			log.Println("Dropping message for slow client")
		}
	}
}
