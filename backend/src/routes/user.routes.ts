import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/user/trusted-devices:
 *   get:
 *     summary: Get list of trusted devices
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of trusted devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device_id:
 *                     type: integer
 *                   device_name:
 *                     type: string
 *                   device_token:
 *                     type: string
 *                   last_used:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/trusted-devices', authenticateToken, userController.getTrustedDevices);

/**
 * @swagger
 * /api/user/trusted-devices/{device_id}:
 *   delete:
 *     summary: Remove a trusted device
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Device ID to remove
 *     responses:
 *       200:
 *         description: Device removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 */
router.delete('/trusted-devices/:device_id', authenticateToken, userController.deleteTrustedDevice);

export default router;


