import { jest } from '@jest/globals';
import { isAdmin } from "../middilware/rolemiddilware.js";

describe('Role Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('Should allow access for admin user', () => {
        req.user = { role: 'admin' };
        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();  // Should proceed to next()
    });

    test('Should deny access for non-admin user', () => {
        req.user = { role: 'user' };  // Not admin
        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    });

    test('Should deny access if user is not authenticated', () => {
        req.user = undefined;  // No user
        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    });
});
