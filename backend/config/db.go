package config

import (
	"fmt"

	"customer.com/customer_backend/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.Users{},
		&entity.Problem{},
	)

	db.AutoMigrate(
		&entity.Users{},
	)

	hashedPassword, _ := HashPassword("1234")
	User := &entity.Users{
		Firstname: "Software",
		Lastname:  "Analysis",
		Username:  "sa@gmail.com",
		Password:  hashedPassword,
	}
	db.FirstOrCreate(User, &entity.Users{
		Username: "sa@gmail.com",
	})

}
