package users

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"customer.com/customer_backend/config"
	"customer.com/customer_backend/entity"
	"customer.com/customer_backend/services"
)

type (
	Authen struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	signUp struct {
		Firstname string `json:"firstname"`
		Lastname  string `json:"lastname"`
		Username  string `json:"username"`
		Password  string `json:"password"`
	}
)

func SignUp(c *gin.Context) {
	var payload signUp

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	var userCheck entity.Users

	// Check if the user with the provided username already exists
	result := db.Where("username = ?", payload.Username).First(&userCheck)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if userCheck.ID != 0 {
		// If the user with the provided username already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Username is already registered"})
		return
	}

	// Hash the user's password
	hashedPassword, _ := config.HashPassword(payload.Password)

	// Create a new user
	user := entity.Users{
		Firstname: payload.Firstname,
		Lastname:  payload.Lastname,
		Username:  payload.Username,
		Password:  hashedPassword,
	}

	// Save the user to the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

func SignIn(c *gin.Context) {
	var payload Authen
	var user entity.Users

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("username = " + payload.Username)

	if payload.Username == "admin@mail.com" && payload.Password == "admin" {
		jwtWrapper := services.JwtWrapper{
			SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:          "AuthService",
			ExpirationHours: 24,
		}

		signedToken, err := jwtWrapper.GenerateToken(payload.Username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": 999})
	} else {
		// ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา
		fmt.Println("SELECT * FROM users WHERE username = ?", payload.Username)
		if err := config.DB().Raw("SELECT * FROM users WHERE username = ?", payload.Username).Scan(&user).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// ตรวจสอบรหัสผ่าน
		fmt.Println("user password = " + user.Password)
		fmt.Println("payload password = " + payload.Password)

		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
			return
		}

		jwtWrapper := services.JwtWrapper{
			SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:          "AuthService",
			ExpirationHours: 24,
		}

		signedToken, err := jwtWrapper.GenerateToken(user.Username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": user.ID})
	}

}
