# Receipt Processor

A Node.js application to process receipts and calculate points based on specific rules.

## Prerequisites

- Node installed on your system.

## Setup and Run

1. Clone the repository.
2. RUN npm install
3. RUN node server.jsn 

## Postman collections
1.   curl --location 'http://localhost:3000/receipts/process' \
   --header 'Content-Type: application/json' \
   --data '{
   "retailer": "Target",
   "purchaseDate": "2022-01-01",
   "purchaseTime": "13:01",
   "items": [
      {
         "shortDescription": "Mountain Dew 12PK",
         "price": "6.49"
      },{
         "shortDescription": "Emils Cheese Pizza",
         "price": "12.25"
      },{
         "shortDescription": "Knorr Creamy Chicken",
         "price": "1.26"
      },{
         "shortDescription": "Doritos Nacho Cheese",
         "price": "3.35"
      },{
         "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
         "price": "12.00"
      }
   ],
   "total": "35.35"
   }'

 2.  curl --location 'http://localhost:3000/receipts/{id}/points'