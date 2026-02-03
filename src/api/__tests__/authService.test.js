import { authService } from '../authService';
import client from '../client';
import { ENDPOINTS } from '../endpoints';

jest.mock('../client');

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return data on successful login', async () => {
            const credentials = { email: 'test@example.com', password: 'password' };
            const responseData = {
                user: { id: 1, email: 'test@example.com' },
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            };

            client.post.mockResolvedValue({ data: responseData });

            const result = await authService.login(credentials);

            expect(client.post).toHaveBeenCalledWith(ENDPOINTS.LOGIN, credentials);
            expect(result).toEqual(responseData);
        });

        it('should throw formatted error on login failure', async () => {
            const credentials = { email: 'test@example.com', password: 'wrong' };
            const error = {
                response: {
                    status: 401,
                    data: { message: 'Invalid credentials. Please try again.' },
                },
            };

            client.post.mockRejectedValue(error);

            await expect(authService.login(credentials)).rejects.toThrow(
                'Invalid credentials. Please try again.'
            );
        });
    });

    describe('register', () => {
        it('should return data on successful registration', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
            };
            const responseData = {
                user: { ...userData, id: 1 },
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            };

            client.post.mockResolvedValue({ data: responseData });

            const result = await authService.register(userData);

            expect(client.post).toHaveBeenCalledWith(ENDPOINTS.REGISTER, userData);
            expect(result).toEqual(responseData);
        });

        it('should throw formatted error on registration failure', async () => {
            const userData = { email: 'test@example.com' };
            const error = {
                response: {
                    status: 409,
                    data: { message: 'An account with this email already exists.' },
                },
            };

            client.post.mockRejectedValue(error);

            await expect(authService.register(userData)).rejects.toThrow(
                'An account with this email already exists.'
            );
        });
    });

    describe('logout', () => {
        it('should call logout endpoint if configured and return success', async () => {
            // Assuming the commented out code might be uncommented later, 
            // but for now it just returns success.
            // If client.post was uncommented in source:
            // client.post.mockResolvedValue({});

            const result = await authService.logout();

            expect(result).toEqual({ success: true });
        });
    });
});
