# eTicketing

## Documentation

I added a basic authentication for actions like booking and cancelling a ticket, I didn't add a signup flow as it was out of the scope for the project, so I populated the database with some user accounts, which are

User one

username: user1

password: password1

User two

username: user2

password: password2

User three

username: user3

password: password3

- [Complete Documentation can be found here](https://documenter.getpostman.com/view/11784799/2sAYX6q35q)

# Setup and Running Instructions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   `git clone https://github.com/yourusername/eticketing.git
cd eticketing`

2. Install dependencies
   `npm install`

3. create a .env file in the root directory with these environment variables

`DEV_DATABASE_URL=postgresql://postgres.cwpbdafsoilcdeionilp:FHtud5LS-CpyhnV@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
TEST_DATABASE_URL=postgresql://postgres.xcvcdagrgmublebhbtar:FHtud5LS-CpyhnV@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
PORT=9999`

4. Run the development server
   `npm run dev`

5. Testing
   `npm test`

The test coverage result can be found in the "coverage" folder in the root directly. Kindly navigate to the file and open the index.html file in it. This file will be auto matically updated everytime the test is run

## Design Choices

## Technology Stack

Apart from Nodejs and express that were required for this project, I also used

- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5) that supports various databases, including PostgreSQL. It provides a clean and easy-to-use API for database operations.

- **PostgreSQL**: A powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.

## Rate Limiting

- **express-rate-limit**: An out of the box tool for rate limiting. I went ahead to make it as simple as possible by just limiting request per ip address to 30 requests per minute. I can also have this customized for any use case

## Error Handling

- I added a centralized error handling to make my responses both success and failures consistent across all endpoints. This will make things easier for the client and also when integrating with the api.

## Database schema

I made the user entity as simple as possible because not much information is required from them. The event entity, include relevant event details and relations like bookings and waitlists using decoratorts like oneToMant, ManyToOne etc. This will make tracking easier and and relationships between entities well established. OnToMany between Event , bookings and waitlist because an event can be booked by many users and also many users can be waitlisted for an event.
