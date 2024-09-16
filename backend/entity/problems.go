package entity

import (
	"time"

	"gorm.io/gorm"
)

type Problem struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	UserID      int64     `json:"user_id"`
	DT          time.Time `json:"dt"`
	User        *Users    `gorm:"references:id"`
}
