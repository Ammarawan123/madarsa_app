import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

interface LoginBody {
  email: string;
  password: string;
}

interface VerifyOtpBody {
  email: string;
  code: string;
}

interface RefreshBody {
  refreshToken?: string;
}

// 1. Login Handler
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body || {};

  if (!email || !password) {
    return reply.status(400).send({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const result = await AuthService.initiateLogin(email, password);
    return reply.status(200).send({
      success: true,
      message: result.message,
      data: { email: result.email },
    });
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return reply.status(401).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    return reply.status(500).send({
      success: false,
      message: 'Login failed',
    });
  }
}

// 2. Verify OTP Handler
export async function verifyOtpHandler(
  request: FastifyRequest<{ Body: VerifyOtpBody }>,
  reply: FastifyReply
) {
  const { email, code } = request.body || {};

  if (!email || !code) {
    return reply.status(400).send({
      success: false,
      message: 'Email and OTP code are required',
    });
  }

  try {
    const user = await AuthService.completeLogin(email, code);

    // Tokens Issue karein
    const { accessToken, refreshToken } = await AuthService.issueTokens(
      request.server,
      user.id,
      user.role
    );

    return reply.status(200).send({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error.message === 'INVALID_OR_EXPIRED_OTP') {
      return reply.status(400).send({
        success: false,
        message: 'Invalid or expired OTP code',
      });
    }
    return reply.status(500).send({
      success: false,
      message: 'OTP verification failed',
    });
  }
}

// 3. Refresh Token Handler
export async function refreshHandler(
  request: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply
) {
  const { refreshToken } = request.body || {};

  if (!refreshToken) {
    return reply.status(400).send({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    const newAccessToken = await AuthService.refreshAccessToken(
      request.server,
      refreshToken
    );

    return reply.status(200).send({
      success: true,
      message: 'Access token refreshed successfully',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Invalid or revoked refresh token',
    });
  }
}

// 4. Logout Handler
export async function logoutHandler(
  request: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply
) {
  const { refreshToken } = request.body || {};

  if (!refreshToken) {
    return reply.status(400).send({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    await AuthService.logout(refreshToken);
    return reply.status(200).send({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'Failed to complete logout',
    });
  }
}