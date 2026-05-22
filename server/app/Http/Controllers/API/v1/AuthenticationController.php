<?php
namespace App\Http\Controllers\API\v1;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;
use App\Models\User;
class AuthenticationController extends Controller
{
    use ApiResponse;
    
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'       => ['required', 'string', 'email'],
            'password'    => ['required', 'string'],
            'device_name' => ['sometimes', 'string'], // Mobile only
        ]);
        if (!Auth::attempt($request->only('email', 'password'))) {
            ActivityLog::create([
    'user_id' => null,
    'activity' => 'Failed login attempt for: ' . $request->email,
]);

            return $this->error('Invalid email or password.', 401);
        }
        /** @var User $user */
        $user = Auth::user();
        
        ActivityLog::create([
    'user_id' => $user->id,
    'activity' => 'Logged in',
]);

        if ($request->filled('device_name')) {
            // Revoke any existing tokens for this device (prevent duplicates)
            $user->tokens()->where('name', $request->device_name)->delete();
            $token = $user->createToken($request->device_name)->plainTextToken;
            return $this->success(
                'Logged in successfully.',
                [
                    'user'  => new UserResource($user),
                    'token' => $token,
                ],
                200
            );
        }
 
        $request->session()->regenerate();
        return $this->success(
            'Logged in successfully.',
            ['user' => new UserResource($user)],
            200
        );
    }
    /**
     * Return the currently authenticated user.
     *
     * Works for both web (session) and mobile (Bearer token)
     * because Sanctum's auth middleware handles both guards.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            'Authenticated user retrieved.',
            ['user' => new UserResource($request->user())],
            200
        );
    }
    /**
     * Log out the current user.
     *
     * - Mobile: revokes the current access token.
     * - Web: invalidates the session.
     */
    public function logout(Request $request): JsonResponse
    {
        // ──────────────────────────────────────────
        // MOBILE: revoke the Bearer token used for this request
        // ──────────────────────────────────────────
        if ($request->user()->currentAccessToken() &&
            method_exists($request->user()->currentAccessToken(), 'delete')) {
            $request->user()->currentAccessToken()->delete();
            return $this->success('Logged out successfully.', null, 200);
        }
        // ──────────────────────────────────────────
        // WEB SPA: invalidate the session (unchanged)
        // ──────────────────────────────────────────
        ActivityLog::create([
    'user_id' => $request->user()->id,
    'activity' => 'Logged out',
]);
        
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success('Logged out successfully.', null, 200);
    }
}