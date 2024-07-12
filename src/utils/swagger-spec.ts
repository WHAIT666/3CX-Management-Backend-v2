const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "3CX Management API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Admin",
        description: "Admin endpoints",
      },
      {
        name: "Centrals",
        description: "Central management endpoints",
      },
    ],
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          description: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateSessionInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully logged in",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: {
                        type: "string",
                      },
                      refreshToken: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Invalid email or password",
            },
          },
        },
      },
      "/api/auth/refresh-token": {
        post: {
          tags: ["Auth"],
          summary: "Refresh Token",
          description: "Refresh access token using refresh token",
          responses: {
            200: {
              description: "Successfully refreshed token",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Could not refresh access token",
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          description: "Logout the user",
          responses: {
            200: {
              description: "Successfully logged out",
            },
            400: {
              description: "No refresh token provided",
            },
            401: {
              description: "Invalid refresh token",
            },
          },
        },
      },
      "/api/users": {
        post: {
          tags: ["Users"],
          summary: "Create a new user",
          description: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateUserInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "User successfully created",
            },
            409: {
              description: "Account already exists",
            },
          },
        },
      },
      "/api/users/verify/{id}/{verificationCode}": {
        post: {
          tags: ["Users"],
          summary: "Verify a user",
          description: "Verify user email with verification code",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "User ID",
            },
            {
              in: "path",
              name: "verificationCode",
              required: true,
              schema: {
                type: "string",
              },
              description: "Verification code",
            },
          ],
          responses: {
            200: {
              description: "User successfully verified",
            },
            400: {
              description: "Could not verify user",
            },
          },
        },
      },
      "/api/users/forgotpassword": {
        post: {
          tags: ["Users"],
          summary: "Forgot password",
          description: "Request password reset",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForgotPasswordInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password reset email sent",
            },
          },
        },
      },
      "/api/users/resetpassword/{id}/{passwordResetCode}": {
        post: {
          tags: ["Users"],
          summary: "Reset password",
          description: "Reset user password",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "User ID",
            },
            {
              in: "path",
              name: "passwordResetCode",
              required: true,
              schema: {
                type: "string",
              },
              description: "Password reset code",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResetPasswordInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully updated password",
            },
            400: {
              description: "Could not reset user password",
            },
          },
        },
      },
      "/api/users/me": {
        get: {
          tags: ["Users"],
          summary: "Get current user",
          description: "Get the authenticated user's information",
          responses: {
            200: {
              description: "User information",
            },
          },
        },
      },
      "/api/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "Get all users",
          description: "Get a list of all users (admin only)",
          responses: {
            200: {
              description: "List of users",
            },
            403: {
              description: "Access forbidden",
            },
          },
        },
      },
      "/api/centrals": {
        post: {
          tags: ["Centrals"],
          summary: "Create a new central",
          description: "Register a new central",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateCentralInput",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Central successfully created",
            },
            409: {
              description: "Central with this name already exists",
            },
          },
        },
        get: {
          tags: ["Centrals"],
          summary: "Get all centrals",
          description: "Retrieve all centrals",
          responses: {
            200: {
              description: "List of centrals",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/centrals/{id}": {
        get: {
          tags: ["Centrals"],
          summary: "Get central by ID",
          description: "Retrieve a central by its ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Central ID",
            },
          ],
          responses: {
            200: {
              description: "Central found",
            },
            404: {
              description: "Central not found",
            },
          },
        },
        put: {
          tags: ["Centrals"],
          summary: "Update central",
          description: "Update a central's information",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Central ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateCentralInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Central updated",
            },
            404: {
              description: "Central not found",
            },
          },
        },
        delete: {
          tags: ["Centrals"],
          summary: "Delete central",
          description: "Delete a central",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Central ID",
            },
          ],
          responses: {
            200: {
              description: "Central deleted",
            },
            404: {
              description: "Central not found",
            },
          },
        },
      },
      "/api/systemstatus": {
        get: {
          tags: ["Centrals"],
          summary: "Get system status",
          description: "Retrieve system status",
          responses: {
            200: {
              description: "System status",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/systemextensions": {
        get: {
          tags: ["Centrals"],
          summary: "Get system extensions",
          description: "Retrieve system extensions",
          responses: {
            200: {
              description: "System extensions",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        CreateSessionInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "stringPassw0rd",
            },
          },
        },
        CreateUserInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "passwordConfirmation"],
          properties: {
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              example: "Passw0rd!",
            },
            passwordConfirmation: {
              type: "string",
              example: "Passw0rd!",
            },
          },
        },
        ForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
          },
        },
        ResetPasswordInput: {
          type: "object",
          required: ["password", "passwordConfirmation"],
          properties: {
            password: {
              type: "string",
              example: "NewPassw0rd!",
            },
            passwordConfirmation: {
              type: "string",
              example: "NewPassw0rd!",
            },
          },
        },
        CreateCentralInput: {
          type: "object",
          required: ["name", "ipAddress", "status"],
          properties: {
            name: {
              type: "string",
              example: "Central Name",
            },
            ipAddress: {
              type: "string",
              example: "192.168.1.1",
            },
            status: {
              type: "string",
              example: "active",
            },
          },
        },
        UpdateCentralInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Central Name",
            },
            ipAddress: {
              type: "string",
              example: "192.168.1.1",
            },
            status: {
              type: "string",
              example: "active",
            },
          },
        },
      },
    },
  };
  
  export default swaggerDocument;
  