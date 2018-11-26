const userSchema = `
	type User {
		id: ID!
		name: String
		email: String
		password: String
	}
	type UserWithAToken {
		token: String!
		user: User
	}
	input UserInput {
		name: String
		email: String!
		password: String!
	}
	type Query {
		getUser(userId: String): User
	}
	type Mutation {
		signup(user: UserInput): UserWithAToken
		login(userName: String!, password: String!): UserWithAToken
	}
`;

export default userSchema;