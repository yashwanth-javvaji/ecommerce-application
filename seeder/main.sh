#!/bin/bash

source .env

BASE_URL='http://major-project.com/api'

ACCESS_TOKEN=$(curl --location --request POST "${BASE_URL}/auth/signin" \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "'$ADMIN_EMAIL'", 
    "password": "'$ADMIN_PASSWORD'"
}' | jq -r '.accessToken')


CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Books"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Bose: The Untold Story of an Inconvenient Nationalist",
    "category": "'${CATEGORY_ID}'",
    "description": "A comprehensive and gripping narrative - Vikram Sampath, author, historian and Fellow of Royal Historical Society",
    "brand": "Penguin Books",
    "stock": 1,
    "price": 5000,
    "discount": 0
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/bose_the_untold_story.jpeg"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Cell Phones & Accessories"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Apple iPhone 13",
    "category": "'${CATEGORY_ID}'",
    "description": "15.4 cm (6.1 inch), Super Retina XDR, 128GB ROM | iOS 15, Hexa-Core A15 Bionic Chip Processor, R: 12MP + 12MP | F: 12MP, Proximity Sensor | Facial Unlock",
    "brand": "Apple",
    "stock": 13,
    "price": 79900,
    "discount": 10
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/apple_iphone_13.webp"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Clothing, Shoes and Jewelry"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "USPA Sneakers",
    "category": "'${CATEGORY_ID}'",
    "description": "Relaxed fit, lightweight, high on comfort, pull tab",
    "brand": "US Polo Association",
    "stock": 20,
    "price": 2999,
    "discount": 30
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/uspa_sneakers.jpeg"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Computers"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Apple MacBook Air",
    "category": "'${CATEGORY_ID}'",
    "description": "33.78 cm (13.3 inch), Retina, Apple M1 Chip, RAM: 8GB, ROM: 256GB SSD, Apple M1 GPU",
    "brand": "Apple",
    "stock": 10,
    "price": 92900,
    "discount": 8
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/apple_macbook_air.webp"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Electronics"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "boAt Rockerz On-Ear Wireless Headphone",
    "category": "'${CATEGORY_ID}'",
    "description": "Ideal For: Entertainment | Beginner Audiophiles | Hi-End Audiophiles, HD Immersive Audio, Bluetooth 4.2",
    "brand": "boAt",
    "stock": 15,
    "price": 3990,
    "discount": 70
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/boat_rockerz_wireless_headphone.avif"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Home & Kitchen"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Daikin Split AC",
    "category": "'${CATEGORY_ID}'",
    "description": "0.8 Ton, 3 Star, Approximate Coverage Area – 90 Sq.Ft(8.36Sq.M), Dimension: IDU – 80.00 x 23.50 x 29.80 cm, ODU - 67.50 x 28.40 x 55.00 cms, Rotary Compressor, Cooling Capacity - 2800 Watts",
    "brand": "Daikin",
    "stock": 5,
    "price": 37400,
    "discount": 24
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/daikin_split_ac.avif"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Luggage & Travel Gear"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Trawoc Trekking Backpack",
    "category": "'${CATEGORY_ID}'",
    "description": "Large, spacious and multi utility",
    "brand": "Trawoc",
    "stock": 2,
    "price": 4999,
    "discount": 50
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/trawoc_trekking_backpack.jpeg"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Musical Instruments"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Kadence Electronic Guitar",
    "category": "'${CATEGORY_ID}'",
    "description": "Accessories: Strap, Strings, Picks and Bag Included.",
    "brand": "Kadence",
    "stock": 2,
    "price": 9360,
    "discount": 33
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/kadence_electronic_guitar.jpeg"'

CATEGORY_ID=$(curl --location --request POST "${BASE_URL}/categories" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Sports & Outdoors"
}' | jq -r '.id')
PRODUCT_ID=$(curl --location --request POST "${BASE_URL}/products" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "SG Cricket Kit",
    "category": "'${CATEGORY_ID}'",
    "description": "In-box contents: 1 cricket kit bag, 1 cricket bat, 1 cricket helmet, 1 pair batting pads, 1 pair thigh pads, 1 pair batting gloves and 1 abdominal guard",
    "brand": "Sanspareils Greenlands",
    "stock": 20,
    "price": 5499,
    "discount": 4
}' | jq -r '.id')
curl --location --request POST "${BASE_URL}/products/${PRODUCT_ID}/upload-product-image" \
--header "Authorization: Bearer ${ACCESS_TOKEN}" \
--form 'file=@"./product-images/sg_cricket_kit.jpeg"'